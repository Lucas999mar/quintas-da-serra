const DataManager = (() => {
  'use strict';
  const KEYS = { PROPERTIES: 'qds_properties', SETTINGS: 'qds_settings', AUTH: 'qds_auth_session', LEADS: 'qds_leads' };
  const ADMIN = { username: 'quintasdaserra', password: '@Qs198236' };

  function genId() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }

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
      { id: 'p_lot1', type: 'lote', title: 'Lote Premium — Quadra A', description: 'Lote plano com vista privilegiada para a serra. Ideal para construção de casa térrea ou sobrado. Documentação 100% regularizada.', price: 250000, area: 450, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Vista panorâmica', 'Terreno plano', 'Documentação ok', 'Perto do lazer', 'Infraestrutura completa'], location: 'Quadra A, Lote 15', status: 'active', featured: true, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_lot2', type: 'lote', title: 'Lote Aclive Suave — Quadra B', description: 'Lote com aclive suave, vegetação preservada nas laterais. Rua pavimentada e infraestrutura completa.', price: 180000, area: 360, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Aclive suave', 'Vegetação preservada', 'Rua pavimentada', 'Água e esgoto', 'Energia elétrica'], location: 'Quadra B, Lote 08', status: 'active', featured: false, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_lot3', type: 'lote', title: 'Lote de Esquina — Quadra C', description: 'Lote de esquina com duas frentes. Localização estratégica próxima à entrada do condomínio. Terreno plano pronto para construir.', price: 320000, area: 520, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Esquina', 'Duas frentes', 'Terreno plano', 'Perto da portaria'], location: 'Quadra C, Lote 01', status: 'active', featured: false, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_lot4', type: 'lote', title: 'Lote Reserva — Quadra D', description: 'Lote amplo em área reservada, com vista para a mata preservada. Máxima privacidade e tranquilidade.', price: 290000, area: 600, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Área reservada', 'Privacidade', 'Amplo', 'Vista para mata'], location: 'Quadra D, Lote 22', status: 'inactive', featured: false, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_house1', type: 'casa', title: 'Casa Moderna — 3 Suítes', description: 'Casa moderna com acabamento de alto padrão. Sala integrada com cozinha gourmet, varanda com churrasqueira e piscina com deck.', price: 850000, area: 220, bedrooms: 3, bathrooms: 3, garages: 2, features: ['Piscina', 'Churrasqueira', 'Suíte master', 'Cozinha gourmet', 'Jardim', 'Energia solar'], location: 'Quadra A, Casa 05', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_house2', type: 'casa', title: 'Sobrado Elegante — 4 Suítes', description: 'Sobrado com quatro suítes, área gourmet completa, piscina aquecida e garagem para três carros. Acabamento premium.', price: 1200000, area: 320, bedrooms: 4, bathrooms: 4, garages: 3, features: ['Piscina aquecida', 'Área gourmet', 'Home theater', '4 suítes', 'Lavabo social'], location: 'Quadra B, Casa 12', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },
      { id: 'p_house3', type: 'casa', title: 'Casa Térrea — 2 Suítes', description: 'Casa térrea compacta e funcional, ideal para casais. Design moderno com ambientes integrados e jardim gramado.', price: 520000, area: 140, bedrooms: 2, bathrooms: 2, garages: 1, features: ['Varanda', 'Jardim', 'Integrado', 'Garagem coberta', 'Porcelanato'], location: 'Quadra C, Casa 08', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      /* ========== Imóveis importados do Support Imobiliário ========== */

      { id: 'p_sup01', type: 'lote', title: 'Galeria Prime — Vale dos Cristais', description: 'GALERIA PRIME – VALE DOS CRISTAIS | MACAÉ\n\nNo coração de um dos condomínios mais valorizados da região, o Vale dos Cristais, nasce a Galeria Prime: um novo polo comercial planejado para atender um público exigente e de alto padrão.\n\nCom localização estratégica e inserida em um ambiente de grande densidade residencial qualificada, a Galeria Prime foi concebida para negócios que buscam visibilidade, conveniência e sofisticação.\n\nDestaques do empreendimento:\n• 8 lojas comerciais com 32 m²\n• 8 salas comerciais com 26 m²\n• 3º andar exclusivo para dois restaurantes\n• Público qualificado residente no entorno\n• Projeto moderno e funcional\n• Inauguração prevista: 2027', price: 0, area: 32, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Lojas comerciais', 'Salas comerciais', 'Restaurantes', 'Projeto moderno', 'Vale dos Cristais', 'Inauguração 2027'], location: 'Vale dos Cristais, Macaé-RJ', status: 'active', featured: true, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup02', type: 'casa', title: 'Casa Nova — Alphaville Rio das Ostras', description: 'Casa Nova no Alphaville Rio das Ostras – Sofisticação, Segurança e Alto Padrão de Vida.\n\nFernando Passeado Imóveis apresenta uma oportunidade única para quem busca morar com conforto, elegância e segurança em um dos endereços mais valorizados da região: o Alphaville Rio das Ostras.\n\nO imóvel é distribuído em 2 pavimentos:\n• 3 quartos bem distribuídos\n• Sala ampla\n• Cozinha moderna\n• Jardim privativo\n• Piscina\n• Área gourmet\n• Garagem para 2 carros\n\nDestaques: Casa nova, pronta para morar. Alto padrão de acabamento. Projeto arquitetônico moderno. Localização privilegiada no Alphaville.', price: 1500000, area: 250, bedrooms: 3, bathrooms: 3, garages: 2, features: ['Piscina', 'Área gourmet', 'Jardim privativo', 'Alto padrão', 'Segurança 24h', 'Alphaville'], location: 'Alphaville, Rio das Ostras-RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup03', type: 'casa', title: 'Casa Linear — Alphaville Rio das Ostras', description: 'Casa Nova no Alphaville Rio das Ostras – Sofisticação, Segurança e Alto Padrão de Vida.\n\nResidência recém-construída com excelente qualidade construtiva, arquitetura moderna e acabamento que evidencia bom gosto e atenção aos detalhes.\n\nDistribuída em 2 pavimentos:\n• 3 quartos bem distribuídos\n• Sala ampla\n• Cozinha moderna\n• Jardim privativo\n• Piscina\n• Área gourmet\n• Garagem para 2 carros\n\nCondomínio com segurança 24 horas, áreas de lazer completas e ambiente planejado para o bem-estar dos moradores.', price: 1450000, area: 240, bedrooms: 3, bathrooms: 3, garages: 2, features: ['Piscina', 'Área gourmet', 'Segurança 24h', 'Casa linear', 'Alto padrão', 'Alphaville'], location: 'Alphaville, Rio das Ostras-RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup04', type: 'casa', title: 'Casa no Vale das Palmeiras — Macaé', description: 'Casa no Vale das Palmeiras – Macaé | Conforto, Localização e Praticidade para sua Família.\n\nExcelente oportunidade para quem busca morar com qualidade de vida em uma das regiões que mais crescem em Macaé. Localizada no Vale das Palmeiras, bairro residencial tranquilo e valorizado, próximo ao Vale dos Cristais.\n\nA casa é composta por:\n• 2 quartos (sendo 2 suítes)\n• Sala confortável\n• Cozinha funcional\n• 3 banheiros\n• Área de serviço\n• Garagem\n• Área gourmet\n\nA apenas 2 minutos do Boulevard, onde você encontra supermercados, restaurantes, academias e diversas lojas. Aceita financiamento bancário.', price: 440000, area: 150, bedrooms: 2, bathrooms: 3, garages: 1, features: ['2 suítes', 'Área gourmet', 'Perto do Boulevard', 'Financiamento bancário', 'Infraestrutura completa'], location: 'Vale das Palmeiras, Macaé-RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup05', type: 'casa', title: 'Casa no Mar do Norte — Rio das Ostras', description: 'Casa no Mar do Norte: tranquilidade, natureza e localização estratégica em Rio das Ostras.\n\nSe você busca qualidade de vida, contato com a natureza e praticidade no dia a dia, esta é a oportunidade ideal. Localizada no bairro Mar do Norte, a apenas 5 minutos da praia.\n\nCaracterísticas:\n• 3 quartos, sendo 1 suíte\n• 3 banheiros\n• Garagem para 2 carros\n• Área gourmet\n• RGI (Registro Geral de Imóveis)\n\nPróxima a uma das faixas litorâneas mais preservadas do município — com águas claras, rochas e rica vegetação nativa. Fácil acesso tanto ao centro de Rio das Ostras quanto ao polo econômico de Macaé.', price: 600000, area: 180, bedrooms: 3, bathrooms: 3, garages: 2, features: ['Suíte', 'Área gourmet', 'Perto da praia', 'RGI regularizado', 'Natureza preservada'], location: 'Mar do Norte, Rio das Ostras-RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup06', type: 'casa', title: 'Imóvel com até 50% de Desconto — Leilão', description: 'Quer comprar um imóvel com até 50% de desconto?\n\nFernando Passeado Imóveis oferece acesso seguro e estratégico ao mercado de imóveis em leilão, com oportunidades exclusivas nos estados do Rio de Janeiro, São Paulo, Distrito Federal e Santa Catarina.\n\nServiços inclusos:\n• Levantamento e seleção de oportunidades\n• Análise jurídica e documental prévia\n• Avaliação de riscos e viabilidade\n• Representação durante o leilão\n• Regularização completa até a posse definitiva\n\nAcompanhamento por escritório advocatício especializado até a posse do imóvel e registro transferido.', price: 0, area: 0, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Leilão judicial', 'Até 50% desconto', 'Assessoria jurídica', 'RJ, SP, DF, SC', 'Regularização completa'], location: 'RJ, SP, DF e SC', status: 'active', featured: false, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup07', type: 'lote', title: 'Aretê Búzios — Balneário Planejado', description: 'Aretê Búzios – O Balneário Planejado\n\nCom mais de 6 milhões de m² e acesso privilegiado à praia e ao mar, o Aretê Búzios é um bairro planejado que combina urbanismo moderno, natureza e qualidade de vida.\n\nO projeto oferece:\n• Casas lineares com 142 m², três suítes\n• Casas duplex com plantas de 332 m² a 413 m²\n• Lotes de 1.000 m² a 2.000 m² com vista para campo de golfe\n• Canais navegáveis\n• Infraestrutura subterrânea completa\n• Lazer, esportes, comércio e serviços\n\nAretê Búzios traduz o melhor do estilo de vida buziano em um endereço planejado para viver com conforto, elegância e bem-estar.', price: 0, area: 1000, bedrooms: 0, bathrooms: 0, garages: 0, features: ['Campo de golfe', 'Canais navegáveis', 'Acesso à praia', 'Infraestrutura completa', 'Balneário planejado', '6 milhões m²'], location: 'Aretê, Búzios-RJ', status: 'active', featured: true, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup08', type: 'casa', title: 'Casa Alto Padrão — Canal da Marina, Búzios', description: 'Aluguel por Temporada | Ideal para Grupos e Famílias | Localização Privilegiada\n\nCasa de alto padrão no Canal da Marina, um dos endereços mais sofisticados de Búzios. Cercada por natureza, com vista privilegiada para o canal e embarcações.\n\nInfraestrutura:\n• 4 suítes (1 master com hidromassagem)\n• Camas para 16 pessoas\n• Piscina aquecida\n• Sauna a vapor\n• Área gourmet completa (churrasqueira, forno a lenha, cervejeira 0°, adega climatizada)\n• Deck náutico com acesso direto para lancha e jet ski\n• Jardim e vaga para 5 carros\n\nPróxima às principais praias, polo gastronômico e Rua das Pedras.', price: 0, area: 400, bedrooms: 4, bathrooms: 5, garages: 5, features: ['Piscina aquecida', 'Sauna', 'Deck náutico', 'Hidromassagem', 'Adega climatizada', 'Temporada'], location: 'Canal da Marina, Búzios-RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup09', type: 'lote', title: 'Fazenda — Silva Jardim, BR-101', description: 'Fazenda à venda em Silva Jardim – BR-101 | 300 alqueires\n\nExcelente fazenda localizada às margens da BR-101, com 300 alqueires e 600 metros de testada para a rodovia.\n\nCaracterísticas:\n• 300 alqueires\n• Casa grande (Sede)\n• Área Gourmet\n• Quadra de bocha\n• Lago com peixes\n• Ordenha mecânica\n• Curral e área de confinamento\n• Internet\n• 70% em baixada (terreno plano)\n• Abundância de água e diversas nascentes\n\nClima privilegiado, ideal para pecuária leiteira e agricultura. Grande vocação para empreendimento hoteleiro, eco-resort ou turismo rural. Atualmente produz leite para a marca Piracanjuba.', price: 7500000, area: 0, bedrooms: 0, bathrooms: 0, garages: 0, features: ['300 alqueires', 'BR-101', 'Nascentes', 'Sede completa', 'Produção leiteira', 'Eco-resort potencial'], location: 'Silva Jardim, RJ — BR-101', status: 'active', featured: false, images: ['assets/images/lot.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup10', type: 'casa', title: 'Casa no Bairro Aretê — Búzios', description: 'Casa no bairro Aretê em Búzios\n\nSe você busca conforto e uma vista deslumbrante para o mar, esta é a sua oportunidade! Localizada no bairro exclusivo de Aretê, em uma área construída de 750m² em um terreno de 4.550m², com paisagismo maravilhoso.\n\n• 1 Suíte master\n• 4 quartos\n• Sala de estar e sala de jantar\n• Salão de jogos\n• Sauna\n• 2 suítes externas\n• Garagem para 6 carros\n• Lavanderia e espaço de serviço\n\nPróximo ao campo de golfe, clube esportivo e social, pista de ciclismo e piscina de ondas para surfe (em construção).', price: 7500000, area: 750, bedrooms: 5, bathrooms: 7, garages: 6, features: ['Vista para o mar', 'Sauna', 'Salão de jogos', 'Campo de golfe', 'Terreno 4.550m²', 'Suíte master'], location: 'Aretê, Búzios-RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup11', type: 'casa', title: 'Casa no Peró — Cabo Frio', description: 'Casa no Peró, Cabo Frio\n\nExcelente residência em condomínio exclusivo com apenas 6 unidades. Casa com dois pavimentos, acabamento de qualidade, a apenas 800 metros da famosa Praia do Peró (certificada Bandeira Azul).\n\nDestaques:\n• 2 quartos com suíte e ar condicionado\n• 3 banheiros\n• Sala, cozinha planejada americana\n• Chuveirão\n• Condomínio: R$ 380/mês (inclui água)\n• IPTU: R$ 170/mês\n• Venda com porteira fechada\n• Documentação totalmente regularizada\n\nRegião de alta valorização imobiliária e turística. Próxima ao comércio local.', price: 500000, area: 120, bedrooms: 2, bathrooms: 3, garages: 1, features: ['Praia do Peró', 'Bandeira Azul', 'Porteira fechada', 'Condomínio fechado', 'Ar condicionado', 'Documentação ok'], location: 'Peró, Cabo Frio-RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup12', type: 'casa', title: 'Casa Duplex em Condomínio — Búzios', description: 'Casa duplex em condomínio fechado em Búzios.\n\n• 4 quartos suítes\n• Cozinha americana\n• WC social\n• Sala acoplada a varanda com extensão em pergolado\n• Área de serviço\n• Vagas para 2 carros\n\nCondomínio fechado todo arborizado, com infraestrutura total, iluminação de qualidade.', price: 1900000, area: 200, bedrooms: 4, bathrooms: 2, garages: 2, features: ['4 suítes', 'Condomínio fechado', 'Arborizado', 'Pergolado', 'Cozinha americana', 'Varanda'], location: 'Búzios, RJ', status: 'active', featured: false, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup13', type: 'casa', title: 'Casa 100m da Praia — Búzios', description: 'Casa em condomínio a 100m da praia em Búzios.\n\nSe você sempre quis ter uma casa em Búzios, fora da muvuca, mas com localização estratégica, esta é uma grande chance!\n\n• 4 dormitórios (suítes)\n• Cozinha planejada\n• Sala de estar e sala de jantar\n• Estacionamento para 3 carros\n• Lavanderia e quarto de empregada\n• Espaço gourmet com churrasqueira\n• Cozinha coberta e sala de apoio\n• Ofurô exclusivo com cobertura\n\nCondomínio com apenas 18 residências, piscina, sauna, churrasqueira. Segurança com porteiro 24h e câmeras.', price: 2000000, area: 280, bedrooms: 4, bathrooms: 2, garages: 3, features: ['100m da praia', 'Ofurô', 'Piscina', 'Sauna', 'Porteiro 24h', 'Câmeras de segurança'], location: 'Búzios, RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now },

      { id: 'p_sup14', type: 'casa', title: 'Mansão de Luxo — Hípica de Búzios', description: 'Mansão em área magnífica de 5.588m², com vista do mar, próximo ao Aretê na Hípica de Búzios.\n\n• Residência principal com 4 quartos suítes\n• 1 loft com 2 quartos\n• Casa de hóspedes com 3 quartos (1 suíte)\n• Casa de caseiro completa com 2 quartos, sala e cozinha\n• Área gramada e arborizada\n• Grande piscina\n• Área gourmet\n• Garagem coberta para 4 carros\n\nOportunidade única para quem tem família grande e gosta de receber amigos. Possibilidade para Guest House e ampliação de residências, tornando-se um condomínio!', price: 4800000, area: 5588, bedrooms: 11, bathrooms: 7, garages: 4, features: ['Vista para o mar', 'Piscina', 'Casa de hóspedes', 'Loft', 'Casa de caseiro', 'Terreno 5.588m²'], location: 'Hípica de Búzios, RJ', status: 'active', featured: true, images: ['assets/images/house.png'], videoUrl: '', createdAt: now, updatedAt: now }
    ];
  }


  function init() {
    if (!localStorage.getItem(KEYS.PROPERTIES)) localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaultProperties()));
    if (!localStorage.getItem(KEYS.SETTINGS)) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings()));
  }

  function getAllProps() { try { return JSON.parse(localStorage.getItem(KEYS.PROPERTIES) || '[]'); } catch (e) { return []; } }
  function getActiveProps(type) { let p = getAllProps().filter(x => x.status === 'active'); return type ? p.filter(x => x.type === type) : p; }
  function getFeatured() { return getAllProps().filter(p => p.status === 'active' && p.featured); }
  function getProp(id) { return getAllProps().find(p => p.id === id) || null; }

  function saveProp(prop) {
    const arr = getAllProps();
    const i = arr.findIndex(p => p.id === prop.id);
    const now = new Date().toISOString();
    if (i >= 0) { arr[i] = { ...arr[i], ...prop, updatedAt: now }; }
    else { if (!prop.id) prop.id = genId(); arr.unshift({ ...prop, createdAt: now, updatedAt: now }); }
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr));
    return prop;
  }

  function deleteProp(id) { localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(getAllProps().filter(p => p.id !== id))); }

  function toggleStatus(id) {
    const arr = getAllProps(); const p = arr.find(x => x.id === id);
    if (p) { p.status = p.status === 'active' ? 'inactive' : 'active'; p.updatedAt = new Date().toISOString(); localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr)); return p; }
    return null;
  }

  function toggleFeatured(id) {
    const arr = getAllProps(); const p = arr.find(x => x.id === id);
    if (p) { p.featured = !p.featured; p.updatedAt = new Date().toISOString(); localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr)); return p; }
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
  function saveSettings(s) { localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)); }

  /* --- Lead Management --- */
  function getAllLeads() { try { return JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]'); } catch (e) { return []; } }

  function saveLead(lead) {
    const arr = getAllLeads();
    const newLead = {
      id: genId(),
      status: 'Novo',
      createdAt: new Date().toISOString(),
      ...lead
    };
    arr.unshift(newLead);
    localStorage.setItem(KEYS.LEADS, JSON.stringify(arr));
    return newLead;
  }

  function updateLeadStatus(id, status) {
    const arr = getAllLeads();
    const lead = arr.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      localStorage.setItem(KEYS.LEADS, JSON.stringify(arr));
      return lead;
    }
    return null;
  }

  function deleteLead(id) {
    localStorage.setItem(KEYS.LEADS, JSON.stringify(getAllLeads().filter(l => l.id !== id)));
  }

  function getLeadStats() {
    const arr = getAllLeads();
    return {
      total: arr.length,
      new: arr.filter(l => l.status === 'Novo').length
    };
  }

  function login(u, pw) { if (u === ADMIN.username && pw === ADMIN.password) { sessionStorage.setItem(KEYS.AUTH, JSON.stringify({ ok: true })); return true; } return false; }
  function logout() { sessionStorage.removeItem(KEYS.AUTH); }
  function isLoggedIn() { try { const a = JSON.parse(sessionStorage.getItem(KEYS.AUTH)); return !!(a && a.ok); } catch (e) { return false; } }

  function fmtPrice(n) { return 'R$ ' + Number(n).toLocaleString('pt-BR'); }
  function fmtArea(n) { return n + ' m²'; }
  function fmtDate(d) { return new Date(d).toLocaleDateString('pt-BR'); }

  function getStats() {
    const a = getAllProps();
    return {
      total: a.length, active: a.filter(x => x.status === 'active').length, inactive: a.filter(x => x.status === 'inactive').length,
      lotes: a.filter(x => x.type === 'lote').length, casas: a.filter(x => x.type === 'casa').length, featured: a.filter(x => x.featured).length
    };
  }

  function reset() { localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaultProperties())); localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings())); }

  return {
    init, getAllProps, getActiveProps, getFeatured, getProp, saveProp, deleteProp, toggleStatus, toggleFeatured,
    getSettings, saveSettings, login, logout, isLoggedIn, fmtPrice, fmtArea, fmtDate, getStats, reset, genId,
    getAllLeads, saveLead, updateLeadStatus, deleteLead, getLeadStats
  };
})();

DataManager.init();
