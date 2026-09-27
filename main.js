/* =========================================================
   WEBSITE ENGENHEIRO CIVIL — MAIN.JS
   Funcionalidades:
   1. Menu mobile (abrir/fechar)
   2. Header sticky com sombra ao scroll
   3. Ano dinâmico no footer
   4. Animação de contadores (KPIs)
   5. Animações ao scroll (reveal)
   6. Filtros do portefólio
   7. Validação do formulário de contacto
   8. Scroll suave para âncoras
   9. Botão "voltar ao topo"
   10. Fecho do menu ao clicar em links
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. MENU MOBILE
     ========================================================= */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav    = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    /* Fechar menu ao clicar num link (mobile) */
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          mainNav.classList.remove('open');
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }


  /* =========================================================
     2. HEADER STICKY — sombra ao fazer scroll
     ========================================================= */
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // executar no load


  /* =========================================================
     3. ANO DINÂMICO NO FOOTER
     ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* =========================================================
     4. CONTADORES ANIMADOS (KPIs)
     ========================================================= */
  const counters = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const rawText = el.textContent.trim();
    const target  = parseInt(el.dataset.count || rawText, 10) || 0;
    const suffix  = rawText.replace(/[0-9]/g, ''); // preserva "+" ou "%"
    const duration = 1800; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => counterObserver.observe(counter));
  }


  /* =========================================================
     5. ANIMAÇÕES AO SCROLL (reveal)
     ========================================================= */
  const revealTargets = document.querySelectorAll(
    '.service-card, .project-card, .testimonial, .process-step, .about-text, .about-image, .stat, .faq-item'
  );

  if (revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  }


  /* =========================================================
     6. FILTROS DO PORTEFÓLIO
     ========================================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.portfolio-grid-section .project-card');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => card.classList.add('visible'));
          } else {
            card.classList.remove('visible');
            card.style.display = 'none';
          }
        });
      });
    });
  }


  /* =========================================================
     7. VALIDAÇÃO DO FORMULÁRIO DE CONTACTO
     ========================================================= */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let valid = true;
      const errors = [];

      /* Limpar erros anteriores */
      contactForm.querySelectorAll('.field-error').forEach(el => el.remove());
      contactForm.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('input-error'));

      /* Validar campos obrigatórios */
      const required = contactForm.querySelectorAll('[required]');
      required.forEach(field => {
        const value = field.value.trim();

        if (!value) {
          valid = false;
          markError(field, 'Campo obrigatório.');
          errors.push(field.name);
          return;
        }

        if (field.type === 'email' && !isValidEmail(value)) {
          valid = false;
          markError(field, 'Introduza um email válido.');
          errors.push(field.name);
        }

        if (field.type === 'checkbox' && !field.checked) {
          valid = false;
          markError(field, 'É necessário aceitar a política de privacidade.');
          errors.push(field.name);
        }
      });

      if (!valid) {
        e.preventDefault();
        const firstError = contactForm.querySelector('.input-error');
        firstError?.focus();
        return;
      }

      /* Feedback visual (substituir por envio real depois) */
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'A enviar…';
      }
    });

    /* Limpar erro ao escrever */
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('input-error');
        const err = field.parentElement.querySelector('.field-error');
        if (err) err.remove();
      });
    });
  }

  function markError(field, message) {
    field.classList.add('input-error');
    const errorEl = document.createElement('small');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    field.parentElement.appendChild(errorEl);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }


  /* =========================================================
     8. SCROLL SUAVE PARA ÂNCORAS INTERNAS
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight + 20 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* =========================================================
     9. BOTÃO "VOLTAR AO TOPO"
     ========================================================= */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Voltar ao topo');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });


  /* =========================================================
     10. LAZY LOAD DE IMAGENS (fallback nativo)
     ========================================================= */
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
/* =========================================================
   CONTACTOS — WhatsApp + Instagram (M4LIK)
   ========================================================= */
const CONTACT = {
  whatsappNumber: '258861665786',                       // Moçambique + número
  whatsappMessage: 'Olá! Vi o site da M4LIK e gostaria de pedir um orçamento.',
  instagramUser: 'tembyte_yuratek'                      // <-- muda para o @ real
};

// Link base do WhatsApp
const waBaseUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;

// 1) Aplica data-contact="whatsapp" a todos os elementos (botão flutuante, topbar, footer)
document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
  el.href = waBaseUrl;
  el.target = '_blank';
  el.rel = 'noopener';
});

// 2) Aplica data-contact="instagram"
const igUrl = `https://instagram.com/${CONTACT.instagramUser}`;
document.querySelectorAll('[data-contact="instagram"]').forEach(el => {
  el.href = igUrl;
  el.target = '_blank';
  el.rel = 'noopener';
});

/* =========================================================
   FORMULÁRIO → WhatsApp (com os dados preenchidos)
   ========================================================= */
const btnWhatsApp = document.getElementById('btnWhatsApp');
if (btnWhatsApp) {
  btnWhatsApp.addEventListener('click', () => {
    const form = document.getElementById('contactForm');
    if (!form.reportValidity()) return; // valida campos obrigatórios

    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const servico  = form.servico.value || 'Não especificado';
    const mensagem = form.mensagem.value.trim();

    const texto =
      `*Novo pedido de orçamento*\n\n` +
      `*Nome:* ${nome}\n` +
      `*Email:* ${email}\n` +
      `*Telefone:* ${telefone}\n` +
      `*Serviço:* ${servico}\n` +
      `*Mensagem:* ${mensagem}`;

    const url = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  });
}

/* =========================================================
   FORMULÁRIO → Instagram (abre o Direct)
   ========================================================= */
const btnInstagram = document.getElementById('btnInstagram');
if (btnInstagram) {
  btnInstagram.addEventListener('click', () => {
    const form = document.getElementById('contactForm');
    if (!form.reportValidity()) return;

    // Copia a mensagem para a área de transferência (o Instagram não aceita texto pré-preenchido)
    const nome     = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const servico  = form.servico.value || 'Não especificado';
    const mensagem = form.mensagem.value.trim();

    const texto =
      `Olá! Vi o site da M4LIK.\n` +
      `Nome: ${nome}\n` +
      `Telefone: ${telefone}\n` +
      `Serviço: ${servico}\n` +
      `Mensagem: ${mensagem}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        alert('Mensagem copiada! Cola-a no Direct do Instagram.');
        window.open(`https://ig.me/m/${CONTACT.instagramUser}`, '_blank');
      }).catch(() => {
        window.open(`https://ig.me/m/${CONTACT.instagramUser}`, '_blank');
      });
    } else {
      window.open(`https://ig.me/m/${CONTACT.instagramUser}`, '_blank');
    }
  });
}
});