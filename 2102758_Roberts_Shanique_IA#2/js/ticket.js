const STORAGE_KEY = "theTicket";

// Returns the saved ticket object or null if missing
function loadTicketData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

// Load the save data on the page
function renderTicket(ticket) {
  document.getElementById("ticket-heading-name").textContent = ticket.name;
  document.getElementById("ticket-email").textContent = ticket.email;
  document.getElementById("ticket-name").textContent = ticket.name;
  document.getElementById("ticket-serial").textContent = ticket.serial;

  // Create link to redirect to user github account
  const githubLink = document.getElementById("ticket-github");
  githubLink.textContent = ticket.github;
  githubLink.href = "https://github.com/" + ticket.github.slice(1);

  // The saved data URL turns back into an image
  const avatar = document.getElementById("ticket-avatar");
  avatar.src = ticket.avatar;
  avatar.alt = "Profile picture of " + ticket.name;
}


const ticketData = loadTicketData();

if (!ticketData) {
  // No data user gets redirected to the index page
  window.location.href = "index.html";
} else {
  renderTicket(ticketData);
}
