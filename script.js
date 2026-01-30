// ========== UTILITIES & CONSTANTS ==========
const STORAGE_KEY = 'studentReviews';
const CLIENT_STORAGE_KEY = 'clientReviews';
const MY_REVIEWS_KEY = 'myReviewIds';
const CONTACT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpftpZi-1WRRBTnk5AFU9SnfUFZ0_fwrxGVA3gEooYPA1D7gAYIujJWkkkVSudef4w/exec";

// ========== MOBILE MENU LOGIC ==========
const sidemenu = document.getElementById("sidemenu");
const menuToggle = document.getElementById("menu-toggle");
const menuCancel = document.getElementById("menu-cancel");

function toggleMenu() {
  sidemenu.classList.add("show-menu");
  if (menuToggle) menuToggle.style.display = "none";
  if (menuCancel) menuCancel.style.display = "block";
}

function closeMenu() {
  sidemenu.classList.remove("show-menu");
  if (menuToggle) menuToggle.style.display = "block";
  if (menuCancel) menuCancel.style.display = "none";
}

// ========== TAB SWITCHING (About Section) ==========
function opentab(tabname, event) {
  if (!event || !tabname) return;
  const tablinks = document.getElementsByClassName("tab-links");
  const tabcontents = document.getElementsByClassName("tab-contents");

  for (let tablink of tablinks) tablink.classList.remove("active-link");
  for (let tabcontent of tabcontents) tabcontent.classList.remove("active-tab", "fade-in");

  event.currentTarget.classList.add("active-link");
  const activeTab = document.getElementById(tabname);
  if (activeTab) activeTab.classList.add("active-tab", "fade-in");
}

// ========== NOTIFICATIONS & CONFIRMATIONS ==========
function showNotification(message, type = "success") {
  const toast = document.getElementById("custom-toast");
  const msgText = document.getElementById("toast-msg");
  const icon = document.getElementById("toast-icon");

  if (!toast || !msgText || !icon) return;

  // Reset and set classes
  toast.className = "toast";
  if (type === "error") {
    toast.classList.add("error");
    icon.className = "fa-solid fa-circle-exclamation";
  } else {
    toast.classList.add("success");
    icon.className = "fa-solid fa-circle-check";
  }

  msgText.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => toast.classList.add("active"), 10);

  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => toast.classList.add("hidden"), 500);
  }, 3000);
}

function showConfirm(message, onConfirm) {
  const modal = document.getElementById("custom-confirm");
  const msgText = document.getElementById("confirm-msg");
  const yesBtn = document.getElementById("confirm-yes");
  const cancelBtn = document.getElementById("confirm-cancel");

  if (!modal || !msgText || !yesBtn || !cancelBtn) return;

  msgText.textContent = message;
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("active"), 10);

  const close = () => {
    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 300);
  };

  const handleYes = () => { onConfirm(); close(); };
  const handleCancel = () => close();

  // Reset listeners
  const newYes = yesBtn.cloneNode(true);
  const newCancel = cancelBtn.cloneNode(true);
  yesBtn.replaceWith(newYes);
  cancelBtn.replaceWith(newCancel);

  newYes.addEventListener("click", handleYes, { once: true });
  newCancel.addEventListener("click", handleCancel, { once: true });
}

// ========== TESTIMONIALS LOGIC ==========
function seedClientReviews() {
  if (!localStorage.getItem(CLIENT_STORAGE_KEY)) {
    const initialReviews = [
      { id: 1, name: "John Doe", role: "CEO, TechCorp", text: "Santhosh delivered an exceptional project. Highly recommended!", rating: 5, date: new Date().toISOString() },
      { id: 2, name: "Jane Smith", role: "Founder, StartUp Inc", text: "Great communication and timely delivery.", rating: 4, date: new Date().toISOString() }
    ];
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(initialReviews));
  }
}

function loadReviews(swiperInstance, storageKey, wrapperId, type) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const reviews = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const isAdmin = new URLSearchParams(window.location.search).has('admin');
  const myReviews = JSON.parse(localStorage.getItem(MY_REVIEWS_KEY) || "[]");

  if (reviews.length === 0) {
    wrapper.innerHTML = `<div class="swiper-slide"><div class="testimonial-card"><p class="review-text" style="text-align:center;">No ${type} reviews yet.</p></div></div>`;
  } else {
    wrapper.innerHTML = reviews.map(review => {
      const canDelete = isAdmin || myReviews.includes(review.id);
      const deleteBtn = canDelete ? `<button class="delete-review-btn" onclick="deleteReview(${review.id}, '${type}')"><i class="fa-solid fa-trash"></i></button>` : '';
      let starsHtml = '';
      for (let i = 0; i < 5; i++) starsHtml += i < review.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';

      const subInfo = type === 'client' ? (review.role || 'Client') : (review.institute || 'Student');
      const imgUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`;

      return `
        <div class="swiper-slide">
          <div class="testimonial-card">
            ${deleteBtn}
            <div class="card-header">
              <img src="${imgUrl}" alt="${review.name}" class="client-img">
              <div>
                <h3>${review.name}</h3>
                <p>${subInfo}</p>
                <p style="font-size:10px; margin-top:2px;">${new Date(review.date).toLocaleDateString()}</p>
                <div class="stars">${starsHtml}</div>
              </div>
            </div>
            <p class="review-text">"${review.text}"</p>
          </div>
        </div>`;
    }).join('');
  }
  if (swiperInstance) swiperInstance.update();
}

window.deleteReview = (id, type = 'student') => {
  showConfirm("Are you sure you want to delete this review?", () => {
    const key = type === 'client' ? CLIENT_STORAGE_KEY : STORAGE_KEY;
    let reviews = JSON.parse(localStorage.getItem(key) || "[]").filter(r => r.id !== id);
    localStorage.setItem(key, JSON.stringify(reviews));

    const swiperClass = type === 'client' ? '.mySwiper' : '.studentSwiper';
    const swiperEl = document.querySelector(swiperClass);
    if (swiperEl?.swiper) {
      if (type === 'client') loadReviews(swiperEl.swiper, CLIENT_STORAGE_KEY, 'client-swiper-wrapper', 'client');
      else loadReviews(swiperEl.swiper, STORAGE_KEY, 'student-swiper-wrapper', 'student');
    }
    showNotification("Review deleted successfully!");
  });
};

function validateAndSaveReview(swiper, form, storageKey, type) {
  const prefix = type === 'client' ? 'client' : 'reviewer';
  const name = document.getElementById(`${prefix}-name`).value.trim();
  const rating = document.getElementById(`${prefix}-rating`).value;
  const text = document.getElementById(`${prefix}-text`).value.trim();
  const roleOrInst = type === 'client' ? document.getElementById('client-role').value.trim() : document.getElementById('reviewer-institute').value.trim();
  const msgEl = document.getElementById(`${type === 'client' ? 'client' : 'review'}-msg`);

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount > 50) {
    if (msgEl) { msgEl.textContent = `Word limit exceeded! (${wordCount}/50)`; msgEl.style.color = "red"; }
    return;
  }

  if (!name || !rating || !text || !roleOrInst) {
    if (msgEl) { msgEl.textContent = "Please fill in all fields."; msgEl.style.color = "red"; }
    return;
  }

  const newReview = { id: Date.now(), date: new Date().toISOString(), name, rating: parseInt(rating), text, [type === 'client' ? 'role' : 'institute']: roleOrInst };
  const reviews = JSON.parse(localStorage.getItem(storageKey) || "[]");
  reviews.unshift(newReview);
  if (reviews.length > 10) reviews.pop();
  localStorage.setItem(storageKey, JSON.stringify(reviews));

  const myReviews = JSON.parse(localStorage.getItem(MY_REVIEWS_KEY) || "[]");
  myReviews.push(newReview.id);
  localStorage.setItem(MY_REVIEWS_KEY, JSON.stringify(myReviews));

  form.reset();
  form.classList.add("hidden");
  const toggleBtn = document.getElementById(type === 'client' ? 'toggle-client-form' : 'toggle-review-form');
  if (toggleBtn) toggleBtn.textContent = type === 'client' ? "Write a Client Review" : "Write a Review";

  loadReviews(swiper, storageKey, type === 'client' ? 'client-swiper-wrapper' : 'student-swiper-wrapper', type);
  showNotification("Review submitted successfully!");
}

// ========== MAIN INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Link Auto-Close
  document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", () => { if (window.innerWidth <= 768) closeMenu(); });
  });

  // 2. Portfolio Toggle Logic
  const workList = document.querySelector(".work-list");
  const portfolioBtn = document.getElementById("see-more-btn");
  if (workList && portfolioBtn) {
    const extraWorks = Array.from(workList.querySelectorAll(".work")).slice(3);
    const updatePortfolio = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        extraWorks.forEach(el => el.classList.add("hidden-project"));
        portfolioBtn.style.display = "block";
        portfolioBtn.textContent = "See More";
      } else {
        extraWorks.forEach(el => el.classList.remove("hidden-project"));
        portfolioBtn.style.display = "none";
      }
    };
    window.addEventListener('resize', updatePortfolio);
    updatePortfolio();
    portfolioBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = extraWorks[0].classList.contains("hidden-project");
      extraWorks.forEach(el => el.classList.toggle("hidden-project"));
      portfolioBtn.textContent = isHidden ? "See Less" : "See More";
    });
  }

  // 3. Contact Form Submission
  const contactForm = document.forms["submit-to-google-sheet"];
  const contactMsg = document.getElementById("msg");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type='submit']");
      const originalText = btn.innerText;
      btn.innerText = "Sending...";
      btn.disabled = true;

      fetch(CONTACT_SCRIPT_URL, { method: "POST", body: new FormData(contactForm) })
        .then(() => {
          showNotification("Message Sent Successfully!");
          btn.innerText = "Sent!";
          setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
          contactForm.reset();
        })
        .catch(() => {
          showNotification("Error sending message.", "error");
          btn.disabled = false;
          btn.innerText = "Try Again";
        });
    });
  }

  // 4. Testimonials Initialization
  seedClientReviews();
  const tabBtns = document.querySelectorAll(".testimonial-tabs .tab-btn");
  const contents = document.querySelectorAll(".testimonial-content");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.getAttribute("data-target")).classList.add("active");
    });
  });

  const swiperOptions = { slidesPerView: 1, spaceBetween: 30, pagination: { el: ".swiper-pagination", clickable: true }, breakpoints: { 768: { slidesPerView: 2 } } };
  if (document.querySelector(".mySwiper")) {
    const swiper = new Swiper(".mySwiper", { ...swiperOptions, autoplay: { delay: 3000 } });
    loadReviews(swiper, CLIENT_STORAGE_KEY, 'client-swiper-wrapper', 'client');
    const toggle = document.getElementById("toggle-client-form");
    const form = document.getElementById("client-review-form");
    if (toggle && form) {
      toggle.addEventListener("click", () => { form.classList.toggle("hidden"); toggle.textContent = form.classList.contains("hidden") ? "Write a Client Review" : "Cancel"; });
      form.addEventListener("submit", (e) => { e.preventDefault(); validateAndSaveReview(swiper, form, CLIENT_STORAGE_KEY, 'client'); });
    }
  }
  if (document.querySelector(".studentSwiper")) {
    const swiper = new Swiper(".studentSwiper", swiperOptions);
    loadReviews(swiper, STORAGE_KEY, 'student-swiper-wrapper', 'student');
    const toggle = document.getElementById("toggle-review-form");
    const form = document.getElementById("student-review-form");
    if (toggle && form) {
      toggle.addEventListener("click", () => { form.classList.toggle("hidden"); toggle.textContent = form.classList.contains("hidden") ? "Write a Review" : "Cancel"; });
      form.addEventListener("submit", (e) => { e.preventDefault(); validateAndSaveReview(swiper, form, STORAGE_KEY, 'student'); });
    }
  }

  // 5. Skills Popup Toolkit (Tooltips)
  const popup = document.getElementById("skills-popup");
  const backdrop = document.getElementById("skills-backdrop");
  const closeBtn = document.getElementById("skills-close");
  const grid = document.getElementById("skills-grid");
  const title = document.getElementById("skills-title");
  const sheet = popup?.querySelector(".skills-sheet");
  const tooltip = document.getElementById("skills-tooltip");

  if (popup && backdrop && closeBtn && grid && title && tooltip && sheet) {
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
        ["devicon-html5-plain", "HTML"], ["devicon-css3-plain", "CSS"], ["devicon-javascript-plain", "JavaScript"],
        ["devicon-tailwindcss-plain", "Tailwind CSS"], ["devicon-react-original", "React"], ["devicon-nodejs-plain", "Node.js"],
        ["devicon-mongodb-plain", "MongoDB"], ["devicon-git-plain", "Git"], ["devicon-github-original", "GitHub"],
        ["devicon-java-plain", "Java"], ["devicon-mysql-plain", "MySQL"], ["devicon-spring-plain", "Spring Boot"]
      ],
      frontend: [
        ["devicon-html5-plain", "HTML"], ["devicon-css3-plain", "CSS"], ["devicon-javascript-plain", "JavaScript"],
        ["devicon-tailwindcss-plain", "Tailwind CSS"], ["devicon-react-original", "React"], ["devicon-git-plain", "Git"], ["devicon-github-original", "GitHub"]
      ],
      backend: [
        ["devicon-nodejs-plain", "Node.js"], ["devicon-mongodb-plain", "MongoDB"], ["devicon-java-plain", "Java"],
        ["devicon-mysql-plain", "MySQL"], ["devicon-spring-plain", "Spring Boot"]
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
      const level = pct <= 40 ? "meter-beginner" : pct <= 75 ? "meter-intermediate" : "meter-advanced";
      fill.classList.add(level);
      track.appendChild(fill);
      meter.appendChild(track);
      wrap.appendChild(iconBox);
      wrap.appendChild(meter);
      setTimeout(() => (fill.style.width = pct + "%"), 60);
      return wrap;
    };

    const openPopup = (serviceKey, withPercent = false) => {
      grid.innerHTML = "";
      const list = sets[serviceKey] || [];
      if (withPercent) {
        const mapPct = { HTML: 90, CSS: 85, JavaScript: 80, "Tailwind CSS": 75, React: 65, "Node.js": 75, MongoDB: 70, Git: 80, GitHub: 80, Java: 85, MySQL: 80, "Spring Boot": 75 };
        list.forEach(([cls, label]) => grid.appendChild(createItem(cls, label, mapPct[label] || 70)));
      } else {
        list.forEach(([cls, label]) => grid.appendChild(icon(cls, label)));
      }
      title.textContent = "Skills";
      popup.classList.remove("hidden");
      requestAnimationFrame(() => popup.classList.add("open"));
    };

    const closePopup = () => {
      popup.classList.remove("open");
      setTimeout(() => popup.classList.add("hidden"), 250);
    };

    const aboutMore = document.getElementById("about-skills-more");
    if (aboutMore) aboutMore.addEventListener("click", (e) => { e.preventDefault(); openPopup("fullstack", true); });

    backdrop.addEventListener("click", closePopup);
    closeBtn.addEventListener("click", closePopup);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !popup.classList.contains("hidden")) closePopup(); });

    // Tooltip logic
    const showTip = (label, pct, x, y) => {
      tooltip.textContent = pct ? `${label} — ${pct}%` : label;
      tooltip.classList.remove("hidden");
      const rect = sheet.getBoundingClientRect();
      const left = Math.min(Math.max(x - rect.left + 12, 8), rect.width - tooltip.offsetWidth - 8);
      const top = Math.min(Math.max(y - rect.top + 12, 8), rect.height - tooltip.offsetHeight - 8);
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    };
    const hideTip = () => tooltip.classList.add("hidden");

    grid.addEventListener("mousemove", (e) => {
      const tile = e.target.closest(".skill-icon");
      if (!tile) { hideTip(); return; }
      showTip(tile.dataset.label || "", tile.dataset.pct || "", e.clientX, e.clientY);
    });
    grid.addEventListener("mouseleave", hideTip);
  }
});

// Re-expose legacy functions for Skills Popup if needed (keeping separate to avoid breaking complex logic)
// Existing popup logic was quite large, usually better to keep it or refactor separately.
// The code above focuses on the new features and core portfolio logic.
