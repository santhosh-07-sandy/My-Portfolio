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
  if (!sidemenu || !menuToggle || !menuCancel) return;
  sidemenu.classList.add("show-menu");
  sidemenu.style.background = "#111";
  menuToggle.style.display = "none";
  menuCancel.style.display = "block";
}

function closeMenu() {
  if (!sidemenu || !menuToggle || !menuCancel) return;
  sidemenu.classList.remove("show-menu");
  sidemenu.style.background = "transparent";
  menuToggle.style.display = "block";
  menuCancel.style.display = "none";
}

// ===== Close Menu on Link Click =====
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeMenu();
    }
  });
});

// ===== Google Sheets Contact Form Submit with Button Color Change =====
const scriptURL = "https://script.google.com/macros/s/AKfycbxhr4G_PJ7yPok4f5cdF7yqY2S1IQim9QPLeojmQ7aexb9c-3glLT2NjmJGMjxmU4Qm/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");
const submitButton = form?.querySelector("button[type='submit']");

if (form && submitButton) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Initial state - Sending
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
        submitButton.style.backgroundColor = "#28a745"; // green
        setTimeout(() => {
          msg.innerHTML = "";
          submitButton.innerText = "Submit";
          submitButton.style.backgroundColor = "#ff004f"; // original
          submitButton.disabled = false;
        }, 5000);
        form.reset();
      })
      .catch((error) => {
        msg.innerHTML = "❌ Error sending message.";
        submitButton.innerText = "Try Again";
        submitButton.style.backgroundColor = "#dc3545"; // red
        submitButton.disabled = false;
        console.error("Error!", error.message);
      });
  });
}
