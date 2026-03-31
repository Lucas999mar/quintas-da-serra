document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --- Elements --- */
  const navbar = document.querySelector('.navbar');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroBtn = document.getElementById('hero-btn');
  const aboutTitle = document.getElementById('about-title');
  const aboutText = document.getElementById('about-text');
  const missionText = document.getElementById('mission-text');
  
  const phoneEls = document.querySelectorAll('.setting-phone');
  const emailEls = document.querySelectorAll('.setting-email');
  const addressEls = document.querySelectorAll('.setting-address');
  const footerEl = document.getElementById('footer-text');
  
  const fbLinks = document.querySelectorAll('.setting-fb');
  const igLinks = document.querySelectorAll('.setting-ig');
  const wpLink = document.getElementById('whatsapp-btn');
  
  const propsGrid = document.getElementById('props-grid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const featuredScroll = document.getElementById('featured-scroll');
  
  const modalOverlay = document.getElementById('prop-modal');
  const modalClose = document.getElementById('modal-close');
  
  const heroSlides = document.getElementById('hero-slides');
  let currentSlide = 0;
  let slideInterval = null;

  /* --- Contact Form --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const subjectSelect = document.getElementById('assunto');
    const groupOutro = document.getElementById('group-outro');
    const inputOutro = document.getElementById('assuntoOutro');

    if (subjectSelect) {
      subjectSelect.addEventListener('change', () => {
        if (subjectSelect.value === 'outro') {
          groupOutro.style.display = 'block';
          inputOutro.required = true;
        } else {
          groupOutro.style.display = 'none';
          inputOutro.required = false;
        }
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let subjectValue = subjectSelect.value;
      if (subjectValue === 'outro') {
        subjectValue = inputOutro.value || 'Outro';
      }

      const leadData = {
        name: document.getElementById('nome').value,
        email: document.getElementById('contatoEmail').value,
        phone: document.getElementById('contatoTel').value,
        subject: subjectValue,
        message: document.getElementById('mensagem').value
      };

      DataManager.saveLead(leadData);
      
      // Toast Success
      showToast('Mensagem enviada com sucesso! Nossa equipe entrará em contato.', 'success');
      contactForm.reset();
      if(groupOutro) groupOutro.style.display = 'none';
    });
  }

  function showToast(msg, type) {
    const toast = document.createElement('div');
    toast.className = `toast show ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* --- Load Settings --- */
  function loadSettings() {
    const s = DataManager.getSettings();
    if(heroTitle) heroTitle.innerHTML = s.heroTitle.replace('Quintas Da Serra', '<span>Quintas Da Serra</span>');
    if(heroSubtitle) heroSubtitle.textContent = s.heroSubtitle;
    if(heroBtn) heroBtn.textContent = s.heroBtn;
    
    if(aboutTitle) aboutTitle.textContent = s.aboutTitle;
    if(aboutText) aboutText.innerHTML = (s.aboutText || '').split('\n').map(p => '<p>'+p+'</p>').join('');
    if(missionText) missionText.innerHTML = '<p>'+(s.missionText || '')+'</p>';
    
    phoneEls.forEach(el => el.textContent = s.phone);
    emailEls.forEach(el => el.textContent = s.email);
    addressEls.forEach(el => el.textContent = s.address);
    if(footerEl) footerEl.textContent = s.footer;
    
    fbLinks.forEach(el => el.href = s.facebook);
    igLinks.forEach(el => el.href = s.instagram);
    if(wpLink) wpLink.href = 'https://wa.me/' + s.whatsapp;

    renderHeroSlider(s.heroImages || []);
  }

  function renderHeroSlider(images) {
    if(!heroSlides || !images.length) return;
    heroSlides.innerHTML = images.map((img, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>
    `).join('');
    
    startHeroSlider();
  }

  function startHeroSlider() {
    if(slideInterval) clearInterval(slideInterval);
    const slides = document.querySelectorAll('.hero-slide');
    if(slides.length <= 1) return;

    slideInterval = setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000);
  }

  /* --- Render Featured Strip --- */
  function renderFeatured() {
    if(!featuredScroll) return;
    const items = DataManager.getFeatured();
    if(items.length === 0) {
      document.querySelector('.featured-strip').style.display = 'none';
      return;
    }
    document.querySelector('.featured-strip').style.display = 'block';
    
    featuredScroll.innerHTML = items.map(p => `
      <a href="#imoveis" class="featured-mini-card" onclick="openPropModal('${p.id}')">
        <div class="fmc-type">${p.type} • ${p.location.split(',')[0]}</div>
        <div class="fmc-title">${p.title}</div>
        <div class="fmc-price">${DataManager.fmtPrice(p.price)}</div>
      </a>
    `).join('');
  }

  /* --- Render Properties Catalog --- */
  function renderCatalog(filter = 'all') {
    if(!propsGrid) return;
    let items = DataManager.getActiveProps();
    if(filter !== 'all') {
      items = items.filter(p => p.type === filter);
    }
    
    if(items.length === 0) {
      propsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--gray-500);">Nenhum imóvel encontrado nesta categoria.</div>';
      return;
    }
    
    propsGrid.innerHTML = items.map(p => {
      const isLote = p.type === 'lote';
      const badgeClass = isLote ? 'badge-lote' : 'badge-casa';
      const imgUrl = p.images && p.images.length > 0 ? p.images[0] : 'assets/images/lot.png';
      
      let specsHtml = '';
      if(isLote) {
        specsHtml = `
          <div class="prop-spec">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
            ${DataManager.fmtArea(p.area)}
          </div>
        `;
      } else {
        specsHtml = `
          <div class="prop-spec" title="Quartos/Suítes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20v-8M21 20v-8M4 12h16M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="7" r="2"/></svg>
            ${p.bedrooms}
          </div>
          <div class="prop-spec" title="Banheiros">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M4 14h16"/><path d="M9 14v4M15 14v4 M7 5h10a2 2 0 012 2v3H5V7a2 2 0 012-2z"/></svg>
            ${p.bathrooms}
          </div>
          <div class="prop-spec" title="Vagas">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 17h-5"/></svg>
            ${p.garages}
          </div>
          <div class="prop-spec" title="Área">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
            ${DataManager.fmtArea(p.area)}
          </div>
        `;
      }

      return `
        <div class="prop-card animate-in">
          <div class="prop-card-img">
            <img src="${imgUrl}" alt="${p.title}" loading="lazy">
            <span class="prop-card-badge ${badgeClass}">${p.type}</span>
            ${p.featured ? '<span class="prop-card-featured">Destaque</span>' : ''}
          </div>
          <div class="prop-card-body">
            <div class="prop-card-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${p.location}
            </div>
            <h3 class="prop-card-title">${p.title}</h3>
            <p class="prop-card-desc">${p.description}</p>
            <div class="prop-card-specs">${specsHtml}</div>
            <div class="prop-card-footer">
              <div class="prop-price">${DataManager.fmtPrice(p.price)}</div>
            </div>
            <button class="prop-card-btn" onclick="openPropModal('${p.id}')">Ver Detalhes</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* --- Event Listeners --- */
  
  // Navbar Scroll
  window.addEventListener('scroll', () => {
    if(window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Mobile Menu
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if(hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCatalog(tab.dataset.filter);
    });
  });

  // Modal Functions (Global so HTML onclick can reach them)
  window.openPropModal = function(id) {
    const p = DataManager.getProp(id);
    if(!p || !modalOverlay) return;
    
    const isLote = p.type === 'lote';
    const s = DataManager.getSettings();
    const wpMessage = encodeURIComponent(`Olá, tenho interesse no imóvel: ${p.title} (${p.location}) anunciado no site.`);
    const wpLinkVal = `https://wa.me/${s.whatsapp}?text=${wpMessage}`;
    const badgeClass = isLote ? 'badge-lote' : 'badge-casa';

    // Image Gallery HTML
    const images = p.images && p.images.length > 0 ? p.images : (isLote ? ['assets/images/lot.png'] : ['assets/images/house.png']);
    const galleryHtml = images.map(img => `<img src="${img}" alt="${p.title}" class="gallery-img">`).join('');

    // Video Player HTML
    let videoHtml = '';
    if(p.videoUrl) {
      const getEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
          return `https://www.youtube.com/embed/${match[2]}`;
        }
        if (url.includes('vimeo.com')) {
          const vimeoId = url.split('/').pop();
          return `https://player.vimeo.com/video/${vimeoId}`;
        }
        return url;
      };
      const embedUrl = getEmbedUrl(p.videoUrl);
      videoHtml = `
        <div class="modal-video-container">
          <div class="modal-features-title">Vídeo do Imóvel</div>
          <div class="video-wrapper">
            <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      `;
    }

    let specsHtml = `
      <div class="modal-spec">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--blue-light)"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
        <strong>Área:</strong> ${DataManager.fmtArea(p.area)}
      </div>
    `;

    if(!isLote) {
      specsHtml += `
        <div class="modal-spec"><strong>Quartos:</strong> ${p.bedrooms}</div>
        <div class="modal-spec"><strong>Banheiros:</strong> ${p.bathrooms}</div>
        <div class="modal-spec"><strong>Vagas:</strong> ${p.garages}</div>
      `;
    }

    const featuresHtml = (p.features || []).map(f => `<span class="modal-feature-tag">${f}</span>`).join('');

    const html = `
      <div class="modal-gallery">
        <div class="gallery-container">
          ${galleryHtml}
        </div>
      </div>
      <div class="modal-body">
        <span class="modal-badge ${badgeClass}">${p.type}</span>
        ${p.featured ? '<span class="modal-badge" style="background:var(--gold);color:var(--blue-dark);margin-left:8px;">Destaque</span>' : ''}
        
        <h2 class="modal-title">${p.title}</h2>
        <div class="modal-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${p.location}
        </div>
        
        <div class="modal-price">${DataManager.fmtPrice(p.price)}</div>
        
        <div class="modal-specs">${specsHtml}</div>
        
        <div class="modal-desc">${p.description.split('\n').map(l => `<p>${l}</p>`).join('')}</div>
        
        ${featuresHtml ? `
          <div class="modal-features-title">Características e Diferenciais</div>
          <div class="modal-features">${featuresHtml}</div>
        ` : ''}

        ${videoHtml}
        
        <a href="${wpLinkVal}" target="_blank" class="modal-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Falar com Corretor via WhatsApp
        </a>
      </div>
    `;

    document.getElementById('modal-content').innerHTML = html;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if(modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      document.getElementById('modal-content').innerHTML = '';
    }
  };

  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeModal();
  });

  // Contact Form Setup Check
  const form = document.getElementById('contactForm');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      form.reset();
    });
  }

  /* --- Init --- */
  loadSettings();
  renderFeatured();
  renderCatalog('all');

});
