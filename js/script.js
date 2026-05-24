(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5511977477153';
  const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

  /* ---- DOM refs ---- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const quickContactForm = document.getElementById('quickContactForm');
  const contactForm = document.getElementById('contactForm');
  const quoteTrack = document.getElementById('quoteTrack');
  const quotePrev = document.getElementById('quotePrev');
  const quoteNext = document.getElementById('quoteNext');
  const quoteDots = document.getElementById('quoteDots');
  const yearEl = document.getElementById('year');

  /* ---- Helpers ---- */
  function buildWhatsAppUrl(message) {
    return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  function validateField(input) {
    const valid = input.value.trim().length > 0;
    input.classList.toggle('error', !valid);
    return valid;
  }

  /* ---- Header scroll ---- */
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- Mobile nav ---- */
  navToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Active nav on scroll ---- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---- Quick contact form ---- */
  quickContactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome');
    const whatsapp = document.getElementById('whatsapp');

    const nomeValid = validateField(nome);
    const whatsappValid = validateField(whatsapp);

    if (!nomeValid || !whatsappValid) return;

    const message =
      `Olá Tatiana, meu nome é ${nome.value.trim()}.\n` +
      `Meu WhatsApp é ${whatsapp.value.trim()}.\n` +
      `Gostaria de solicitar um contato para agendamento de consulta.`;

    openWhatsApp(message);
    quickContactForm.reset();
  });

  /* ---- Contact form ---- */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('contactNome');
    const telefone = document.getElementById('contactTelefone');
    const mensagem = document.getElementById('contactMensagem');

    const nomeValid = validateField(nome);
    const telefoneValid = validateField(telefone);

    if (!nomeValid || !telefoneValid) return;

    let message =
      `Olá Tatiana, meu nome é ${nome.value.trim()}.\n` +
      `Meu telefone/WhatsApp é ${telefone.value.trim()}.`;

    if (mensagem.value.trim()) {
      message += `\n\nMensagem: ${mensagem.value.trim()}`;
    }

    message += '\n\nGostaria de agendar uma consulta.';

    openWhatsApp(message);
    contactForm.reset();
  });

  /* ---- Quotes carousel ---- */
  const quotes = quoteTrack.querySelectorAll('.quote-card');
  let currentQuote = 0;
  let quoteInterval;

  function createDots() {
    quotes.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Mensagem ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goToQuote(i);
        resetQuoteInterval();
      });
      quoteDots.appendChild(dot);
    });
  }

  function updateDots() {
    quoteDots.querySelectorAll('button').forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentQuote);
    });
  }

  function goToQuote(index) {
    quotes[currentQuote].classList.remove('active');
    currentQuote = (index + quotes.length) % quotes.length;
    quotes[currentQuote].classList.add('active');
    updateDots();
  }

  function nextQuote() { goToQuote(currentQuote + 1); }
  function prevQuote() { goToQuote(currentQuote - 1); }

  function resetQuoteInterval() {
    clearInterval(quoteInterval);
    quoteInterval = setInterval(nextQuote, 6000);
  }

  quotePrev.addEventListener('click', function () {
    prevQuote();
    resetQuoteInterval();
  });

  quoteNext.addEventListener('click', function () {
    nextQuote();
    resetQuoteInterval();
  });

  createDots();
  resetQuoteInterval();

  /* ---- Scroll reveal ---- */
  const revealElements = document.querySelectorAll(
    '.service-card, .about__photo-wrap, .about__content, .benefits__content, .benefits__visual, .contact__info, .contact__form'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- Footer year ---- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Touch swipe for quotes (mobile) ---- */
  let touchStartX = 0;

  quoteTrack.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  quoteTrack.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextQuote() : prevQuote();
      resetQuoteInterval();
    }
  }, { passive: true });

})();
