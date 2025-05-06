// Load user data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const userData = await fetchUserAccoundData();
    populateUserData(userData);
});

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-button');
const settingsContents = document.querySelectorAll('.settings-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        settingsContents.forEach(content => content.classList.add('hidden'));

        button.classList.add('active');
        const tabId = button.dataset.tab + 'Settings';
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// Password visibility toggle
const toggleButtons = document.querySelectorAll('.toggle-password');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password validation
const newPasswordInput = document.getElementById('newPassword');
const requirements = {
    length: str => str.length >= 8,
    uppercase: str => /[A-Z]/.test(str),
    lowercase: str => /[a-z]/.test(str),
    number: str => /[0-9]/.test(str),
    special: str => /[^A-Za-z0-9]/.test(str)
};

newPasswordInput.addEventListener('input', () => {
    const password = newPasswordInput.value;

    for (const [requirement, validateFunc] of Object.entries(requirements)) {
        const li = document.querySelector(`[data-requirement="${requirement}"]`);
        const icon = li.querySelector('i');

        if (validateFunc(password)) {
            li.classList.add('valid');
            icon.classList.remove('fa-circle');
            icon.classList.add('fa-check-circle');
        } else {
            li.classList.remove('valid');
            icon.classList.remove('fa-check-circle');
            icon.classList.add('fa-circle');
        }
    }
});

// Avatar upload preview
const avatarUpload = document.getElementById('avatarUpload');
const currentAvatar = document.getElementById('currentAvatar');

avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentAvatar.src = e.target.result;
            showToast('Avatar updated successfully!');
        };
        reader.readAsDataURL(file);
    }
});

// Form submission handlers
document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add profile update logic here
    showToast('Profile updated successfully!');
});

document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    // Add password update logic here
    showToast('Password updated successfully!');
});

// notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const icon = toast.querySelector('i');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to fetch user data
async function fetchUserAccoundData() {
    try {
        // Extract user ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        if (!userId) {
            showToast('User ID not found in URL', 'error');
            return null;
        }

        // Make API request to get user data
        const response = await fetch(`/api/get-user?id=${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        showToast('Failed to load user data', 'error');
        return null;
    }
}

// Function to populate user data in the UI
function populateUserData(userData) {
    if (!userData) return;

    // Example of how to populate fields (adjust based on your actual form fields)
    if (document.getElementById('username')) {
        document.getElementById('username').value = userData.first_name || '';
    }

    if (document.getElementById('h-username')) {
        document.getElementById('h-username').textContent = userData.first_name || '';
    }

    if (document.getElementById('firstName')) {
        document.getElementById('firstName').value = userData.first_name || '';
    }

    if (document.getElementById('lastName')) {
        document.getElementById('lastName').value = userData.last_name || '';
    }

    if (document.getElementById('email') || document.getElementById('emailAddress')) {
        document.getElementById('email').value = userData.email || '';
        document.getElementById('emailAddress').textContent = userData.email;
    }

    // Add more fields as needed
}