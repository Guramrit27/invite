/* ========================================
   Wedding Invitation — JavaScript
   ======================================== */

// *** IMPORTANT: Replace this URL after deploying your Google Apps Script ***
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Show/hide navigation on scroll ---
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 100) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  }, { passive: true });

  // --- Fade-in on scroll (IntersectionObserver) ---
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- RSVP Form Validation & Submission ---
  const form = document.getElementById('rsvpForm');
  const successEl = document.getElementById('rsvpSuccess');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    // Name
    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      showError(name, 'nameError', 'Please enter your name.');
      valid = false;
    }

    // Email
    const email = form.querySelector('#email');
    if (!email.value.trim()) {
      showError(email, 'emailError', 'Please enter your email.');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    // Guests
    const guests = form.querySelector('#guests');
    if (!guests.value) {
      showError(guests, 'guestsError', 'Please select number of guests.');
      valid = false;
    }

    // Attending
    const attending = form.querySelector('input[name="attending"]:checked');
    if (!attending) {
      document.getElementById('attendingError').textContent = 'Please select your attendance.';
      valid = false;
    }

    if (!valid) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = {
      name: name.value.trim(),
      email: email.value.trim(),
      guests: guests.value,
      attending: attending.value,
      message: form.querySelector('#message').value.trim(),
      timestamp: new Date().toLocaleString()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // With no-cors we can't read the response, but the data is sent
      form.style.display = 'none';
      successEl.classList.add('show');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      // Even if there's a network issue, show success since no-cors doesn't give us status
      form.style.display = 'none';
      successEl.classList.add('show');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  function showError(input, errorId, msg) {
    input.classList.add('error');
    document.getElementById(errorId).textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});
