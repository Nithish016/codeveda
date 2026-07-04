// --- 1. Dropdown Interactivity ---
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownList = document.getElementById('dropdown-list');
const dropdownSelected = document.getElementById('dropdown-selected');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdownList.classList.toggle('show');
});

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownSelected.textContent = item.textContent;
        dropdownList.classList.remove('show');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    dropdownList.classList.remove('show');
});


// --- 2. Modal Interactivity ---
const modalOpenBtn = document.getElementById('modal-open-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalOverlay = document.getElementById('modal-overlay');

modalOpenBtn.addEventListener('click', () => {
    modalOverlay.classList.add('show');
});

modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('show');
    }
});


// --- 3. Form Validation Logic ---
const form = document.getElementById('validate-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Email regex utility
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Validate Input Fields
function validateField(input, groupElement, condition) {
    if (condition) {
        groupElement.classList.remove('invalid');
        groupElement.classList.add('valid');
        return true;
    } else {
        groupElement.classList.remove('valid');
        groupElement.classList.add('invalid');
        return false;
    }
}

// Real-time input listeners
usernameInput.addEventListener('input', () => {
    validateField(usernameInput, document.getElementById('group-username'), usernameInput.value.trim().length >= 3);
});

emailInput.addEventListener('input', () => {
    validateField(emailInput, document.getElementById('group-email'), isValidEmail(emailInput.value.trim()));
});

passwordInput.addEventListener('input', () => {
    validateField(passwordInput, document.getElementById('group-password'), passwordInput.value.length >= 6);
});

// Form Submit listener
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isUsernameValid = validateField(usernameInput, document.getElementById('group-username'), usernameInput.value.trim().length >= 3);
    const isEmailValid = validateField(emailInput, document.getElementById('group-email'), isValidEmail(emailInput.value.trim()));
    const isPasswordValid = validateField(passwordInput, document.getElementById('group-password'), passwordInput.value.length >= 6);

    if (isUsernameValid && isEmailValid && isPasswordValid) {
        alert(`Success! Form validated and submitted successfully.\nUsername: ${usernameInput.value}\nEmail: ${emailInput.value}`);
        form.reset();
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('valid'));
    }
});
