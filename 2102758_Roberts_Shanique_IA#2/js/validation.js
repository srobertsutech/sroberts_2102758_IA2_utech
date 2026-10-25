// Constants
const STORAGE_KEY = "theTicket";
const MAX_AVATAR_SIZE = 500 * 1024; // 500KB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

// Patterns
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB_PATTERN = /^@[A-Za-z0-9-]+$/;

// Element references
const form = document.getElementById("registration-form");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github");
const avatarInput = document.getElementById("avatar");
const dropzoneText = document.getElementById("dropzone-text");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const githubError = document.getElementById("github-error");
const avatarError = document.getElementById("avatar-error");

// Validate each value
// Function returns an error message, or "" when the value is valid.

function validateName(value) {
  if (value.trim() === "") {
    return "Full name is required.";
  }
  return "";
}

function validateEmail(value) {
  if (!EMAIL_PATTERN.test(value.trim())) {
    return "Enter a valid email like user@domain.com.";
  }
  return "";
}

function validateGithub(value) {
  if (!GITHUB_PATTERN.test(value.trim())) {
    return "GitHub username must start with @ (for example @johndoe).";
  }
  return "";
}

function validateAvatar(file) {
  if (!file) {
    return "Please upload a profile picture.";
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPEG or PNG images are allowed.";
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return "Image must be smaller than 500KB.";
  }
  return "";
}

// Write an error message where element error.
function showError(element, message) {
  element.textContent = message;
}

// Creates a serial number for the ticket
function generateSerial() {
  const number = Math.floor(Math.random() * 99999) + 1;
  return "#" + String(number).padStart(5, "0");
}


 // Save the ticket data and sends the user to the ticket page
function saveAndRedirect(ticketData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticketData));
    window.location.href = "ticket.html";
  } catch (error) {
    showError(avatarError, "Could not save your ticket. Try a smaller image.");
  }
}

// Shows the uploaded file name 
avatarInput.addEventListener("change", function () {
  const file = avatarInput.files[0];
  dropzoneText.textContent = file ? file.name : "Drag and drop or click to upload";
});


form.addEventListener("submit", function (event) {
  // Stop the browser from submitting until everything is checked
  event.preventDefault();

  const avatarFile = avatarInput.files[0];

  // Run every validator and display its result in place
  const nameMessage = validateName(nameInput.value);
  const emailMessage = validateEmail(emailInput.value);
  const githubMessage = validateGithub(githubInput.value);
  const avatarMessage = validateAvatar(avatarFile);

  showError(nameError, nameMessage);
  showError(emailError, emailMessage);
  showError(githubError, githubMessage);
  showError(avatarError, avatarMessage);

  // End here if any field fails
  if (nameMessage || emailMessage || githubMessage || avatarMessage) {
    return;
  }

  // Convert the image file to a text string so it can be stored.
  const reader = new FileReader();

  reader.onload = function () {
    saveAndRedirect({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      github: githubInput.value.trim(),
      avatar: reader.result,
      serial: generateSerial()
    });
  };

  reader.onerror = function () {
    showError(avatarError, "The image could not be read. Please try another file.");
  };

  reader.readAsDataURL(avatarFile);
});
