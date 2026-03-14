/* ========================================
   Wedding Invitation — JavaScript
   ======================================== */

// *** IMPORTANT: Replace this URL after deploying your Google Apps Script ***
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnVg_dFA4F3rLlb63CllkZal5JfYWOZMyHZwWTTA7KVjodGn5ipBfYYyL8rWJDzmVS/exec';

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

    const formData = new FormData();
    formData.append('name', name.value.trim());
    formData.append('email', email.value.trim());
    formData.append('guests', guests.value);
    formData.append('attending', attending.value);
    formData.append('message', form.querySelector('#message').value.trim());
    formData.append('timestamp', new Date().toLocaleString());

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      form.style.display = 'none';
      successEl.classList.add('show');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
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
