const DataManager = (() => {
  'use strict';
  const KEYS = { PROPERTIES: 'qds_properties', SETTINGS: 'qds_settings', AUTH: 'qds_auth_session' };
  const ADMIN = { username: 'admin', password: 'admin123' };

  function genId() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2,6); }

  function defaultSettings() {
    return {
      heroTitle: 'Viva com Exclusividade em Macaé',
      heroSubtitle: 'Lotes e casas no Quintas Da Serra — condomínio residencial cercado pela natureza da Serra Macaense.',
      heroBtn: 'Conheça Nossos Imóveis',
      aboutTitle: 'Sobre o Quintas Da Serra',
      aboutText: 'O Quintas Da Serra é um empreendimento residencial de alto padrão localizado na região serrana de Macaé-RJ. Com infraestrutura completa, segurança 24 horas e localização privilegiada em meio à natureza, oferece qualidade de vida incomparável.\n\nNossos lotes e casas são projetados para proporcionar conforto, exclusividade e contato direto com a natureza, sem abrir mão da praticidade e modernidade.',
      missionText: 'Proporcionar moradia de qualidade em harmonia com a natureza, oferecendo segurança, conforto e valorização patrimonial.',
      phone: '(22) 99999-9999',
      email: 'contato@quintasdaserra.com.br',
      address: 'Região Serrana de Macaé, RJ - Brasil',
      whatsapp: '5522999999999',
      footer: '© 2026 Quintas Da Serra Macaé-RJ. Todos os direitos reservados.',
      facebook: 'https://facebook.com/quintasdaserra',
      instagram: 'https://instagram.com/quintasdaserra',
      heroImages: ['assets/images/hero-bg.png', 'assets/images/hero-slide-2.png']
    };
  }

  function defaultProperties() {
    const now = new Date().toISOString();
    return [
      { id:'p_lot1', type:'lote', title:'Lote Premium — Quadra A', description:'Lote plano com vista privilegiada para a serra. Ideal para construção de casa térrea ou sobrado. Documentação 100% regularizada.', price:250000, area:450, bedrooms:0, bathrooms:0, garages:0, features:['Vista panorâmica','Terreno plano','Documentação ok','Perto do lazer','Infraestrutura completa'], location:'Quadra A, Lote 15', status:'active', featured:true, images:['assets/images/lot.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_lot2', type:'lote', title:'Lote Aclive Suave — Quadra B', description:'Lote com aclive suave, vegetação preservada nas laterais. Rua pavimentada e infraestrutura completa.', price:180000, area:360, bedrooms:0, bathrooms:0, garages:0, features:['Aclive suave','Vegetação preservada','Rua pavimentada','Água e esgoto','Energia elétrica'], location:'Quadra B, Lote 08', status:'active', featured:false, images:['assets/images/lot.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_lot3', type:'lote', title:'Lote de Esquina — Quadra C', description:'Lote de esquina com duas frentes. Localização estratégica próxima à entrada do condomínio. Terreno plano pronto para construir.', price:320000, area:520, bedrooms:0, bathrooms:0, garages:0, features:['Esquina','Duas frentes','Terreno plano','Perto da portaria'], location:'Quadra C, Lote 01', status:'active', featured:false, images:['assets/images/lot.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_lot4', type:'lote', title:'Lote Reserva — Quadra D', description:'Lote amplo em área reservada, com vista para a mata preservada. Máxima privacidade e tranquilidade.', price:290000, area:600, bedrooms:0, bathrooms:0, garages:0, features:['Área reservada','Privacidade','Amplo','Vista para mata'], location:'Quadra D, Lote 22', status:'inactive', featured:false, images:['assets/images/lot.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_house1', type:'casa', title:'Casa Moderna — 3 Suítes', description:'Casa moderna com acabamento de alto padrão. Sala integrada com cozinha gourmet, varanda com churrasqueira e piscina com deck.', price:850000, area:220, bedrooms:3, bathrooms:3, garages:2, features:['Piscina','Churrasqueira','Suíte master','Cozinha gourmet','Jardim','Energia solar'], location:'Quadra A, Casa 05', status:'active', featured:true, images:['assets/images/house.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_house2', type:'casa', title:'Sobrado Elegante — 4 Suítes', description:'Sobrado com quatro suítes, área gourmet completa, piscina aquecida e garagem para três carros. Acabamento premium.', price:1200000, area:320, bedrooms:4, bathrooms:4, garages:3, features:['Piscina aquecida','Área gourmet','Home theater','4 suítes','Lavabo social'], location:'Quadra B, Casa 12', status:'active', featured:true, images:['assets/images/house.png'], videoUrl: '', createdAt:now, updatedAt:now },
      { id:'p_house3', type:'casa', title:'Casa Térrea — 2 Suítes', description:'Casa térrea compacta e funcional, ideal para casais. Design moderno com ambientes integrados e jardim gramado.', price:520000, area:140, bedrooms:2, bathrooms:2, garages:1, features:['Varanda','Jardim','Integrado','Garagem coberta','Porcelanato'], location:'Quadra C, Casa 08', status:'active', featured:false, images:['assets/images/house.png'], videoUrl: '', createdAt:now, updatedAt:now }
    ];
  }


  function init() {
    if (!localStorage.getItem(KEYS.PROPERTIES)) localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaultProperties()));
    if (!localStorage.getItem(KEYS.SETTINGS)) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings()));
  }

  function getAllProps() { try { return JSON.parse(localStorage.getItem(KEYS.PROPERTIES)||'[]'); } catch(e){return[];} }
  function getActiveProps(type) { let p=getAllProps().filter(x=>x.status==='active'); return type?p.filter(x=>x.type===type):p; }
  function getFeatured() { return getAllProps().filter(p=>p.status==='active'&&p.featured); }
  function getProp(id) { return getAllProps().find(p=>p.id===id)||null; }

  function saveProp(prop) {
    const arr=getAllProps();
    const i=arr.findIndex(p=>p.id===prop.id);
    const now=new Date().toISOString();
    if(i>=0){arr[i]={...arr[i],...prop,updatedAt:now};}
    else{if(!prop.id)prop.id=genId();arr.unshift({...prop,createdAt:now,updatedAt:now});}
    localStorage.setItem(KEYS.PROPERTIES,JSON.stringify(arr));
    return prop;
  }

  function deleteProp(id) { localStorage.setItem(KEYS.PROPERTIES,JSON.stringify(getAllProps().filter(p=>p.id!==id))); }

  function toggleStatus(id) {
    const arr=getAllProps(); const p=arr.find(x=>x.id===id);
    if(p){p.status=p.status==='active'?'inactive':'active';p.updatedAt=new Date().toISOString();localStorage.setItem(KEYS.PROPERTIES,JSON.stringify(arr));return p;}
    return null;
  }

  function toggleFeatured(id) {
    const arr=getAllProps(); const p=arr.find(x=>x.id===id);
    if(p){p.featured=!p.featured;p.updatedAt=new Date().toISOString();localStorage.setItem(KEYS.PROPERTIES,JSON.stringify(arr));return p;}
    return null;
  }

  function getSettings() {
    const defaults = defaultSettings();
    const saved = localStorage.getItem(KEYS.SETTINGS);
    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
    }
    return defaults;
  }
  function saveSettings(s) { localStorage.setItem(KEYS.SETTINGS,JSON.stringify(s)); }

  function login(u,pw) { if(u===ADMIN.username&&pw===ADMIN.password){sessionStorage.setItem(KEYS.AUTH,JSON.stringify({ok:true}));return true;}return false; }
  function logout() { sessionStorage.removeItem(KEYS.AUTH); }
  function isLoggedIn() { try{const a=JSON.parse(sessionStorage.getItem(KEYS.AUTH));return!!(a&&a.ok);}catch(e){return false;} }

  function fmtPrice(n) { return 'R$ '+Number(n).toLocaleString('pt-BR'); }
  function fmtArea(n) { return n+' m²'; }
  function fmtDate(d) { return new Date(d).toLocaleDateString('pt-BR'); }

  function getStats() {
    const a=getAllProps();
    return { total:a.length, active:a.filter(x=>x.status==='active').length, inactive:a.filter(x=>x.status==='inactive').length,
      lotes:a.filter(x=>x.type==='lote').length, casas:a.filter(x=>x.type==='casa').length, featured:a.filter(x=>x.featured).length };
  }

  function reset() { localStorage.setItem(KEYS.PROPERTIES,JSON.stringify(defaultProperties())); localStorage.setItem(KEYS.SETTINGS,JSON.stringify(defaultSettings())); }

  return { init, getAllProps, getActiveProps, getFeatured, getProp, saveProp, deleteProp, toggleStatus, toggleFeatured,
    getSettings, saveSettings, login, logout, isLoggedIn, fmtPrice, fmtArea, fmtDate, getStats, reset, genId };
})();

DataManager.init();
