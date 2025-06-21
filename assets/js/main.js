document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/students/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            regNo: document.getElementById('regNo').value,
            year: document.getElementById('year').value,
            branch: document.getElementById('branch').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
        }),
    });
    const data = await response.json();
    alert(data.message);
});
