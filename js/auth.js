/**
 * Authentication Logic for Elite Drive
 * Handles Login and Registration via fetch()
 */

document.getElementById('authForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const submitBtn = e.target.querySelector('button');

    // Visual feedback
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Checking...';

    try {
        // MOCK BACKEND CALL
        // In a real app, this would be: await fetch('https://api.elitedrive.com/login', { ... })
        console.log(`Attempting login for: ${email}`);
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock success logic
        const mockResponse = {
            success: true,
            user: { name: 'Valued Client', id: 123 },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Mock JWT
        };

        if (mockResponse.success) {
            // TEACHING POINT: Saving the token in a cookie
            document.cookie = `token=${mockResponse.token}; path=/; max-age=3600; SameSite=Strict`;
            
            alert('Login Successful! Welcome to Elite Drive.');
            window.location.href = 'index.html';
        }

    } catch (error) {
        console.error('Login Error:', error);
        alert('Authentication failed. Please check your credentials.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
    }
});

// Signup Logic
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value;
    const submitBtn = e.target.querySelector('button');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Account created for ${name}! Please sign in.`);
    window.location.href = 'login.html';
});
