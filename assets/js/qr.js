document.getElementById('generateQR').addEventListener('click', async () => {
    const userId = 'STUDENT_ID_FROM_LOGIN'; // Replace with actual user ID from login
    const response = await fetch(`http://localhost:5000/api/students/generate/${userId}`);
    const data = await response.json();
    if (data.qrCode) {
        const qrCodeDisplay = document.getElementById('qrCodeDisplay');
        qrCodeDisplay.innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
    } else {
        alert('Failed to generate QR Code');
    }
});
