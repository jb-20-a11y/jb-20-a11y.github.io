'use strict';

// ---------------------------------------------------------------------------
// CONFIG
// Set SINGLE_SECTION_MODE to true to show only one section at a time
// (with the active section determined by the URL hash).
// Set to false to show all sections simultaneously and use the hash
// only for scrolling and link highlighting.
// ---------------------------------------------------------------------------
const SINGLE_SECTION_MODE = true;



// ---------------------------------------------------------------------------
// Contact form: enable submit only when all fields are valid
// ---------------------------------------------------------------------------
const form      = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn   = document.querySelector('[data-form-btn]');

if (form && formBtn) {
  formInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      formBtn[form.checkValidity() ? 'removeAttribute' : 'setAttribute']('disabled', '');
    });
  });
}


// ---------------------------------------------------------------------------
// Hash-based navigation
// ---------------------------------------------------------------------------
const navLinks = document.querySelectorAll('[data-nav-link]');
const sections = document.querySelectorAll('[data-page]');

// Map lowercase section name -> section element and nav link element
const sectionMap  = {};   // 'about' -> <article>
const navLinkMap  = {};   // 'about' -> <a>
const validHashes = new Set();

sections.forEach(function (sec) {
  const name = sec.dataset.page;
  sectionMap[name] = sec;
  validHashes.add(name);
});

navLinks.forEach(function (link) {
  const name = link.dataset.navLink;   // set via data-nav-link="about" etc.
  navLinkMap[name] = link;
});


function getActiveSection() {
  // Strip the leading '#' and lowercase
  const hash = window.location.hash.replace('#', '').toLowerCase();
  return validHashes.has(hash) ? hash : 'about';
}


function applyNavState(active) {
  if (SINGLE_SECTION_MODE) {
    // Show only the active section
    sections.forEach(function (sec) {
      sec.classList.toggle('active', sec.dataset.page === active);
    });
  } else {
    // All sections visible — just highlight the nav link for the active one
    sections.forEach(function (sec) {
      sec.classList.add('active');
    });
  }

  // Highlight the correct nav link
  navLinks.forEach(function (link) {
    link.classList.toggle('active', link.dataset.navLink === active);
  });
}


// Handle nav link clicks
navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    const name = link.dataset.navLink;

    if (SINGLE_SECTION_MODE) {
      // Update hash — hashchange event will handle the rest
      // (No page reload because it's just a hash change)
      window.location.hash = name;
      window.scrollTo(0, 0);
    } else {
      // All-visible mode: scroll to the section
      const target = sectionMap[name];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Update hash without triggering a jump (sections are all in DOM)
      history.replaceState(null, '', '#' + name);
      applyNavState(name);
    }
  });
});


// Respond to hash changes (browser back/forward, external links with #hash)
window.addEventListener('hashchange', function () {
  const active = getActiveSection();
  applyNavState(active);
  if (!SINGLE_SECTION_MODE) {
    const target = sectionMap[active];
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
});


// Initial load
applyNavState(getActiveSection());
