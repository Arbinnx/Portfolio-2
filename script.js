// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav toggle
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Active nav link on scroll
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObs.observe(s));

// Contact form
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
  // Clear field error as user types
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      const err   = group.querySelector('.field-error');
      if (err) err.remove();
      field.classList.remove('input-error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear any previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    formNote.textContent = '';

    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      const lbl   = group.querySelector('label');
      const name  = lbl ? lbl.textContent.trim() : 'This field';

      if (!field.value.trim()) {
        valid = false;
        field.classList.add('input-error');
        const err = document.createElement('span');
        err.className   = 'field-error';
        err.textContent = `${name} is required.`;
        group.appendChild(err);
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        valid = false;
        field.classList.add('input-error');
        const err = document.createElement('span');
        err.className   = 'field-error';
        err.textContent = 'Please enter a valid email address.';
        group.appendChild(err);
      }
    });

    if (!valid) return;

    const btn   = form.querySelector('.form-submit');
    const label = btn.querySelector('.btn-label');
    label.textContent = 'Sending\u2026';
    btn.disabled = true;
    formNote.textContent = '';
    formNote.style.color = '';

    try {
      const res = await fetch('https://formspree.io/f/xojykdbb', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formNote.textContent = "Got it \u2014 I\u2019ll get back to you soon.";
        form.reset();
      } else {
        formNote.textContent = 'Something went wrong. Please try again.';
        formNote.style.color = '#f87171';
      }
    } catch {
      formNote.textContent = 'Connection error. Please try again.';
      formNote.style.color = '#f87171';
    } finally {
      label.textContent = 'Send message';
      btn.disabled = false;
    }
  });
}
