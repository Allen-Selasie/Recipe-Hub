function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
    } else {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        signupToggle.classList.add('active');
        loginToggle.classList.remove('active');
    }
}

// Set default form to be shown as login
window.onload = function() {
    document.getElementById('login-form').style.display = 'block';
};

function togglePasswordVisibility() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (field.type === "password") {
            field.type = "text";
            document.querySelectorAll('.visibility-toggle').forEach(icon => {
                icon.textContent = 'visibility_off';
            });
        } else {
            field.type = "password";
            document.querySelectorAll('.visibility-toggle').forEach(icon => {
                icon.textContent = 'visibility';
            });
        }
    });
}
