// ===== Tab Switching with Animation =====
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname, event) {
  if (!event || !tabname) return;

  for (let tablink of tablinks) {
    tablink.classList.remove("active-link");
  }

  for (let tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab", "fade-in");
  }

  event.currentTarget.classList.add("active-link");
  const activeTab = document.getElementById(tabname);
  activeTab.classList.add("active-tab", "fade-in");
}

// ===== Mobile Menu Toggle =====
const sidemenu = document.getElementById("sidemenu");
const menuToggle = document.getElementById("menu-toggle");
const menuCancel = document.getElementById("menu-cancel");

function toggleMenu() {
  sidemenu.classList.add("show-menu");
  menuToggle.style.display = "none";
  menuCancel.style.display = "block";
}

function closeMenu() {
  sidemenu.classList.remove("show-menu");
  menuToggle.style.display = "block";
  menuCancel.style.display = "none";
}

// Close menu when any nav link is clicked (for mobile)
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeMenu();
    }
  });
});

// ===== Google Sheets Contact Form Submit =====
const scriptURL = "https://script.google.com/macros/s/AKfycbzpftpZi-1WRRBTnk5AFU9SnfUFZ0_fwrxGVA3gEooYPA1D7gAYIujJWkkkVSudef4w/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");
const submitButton = form?.querySelector("button[type='submit']");

if (form && submitButton) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitButton.innerText = "Sending...";
    submitButton.style.backgroundColor = "#555";
    submitButton.disabled = true;

    fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    })
      .then(() => {
        msg.innerHTML = "✅ Message Sent Successfully!";
        submitButton.innerText = "Sent!";
        submitButton.style.backgroundColor = "#28a745";
        setTimeout(() => {
          msg.innerHTML = "";
          submitButton.innerText = "Submit";
          submitButton.style.backgroundColor = "#ff004f";
          submitButton.disabled = false;
        }, 5000);
        form.reset();
      })
      .catch((error) => {
        msg.innerHTML = "❌ Error sending message.";
        submitButton.innerText = "Try Again";
        submitButton.style.backgroundColor = "#dc3545";
        submitButton.disabled = false;
        console.error("Error!", error.message);
      });
  });
}
