/* AMBERION — site interactions. No dependencies. */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mark the current page in the nav ----------
     Normalised so it matches whether the host serves `/about.html`, `/about`
     or `/about/`, and treats a bare `/` as the home page. */
  var normalise = function (path) {
    var last = path.split('/').filter(Boolean).pop() || 'index';
    return last.replace(/\.html$/, '').toLowerCase();
  };
  var here = normalise(location.pathname);
  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (normalise(link.getAttribute('href') || '') === here) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll reveal ----------
     The hidden state is scoped to `.has-js` so the page stays fully readable
     if this script never runs. A timeout backstop reveals everything in case
     IntersectionObserver never fires (e.g. a never-painted background tab). */
  var reveals = document.querySelectorAll('.reveal');
  var showAll = function () {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reveals.length) {
    /* nothing to do */
  } else if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    document.documentElement.classList.add('has-js');
    setTimeout(showAll, 3000);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ----------------------------------------------------------------------
     Enquiry form.
     No backend is wired yet. The form posts nowhere; it validates client-side
     and hands the enquiry to the visitor's mail client via a mailto: link so
     no submission is silently lost. Replace the submit handler below with a
     fetch() POST to your form endpoint (Formspree, HubSpot, custom API).
     ---------------------------------------------------------------------- */
  var form = document.querySelector('[data-enquiry-form]');
  if (form) {
    var status = form.querySelector('.form__status');
    var mailTo = form.getAttribute('data-mailto') || 'info@amberion.in';

    var setStatus = function (msg, state) {
      if (!status) return;
      status.textContent = msg;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus('Please complete the required fields.', 'error');
        return;
      }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      var lines = [
        'Name: ' + get('name'),
        'Organisation: ' + get('organisation'),
        'Email: ' + get('email'),
        'Phone: ' + get('phone'),
        'Enquiry type: ' + get('enquiry'),
        'Project location: ' + get('location'),
        '',
        get('message')
      ];

      var subject = 'Website enquiry — ' + (get('enquiry') || 'General') + ' — ' + get('name');
      var href = 'mailto:' + mailTo +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      setStatus('Opening your email client to send this enquiry to ' + mailTo + '.');
      window.location.href = href;
    });
  }
})();
