/* ============================
   Exit Gains – Main Script
   ============================ */

// -----------------------------
// Modal: Elements
// -----------------------------
const modal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const closeBtn = document.querySelector(".modal .close");
const platformBadge = document.getElementById("platformBadge");

// -----------------------------
// Helper: Convert raw video URLs to embed form
// Returns { url, platform }
// -----------------------------
function getEmbedUrl(url) {
  try {
    // --- YouTube ---
    const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const ytWatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (ytShort) return { url: `https://www.youtube.com/embed/${ytShort[1]}`, platform: "youtube" };
    if (ytWatch) return { url: `https://www.youtube.com/embed/${ytWatch[1]}`, platform: "youtube" };
    if (url.includes("youtube.com/embed/")) return { url, platform: "youtube" };

    // --- TikTok ---
    const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (tiktokMatch) return { url: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`, platform: "tiktok" };

    // --- Instagram ---
    const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (igMatch) return { url: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed/`, platform: "instagram" };

    // --- Fallback ---
    return { url, platform: null };
  } catch (e) {
    console.error("Invalid video URL:", url);
    return { url, platform: null };
  }
}

// -----------------------------
// Modal: Open & Close
// -----------------------------
function openModal(embedUrl, videoTitle, platform) {
  // Load video
  videoFrame.src = embedUrl + (embedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1");
  videoFrame.setAttribute("title", "Exit Gains – " + videoTitle);

  // Update platform badge
  platformBadge.className = "platform-badge"; // reset
  if (platform) {
    platformBadge.classList.add(platform);
    platformBadge.innerText = platform;
  } else {
    platformBadge.innerText = "";
  }

  // Show modal
  modal.classList.add("show");
  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => (videoFrame.src = ""), 400); // clear after fade
  platformBadge.innerText = "";
}

// -----------------------------
// Modal: Event Listeners
// -----------------------------
document.querySelectorAll(".video-card").forEach((card) => {
  card.addEventListener("click", () => {
    const rawUrl = card.getAttribute("data-video");
    const { url: embedUrl, platform } = getEmbedUrl(rawUrl);
    const videoTitle = card.querySelector("h3")?.innerText || "Exit Gains Video";
    openModal(embedUrl, videoTitle, platform);
  });
});

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});



// -----------------------------
// Signup Form: Programs Section (Formspree integration)
// -----------------------------
const signupForm = document.querySelector(".signup-form");
const successModal = document.getElementById("successModal");
const closeSuccess = document.querySelector(".close-success");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = signupForm.querySelector("input[name='email']");
    const email = emailInput.value.trim();

    if (!email) return;

    try {
      const res = await fetch("https://formspree.io/f/mpwdzekz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        // ✅ Show success modal
        successModal.classList.add("show");
        emailInput.value = "";

        // Optional auto-close after 5s
        setTimeout(() => {
          successModal.classList.remove("show");
        }, 5000);
      } else {
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error. Please try again.");
    }
  });
}


// -----------------------------
// Success Modal: Close handling
// -----------------------------
if (closeSuccess) {
  closeSuccess.addEventListener("click", () => {
    successModal.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.remove("show");
    }
  });
}



// -----------------------------
// Scroll Reveal Animations
// -----------------------------
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  reveals.forEach((el) => {
    const revealTop = el.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add("active");
    }
  });
});


// -----------------------------
// Navbar toggle
// -----------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navIcon = document.getElementById("navIcon");

if (navToggle && navLinks && navIcon) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation(); 
    navLinks.classList.toggle("active");

    // Swap icons
    if (navLinks.classList.contains("active")) {
      navIcon.src = "assets/icons/close.png";
      navIcon.alt = "Close menu";
    } else {
      navIcon.src = "assets/icons/hamburger.png";
      navIcon.alt = "Open menu";
    }
  });

  // Close when clicking link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navIcon.src = "assets/icons/hamburger.png";
      navIcon.alt = "Open menu";
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove("active");
      navIcon.src = "assets/icons/hamburger.png";
      navIcon.alt = "Open menu";
    }
  });
}

