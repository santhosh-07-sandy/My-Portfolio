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

// ===== Portfolio: View More / View Less toggle =====
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("see-more-btn");
  const workList = document.querySelector("#portfolio .work-list");
  if (!toggleBtn || !workList) return;

  const allWorks = Array.from(workList.querySelectorAll(".work"));
  const extraWorks = allWorks.slice(3); // everything after first 3

  // Ensure extras are hidden initially
  extraWorks.forEach((el) => el.classList.add("hidden-project"));
  toggleBtn.textContent = "View More";

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = extraWorks[0]?.classList.contains("hidden-project");
    extraWorks.forEach((el) => el.classList.toggle("hidden-project"));
    toggleBtn.textContent = isHidden ? "View Less" : "View More";
  });
});

// ===== Services: Bottom-sheet popup with skill logos =====
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("skills-popup");
  const backdrop = document.getElementById("skills-backdrop");
  const closeBtn = document.getElementById("skills-close");
  const grid = document.getElementById("skills-grid");
  const title = document.getElementById("skills-title");
  const sheet = popup?.querySelector(".skills-sheet");
  const tooltip = document.getElementById("skills-tooltip");

  if (!popup || !backdrop || !closeBtn || !grid || !title) return;

  const icon = (cls, label) => {
    const div = document.createElement("div");
    div.className = "skill-icon";
    div.title = label;
    div.dataset.label = label;
    const i = document.createElement("i");
    i.className = cls + " colored";
    div.appendChild(i);
    return div;
  };

  const sets = {
    fullstack: [
      ["devicon-html5-plain", "HTML"],
      ["devicon-css3-plain", "CSS"],
      ["devicon-javascript-plain", "JavaScript"],
      ["devicon-tailwindcss-plain", "Tailwind CSS"],
      ["devicon-react-original", "React"],
      ["devicon-git-plain", "Git"],
      ["devicon-github-original", "GitHub"],
      ["devicon-java-plain", "Java"],
      ["devicon-mysql-plain", "MySQL"],
      ["devicon-spring-plain", "Spring Boot"],
    ],
    frontend: [
      ["devicon-html5-plain", "HTML"],
      ["devicon-css3-plain", "CSS"],
      ["devicon-javascript-plain", "JavaScript"],
      ["devicon-tailwindcss-plain", "Tailwind CSS"],
      ["devicon-react-original", "React"],
      ["devicon-git-plain", "Git"],
      ["devicon-github-original", "GitHub"],
    ],
    backend: [
      ["devicon-java-plain", "Java"],
      ["devicon-mysql-plain", "MySQL"],
      ["devicon-spring-plain", "Spring Boot"],
    ],
  };

  const createItem = (cls, label, pct) => {
    const wrap = document.createElement("div");
    wrap.className = "skill-item";
    const iconBox = icon(cls, label);
    iconBox.dataset.pct = String(pct);
    const meter = document.createElement("div");
    meter.className = "skill-meter";
    const track = document.createElement("div");
    track.className = "meter-track";
    const fill = document.createElement("div");
    fill.className = "meter-fill";
    // level color
    const level = pct <= 40 ? "meter-beginner" : pct <= 75 ? "meter-intermediate" : "meter-advanced";
    fill.classList.add(level);
    track.appendChild(fill);
    meter.appendChild(track);
    wrap.appendChild(iconBox);
    wrap.appendChild(meter);
    // animate after insert
    setTimeout(() => (fill.style.width = pct + "%"), 60);
    return wrap;
  };

  const open = (serviceKey, withPercent = false) => {
    grid.innerHTML = "";
    const list = sets[serviceKey] || [];
    if (withPercent) {
      const mapPct = {
        HTML: 90,
        CSS: 85,
        JavaScript: 80,
        "Tailwind CSS": 75,
        React: 65,
        Git: 80,
        GitHub: 80,
        Java: 85,
        MySQL: 80,
        "Spring Boot": 75,
      };
      list.forEach(([cls, label]) => grid.appendChild(createItem(cls, label, mapPct[label] || 70)));
    } else {
      list.forEach(([cls, label]) => grid.appendChild(icon(cls, label)));
    }
    title.textContent = "Skills";
    popup.classList.remove("hidden");
    // trigger open animation
    requestAnimationFrame(() => popup.classList.add("open"));
  };

  const close = () => {
    popup.classList.remove("open");
    setTimeout(() => popup.classList.add("hidden"), 250);
  };

  // Service cards no longer open skills popup

  // About -> Skills see-more arrow: open popup with percentages
  const aboutMore = document.getElementById("about-skills-more");
  if (aboutMore) {
    aboutMore.addEventListener("click", (e) => {
      e.preventDefault();
      open("fullstack", true);
    });
  }

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popup.classList.contains("hidden")) close();
  });

  // Tooltip over skill logos (hover/touch)
  if (grid && sheet && tooltip) {
    const showTip = (label, pct, x, y) => {
      tooltip.textContent = pct ? `${label} — ${pct}%` : label;
      tooltip.classList.remove("hidden");
      const rect = sheet.getBoundingClientRect();
      const left = Math.min(Math.max(x - rect.left + 12, 8), rect.width - 8);
      const top = Math.min(Math.max(y - rect.top + 12, 8), rect.height - 8);
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    };
    const hideTip = () => tooltip.classList.add("hidden");

    grid.addEventListener("mousemove", (e) => {
      const target = e.target;
      const tile = target && target.closest ? target.closest(".skill-icon") : null;
      if (!tile) { hideTip(); return; }
      const label = tile.dataset.label || tile.getAttribute("title") || "";
      const pct = tile.dataset.pct || "";
      showTip(label, pct, e.clientX, e.clientY);
    });
    grid.addEventListener("mouseleave", hideTip);

    // More stable on desktop: show on mouseover, hide on mouseout
    grid.addEventListener("mouseover", (e) => {
      const target = e.target;
      const tile = target && target.closest ? target.closest(".skill-icon") : null;
      if (!tile) return;
      const rect = sheet.getBoundingClientRect();
      showTip(tile.dataset.label || "", tile.dataset.pct || "", rect.left + rect.width/2, rect.top + rect.height/2);
    });
    grid.addEventListener("mouseout", (e) => {
      const toEl = e.relatedTarget;
      if (toEl && grid.contains(toEl)) return; // still within grid
      hideTip();
    });

    grid.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      const target = e.target;
      const node = target && target.closest ? target.closest(".skill-icon") : null;
      if (!node || !t) return;
      const label = node.dataset.label;
      const pct = node.dataset.pct;
      showTip(label, pct, t.clientX, t.clientY);
    }, { passive: true });
    grid.addEventListener("touchend", hideTip);
  }
});
