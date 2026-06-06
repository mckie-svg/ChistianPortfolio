// Data
const skills = [
  "Copywriting","Content Writing","Email Copywriting","Social Media Copywriting",
  "SEO Writing Fundamentals","Research & Fact-Checking","Proofreading & Editing",
  "Audience Research","Brand Messaging","Content Optimization",
  "Microsoft Office","Google Workspace"
];

const experience = [
  "Created persuasive copy for landing pages, advertisements, email campaigns, and social media content.",
  "Developed engaging marketing messages tailored to specific audiences and business goals.",
  "Conducted research to understand customer needs, market trends, and competitor positioning.",
  "Wrote compelling headlines, product descriptions, and promotional content designed to increase engagement.",
  "Edited and proofread content to ensure clarity, consistency, and grammatical accuracy.",
  "Produced clear calls-to-action (CTAs) that encouraged user interaction and conversions."
];

const portfolio = [
  { title: "ATS Resume Writing Service", desc: "Conversion-focused sales copy highlighting service benefits and customer value." },
  { title: "IT Support Service Promotion", desc: "Website and promotional copy emphasizing reliability and customer-focused solutions." },
  { title: "Email Marketing Campaign", desc: "Promotional email copy with persuasive subject lines and strong CTAs." },
  { title: "Social Media Advertisement", desc: "Engaging social content designed to increase brand awareness and audience engagement." }
];

// Render
const skillsGrid = document.getElementById("skillsGrid");
skills.forEach(s => {
  const li = document.createElement("li");
  li.className = "skill-card reveal";
  li.innerHTML = `<span class="skill-dot"></span><span>${s}</span>`;
  skillsGrid.appendChild(li);
});

const timeline = document.getElementById("timeline");
experience.forEach(item => {
  const li = document.createElement("li");
  li.className = "reveal";
  li.textContent = item;
  timeline.appendChild(li);
});

const portfolioGrid = document.getElementById("portfolioGrid");
portfolio.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "portfolio-card reveal";
  card.innerHTML = `
    <span class="portfolio-num">0${i + 1}</span>
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
  `;
  portfolioGrid.appendChild(card);
});

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Sticky nav shadow
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

// Mobile menu
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Year (footer is hardcoded 2026 per request, no override needed)

// Modal Logic
const modal = document.getElementById("projectModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const projectForm = document.getElementById("projectForm");
const projectTypeSelect = document.getElementById("projectType");
const otherProjectTypeGroup = document.getElementById("otherProjectTypeGroup");
const otherProjectTypeInput = document.getElementById("otherProjectType");

if (openModalBtn && modal) {
  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  });

  projectTypeSelect.addEventListener("change", () => {
    const isOther = projectTypeSelect.value === "Other";
    otherProjectTypeGroup.style.display = isOther ? "block" : "none";
    otherProjectTypeInput.required = isOther;
    if (!isOther) otherProjectTypeInput.value = "";
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Reset conditional field state
    otherProjectTypeGroup.style.display = "none";
    if (otherProjectTypeInput) otherProjectTypeInput.required = false;
  };

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = projectForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Provide visual feedback
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(projectForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: json
      });
      const result = await response.json();

      if (response.status === 200) {
        alert("Thank you! Your inquiry has been sent. Christian will get back to you within 24 hours.");
        closeModal();
        projectForm.reset();
      } else {
        alert("Submission failed: " + result.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
