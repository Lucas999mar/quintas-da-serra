const DataManager = (() => {
  'use strict';
  const KEYS = { PROPERTIES: 'qds_properties', SETTINGS: 'qds_settings', AUTH: 'qds_auth_session', LEADS: 'qds_leads' };
  const ADMIN = { username: 'quintasdaserra', password: '@Qs198236' };

  function genId() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }

  function defaultSettings() {
    return {
      "heroTitle": "Conheça nossas oportunidades Imobiliárias",
      "heroSubtitle": "Imóveis cuidadosamente selecionados para moradia, investimento ou desenvolvimento patrimonial, incluindo terrenos, casas, apartamentos e empreendimentos de diferentes perfis e padrões.",
      "heroBtn": "Conheça Nossos Imóveis",
      "aboutTitle": "Fernando Passeado – Corretor de Imóveis",
      "aboutText": "Com uma trajetória profissional marcada pela experiência multidisciplinar, Fernando Passeado atua no mercado imobiliário oferecendo aos seus clientes muito mais do que a intermediação na compra, venda e locação de imóveis. Sua formação e vivência nas áreas de comunicação, contabilidade, economia, marketing e avaliação imobiliária proporcionam uma visão estratégica e diferenciada para cada negociação.\\n\\nJornalista e empreendedor com ampla atuação no setor de comunicação e negócios, Fernando desenvolveu ao longo de décadas a capacidade de analisar cenários econômicos, identificar tendências de mercado e compreender os fatores que impactam a valorização dos imóveis.\\n\\nFernando Passeado reúne conhecimento de mercado, credibilidade profissional e relacionamento regional para conectar pessoas às melhores oportunidades imobiliárias, sempre com ética, compromisso e foco nos resultados.",
      "missionText": "Conectar pessoas às melhores oportunidades imobiliárias da Costa do Sol do Rio de Janeiro, oferecendo atendimento transparente, informação de qualidade e soluções seguras para compra, venda, locação e investimentos, contribuindo para a realização de sonhos e a valorização do patrimônio de nossos clientes.",
      "phone": "55 (22) 99217-3170",
      "email": "fernandopasseadoraiox@gmail.com",
      "address": "Costa do Sol, Rio de Janeiro - Brasil",
      "whatsapp": "5522992173170",
      "footer": "Fernando Passeado 2026- Suporte Imobiliário. Por Lucas Pinheiro todos os direitos reservados.",
      "facebook": "https://facebook.com/quintasdaserra",
      "instagram": "https://instagram.com/quintasdaserra",
      "heroImages": ["assets/images/hero-bg.png", "assets/images/hero-slide-2.png"],
      "aboutImages": ["assets/images/house.png", "assets/images/lot.png"]
    };
  }

  function defaultProperties() {
    const now = new Date().toISOString();
    return [
      {
        "id": "p_mpilxs7n97qzap",
        "title": "Alphaville R. Ostras",
        "type": "casa",
        "price": 1500000,
        "area": 320,
        "location": "Casa Nova no Alphaville Rio das Ostras",
        "bedrooms": 3,
        "bathrooms": 2,
        "garages": 2,
        "description": "Casa Nova no Alphaville Rio das Ostras - Sofisticacao, Seguranca e Alto Padrao de Vida. Fernando Passeado Imoveis apresenta uma oportunidade unica para quem busca morar com conforto e elegancia em um dos enderecos mais valorizados da regiao.",
        "features": ["2 pavimentos", "Piscina", "Area gourmet", "Casa nova"],
        "status": "active",
        "featured": true,
        "images": ["assets/images/house.png"],
        "videoUrl": "",
        "createdAt": now,
        "updatedAt": now
      },
      {
        "id": "p_mpimm99u6z74be",
        "title": "Alphaville Rio Das Ostras",
        "type": "casa",
        "price": 1450000,
        "area": 300,
        "location": "Casa Nova no Alphaville Rio das Ostras - Sofisticacao, Seguranca e Alto Padrao de Vida",
        "bedrooms": 3,
        "bathrooms": 3,
        "garages": 2,
        "description": "Casa Nova no Alphaville Rio das Ostras - Sofisticacao, Seguranca e Alto Padrao de Vida. Excelente oportunidade para sua familia.",
        "features": ["2 pavimentos", "Piscina", "Area gourmet"],
        "status": "active",
        "featured": true,
        "images": ["assets/images/house.png"],
        "videoUrl": "",
        "createdAt": now,
        "updatedAt": now
      },
      { id: 'p_sup04', type: 'casa', title: 'Casa no Vale das Palmeiras', description: 'Casa no Vale das Palmeiras – Macae | Conforto, Localizacao e Praticidade para sua Familia.', price: 440000, area: 150, bedrooms: 2, bathrooms: 3, garages: 1, features: ['2 suítes', 'Área gourmet'], location: 'Vale das Palmeiras, Macaé-RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_sup05', type: 'casa', title: 'Casa No Mar Do Norte - R. Ostras', description: 'Casa no Mar do Norte: tranquilidade, natureza e localizacao estrategica in Rio das Ostras.', price: 600000, area: 180, bedrooms: 3, bathrooms: 3, garages: 2, features: ['Suíte', 'Área gourmet', 'Perto da praia'], location: 'Mar do Norte, Rio das Ostras-RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_lot1', type: 'lote', title: 'Lote Premium — Quadra A', description: 'Lote plano com vista privilegiada para a serra.', price: 250000, area: 450, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Vista panorâmica', 'Terreno plano'], location: 'Quadra A, Lote 15', status: 'active', featured: true, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now }
    ];
  }

  function shrinkBase64Image(base64Str, maxSide = 800, quality = 0.5) {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:image')) { resolve(base64Str); return; }
      if (base64Str.length < 50000) { resolve(base64Str); return; }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        if (width > height && width > maxSide) { height *= maxSide / width; width = maxSide; }
        else if (height > maxSide) { width *= maxSide / height; height = maxSide; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        try { resolve(canvas.toDataURL('image/jpeg', quality)); } catch (e) { resolve(base64Str); }
      };
      img.onerror = () => resolve(base64Str);
      img.src = base64Str;
    });
  }

  async function optimizeAllStoredImages() {
    if (localStorage.getItem('qds_images_migrated_v3')) return;
    try {
      const propsStr = localStorage.getItem(KEYS.PROPERTIES);
      if (propsStr) {
        let props = JSON.parse(propsStr), modified = false;
        for (let p of props) {
          if (p.images) {
            for (let i = 0; i < p.images.length; i++) {
              if (p.images[i] && p.images[i].startsWith('data:image') && p.images[i].length > 50000) {
                const opt = await shrinkBase64Image(p.images[i], 800, 0.5);
                if (opt.length < p.images[i].length) { p.images[i] = opt; modified = true; }
              }
            }
          }
        }
        if (modified) localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
      }

      const settingsStr = localStorage.getItem(KEYS.SETTINGS);
      if (settingsStr) {
        let settings = JSON.parse(settingsStr), settingsModified = false;
        if (settings.heroImages) {
          for (let i = 0; i < settings.heroImages.length; i++) {
            if (settings.heroImages[i] && settings.heroImages[i].startsWith('data:image') && settings.heroImages[i].length > 80000) {
              const opt = await shrinkBase64Image(settings.heroImages[i], 1000, 0.5);
              if (opt.length < settings.heroImages[i].length) { settings.heroImages[i] = opt; settingsModified = true; }
            }
          }
        }
        if (settings.aboutImages) {
          for (let i = 0; i < settings.aboutImages.length; i++) {
            if (settings.aboutImages[i] && settings.aboutImages[i].startsWith('data:image') && settings.aboutImages[i].length > 80000) {
              const opt = await shrinkBase64Image(settings.aboutImages[i], 800, 0.5);
              if (opt.length < settings.aboutImages[i].length) { settings.aboutImages[i] = opt; settingsModified = true; }
            }
          }
        }
        if (settingsModified) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      }
      localStorage.setItem('qds_images_migrated_v3', 'true');
    } catch (e) { }
  }

  function init() {
    try {
      const storedPropsStr = localStorage.getItem(KEYS.PROPERTIES);
      const defaults = defaultProperties();
      if (!storedPropsStr) { localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaults)); }
      else {
        let storedProps = JSON.parse(storedPropsStr) || [], merged = [...storedProps], changed = false;
        for (const defProp of defaults) {
          const index = storedProps.findIndex(p => p.id === defProp.id);
          if (index === -1) { merged.push(defProp); changed = true; }
          else if (defProp.updatedAt && storedProps[index].updatedAt && new Date(defProp.updatedAt) > new Date(storedProps[index].updatedAt)) { merged[index] = { ...storedProps[index], ...defProp }; changed = true; }
        }
        if (changed) localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(merged));
      }
      const storedSettingsStr = localStorage.getItem(KEYS.SETTINGS);
      const defaultS = defaultSettings();
      if (!storedSettingsStr) { localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultS)); }
      else {
        let storedSettings = JSON.parse(storedSettingsStr) || {}, changedS = false;
        for (const key in defaultS) { if (!(key in storedSettings)) { storedSettings[key] = defaultS[key]; changedS = true; } }
        if (changedS) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(storedSettings));
      }
    } catch (e) { }
    setTimeout(optimizeAllStoredImages, 1000);
  }

  function getAllProps() { try { return JSON.parse(localStorage.getItem(KEYS.PROPERTIES) || '[]'); } catch (e) { return []; } }
  function getActiveProps(type) { let p = getAllProps().filter(x => x.status === 'active'); return type ? p.filter(x => x.type === type) : p; }
  function getFeatured() { return getAllProps().filter(p => p.status === 'active' && p.featured); }
  function getProp(id) { return getAllProps().find(p => p.id === id) || null; }

  function saveProp(prop) {
    const arr = getAllProps(), i = arr.findIndex(p => p.id === prop.id), now = new Date().toISOString();
    if (i >= 0) { arr[i] = { ...arr[i], ...prop, updatedAt: now }; }
    else { if (!prop.id) prop.id = genId(); arr.unshift({ ...prop, createdAt: now, updatedAt: now }); }
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr));
    return prop;
  }

  function deleteProp(id) { localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(getAllProps().filter(p => p.id !== id))); }
  function toggleStatus(id) { const arr = getAllProps(), p = arr.find(x => x.id === id); if (p) { p.status = p.status === 'active' ? 'inactive' : 'active'; p.updatedAt = new Date().toISOString(); localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr)); return p; } return null; }
  function toggleFeatured(id) { const arr = getAllProps(), p = arr.find(x => x.id === id); if (p) { p.featured = !p.featured; p.updatedAt = new Date().toISOString(); localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr)); return p; } return null; }
  function getSettings() { const defaults = defaultSettings(), saved = localStorage.getItem(KEYS.SETTINGS); return saved ? { ...defaults, ...JSON.parse(saved) } : defaults; }
  function saveSettings(s) { localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)); }
  function getAllLeads() { try { return JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]'); } catch (e) { return []; } }
  function saveLead(lead) { const arr = getAllLeads(), n = { id: genId(), status: 'Novo', createdAt: new Date().toISOString(), ...lead }; arr.unshift(n); localStorage.setItem(KEYS.LEADS, JSON.stringify(arr)); return n; }
  function updateLeadStatus(id, status) { const arr = getAllLeads(), l = arr.find(x => x.id === id); if (l) { l.status = status; localStorage.setItem(KEYS.LEADS, JSON.stringify(arr)); return l; } return null; }
  function deleteLead(id) { localStorage.setItem(KEYS.LEADS, JSON.stringify(getAllLeads().filter(l => l.id !== id))); }
  function getLeadStats() { const arr = getAllLeads(); return { total: arr.length, new: arr.filter(l => l.status === 'Novo').length }; }
  function login(u, pw) { if (u === ADMIN.username && pw === ADMIN.password) { sessionStorage.setItem(KEYS.AUTH, JSON.stringify({ ok: true })); return true; } return false; }
  function logout() { sessionStorage.removeItem(KEYS.AUTH); }
  function isLoggedIn() { try { return !!JSON.parse(sessionStorage.getItem(KEYS.AUTH)).ok; } catch (e) { return false; } }
  function fmtPrice(n) { return 'R$ ' + Number(n).toLocaleString('pt-BR'); }
  function fmtArea(n) { return n + ' m²'; }
  function fmtDate(d) { return new Date(d).toLocaleDateString('pt-BR'); }
  function getStats() { const a = getAllProps(); return { total: a.length, active: a.filter(x => x.status === 'active').length, inactive: a.filter(x => x.status === 'inactive').length, lotes: a.filter(x => x.type === 'lote').length, casas: a.filter(x => x.type === 'casa').length, featured: a.filter(x => x.featured).length }; }
  function reset() { localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaultProperties())); localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings())); }

  return { init, getAllProps, getActiveProps, getFeatured, getProp, saveProp, deleteProp, toggleStatus, toggleFeatured, getSettings, saveSettings, login, logout, isLoggedIn, fmtPrice, fmtArea, fmtDate, getStats, reset, genId, getAllLeads, saveLead, updateLeadStatus, deleteLead, getLeadStats };
})();
DataManager.init();
