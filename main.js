// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── MOBILE MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('open');
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── SCROLL ANIMATIONS ──
const timelineItems = document.querySelectorAll('.timeline-item[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(el => observer.observe(el));

// ── CONTACT FORM (Web3Forms) ──
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitIcon  = document.getElementById('submitIcon');
const submitLabel = document.getElementById('submitLabel');
const feedback    = document.getElementById('formFeedback');
const subjectInput = document.getElementById('subject');
const hiddenSubject = document.getElementById('formSubjectHidden');

// Sync l'objet visible vers le champ subject caché (Web3Forms lit "subject")
if (subjectInput && hiddenSubject) {
  subjectInput.addEventListener('input', () => {
    hiddenSubject.value = subjectInput.value.trim() || 'Nouveau message depuis ton portfolio';
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  // Validation basique
  const nameVal  = form.name.value.trim();
  const emailVal = form.email.value.trim();
  const msgVal   = form.message.value.trim();
  if (!nameVal || !emailVal || !msgVal) {
    feedback.className = 'form-feedback form-feedback--error';
    feedback.textContent = 'Merci de remplir les champs obligatoires (Nom, Email, Message).';
    return;
  }

  // État chargement
  submitBtn.disabled = true;
  submitIcon.innerHTML = '<use href="#i-spinner"/>';
  submitLabel.textContent = 'Envoi en cours…';

  try {
    const data = new FormData(form);
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    const json = await res.json();

    if (json.success) {
      // Succès
      submitBtn.classList.add('btn-success');
      submitIcon.innerHTML = '<use href="#i-check"/>';
      submitLabel.textContent = 'Message envoyé !';
      feedback.className = 'form-feedback form-feedback--success';
      feedback.textContent = 'Merci ! Je te répondrai dans les plus brefs délais.';
      form.reset();
      if (hiddenSubject) hiddenSubject.value = 'Nouveau message depuis ton portfolio';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-success');
        submitIcon.innerHTML = '<use href="#i-send"/>';
        submitLabel.textContent = 'Envoyer le message';
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 5000);
    } else {
      throw new Error(json.message || 'Erreur inconnue');
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitIcon.innerHTML = '<use href="#i-send"/>';
    submitLabel.textContent = 'Envoyer le message';
    feedback.className = 'form-feedback form-feedback--error';
    feedback.textContent = 'Erreur lors de l\'envoi. Vérifie ta connexion ou écris directement à baaminata075@gmail.com';
    console.error('Form error:', err);
  }
});

// ── PDF MODAL ──
const pdfModal    = document.getElementById('pdfModal');
const pdfFrame    = document.getElementById('pdfFrame');
const pdfTitle    = document.getElementById('pdfModalTitle');
const pdfDownload = document.getElementById('pdfDownloadBtn');
const pdfClose    = document.getElementById('pdfModalClose');
const pdfBackdrop = document.getElementById('pdfBackdrop');

function openPdf(src, title) {
  pdfTitle.textContent    = title;
  pdfFrame.src            = src;
  pdfDownload.href        = src;
  pdfDownload.download    = src.split('/').pop();
  pdfModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdf() {
  pdfModal.classList.remove('open');
  document.body.style.overflow = '';
  // Delay src clear so the fade-out plays
  setTimeout(() => { pdfFrame.src = ''; }, 280);
}

document.querySelectorAll('.cert-view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card  = btn.closest('.cert-item');
    const src   = card.dataset.cert;
    const title = card.dataset.certTitle;
    openPdf(src, title);
  });
});

pdfClose.addEventListener('click', closePdf);
pdfBackdrop.addEventListener('click', closePdf);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePdf(); });

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
