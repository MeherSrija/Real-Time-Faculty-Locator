const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'potnurumehersrija@gmail.com',
        pass: 'wbeg mlmw jfyt tdlm' // Replace with your actual App Password
    }
});

app.post('/send-welcome', async (req, res) => {
    const { name, email, facultyID, sender } = req.body;
    const mailOptions = {
        from: `"Faculty Dashboard" <${sender}>`,
        to: email, // Faculty's email from sign-up
        subject: 'Welcome to Faculty Dashboard',
        text: `Welcome ${name}!\n\nYou have successfully signed up with Faculty ID: ${facultyID}.\nPlease log in and update your availability status at your earliest convenience.\n\nThank you,\nFaculty Dashboard Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
        res.json({ message: 'Welcome email sent' });
    } catch (error) {
        console.error(`Welcome email error for ${email}:`, error);
        res.status(500).json({ error: 'Failed to send welcome email' });
    }
});

app.post('/send-bulk-reminder', async (req, res) => {
    const { facultyList, date, sender, type } = req.body; // facultyList: [{ facultyID, name, email }, ...]
    const results = [];

    for (const { facultyID, name, email } of facultyList) {
        let subject, text;
        switch (type) {
            case 'expired':
                subject = 'Status Expired - Update Required';
                text = `Dear ${name},\n\nYour availability status for ${date} has expired (8-hour limit reached).\nPlease update your status to "Present" or "Leave" as soon as possible.\n\nThank you,\nFaculty Dashboard Team`;
                break;
            case 'daily':
                subject = 'Daily Status Update Reminder';
                text = `Good Morning ${name},\n\nIt’s 10 AM on ${date}, and you haven’t updated your availability status yet.\nPlease log in and update it for the sake of students.\n\nThank you,\nFaculty Dashboard Team`;
                break;
            default:
                subject = 'Status Update Reminder';
                text = `Dear ${name},\n\nPlease update your availability status for ${date}.\n\nThank you,\nFaculty Dashboard Team`;
        }

        const mailOptions = {
            from: `"Faculty Dashboard" <${sender}>`,
            to: email, // Faculty's email from sign-up
            subject,
            text
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`${type} reminder sent to ${email}`);
            results.push({ facultyID, status: 'sent' });
        } catch (error) {
            console.error(`${type} reminder error for ${email}:`, error);
            results.push({ facultyID, status: 'failed', error: error.message });
        }
    }

    res.json({ message: `${type} reminders processed`, results });
});

app.get('/test-email', async (req, res) => {
    const mailOptions = {
        from: '"Faculty Dashboard" <potnurumehersrija@gmail.com>',
        to: 'potnurumehersrija2607@gmail.com', // Test email only to sender, not faculty
        subject: 'Test Email',
        text: 'Good Morning Faculty!!! As students need your availability status to reach you out, please update your presence in the college as soon as possible.'
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Test email sent to potnurumehersrija@gmail.com');
        res.send('Test email sent');
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/test', (req, res) => res.send('Server is running'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));