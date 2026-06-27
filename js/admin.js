document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const loginSection = document.getElementById('login-section');
  const adminLayout = document.getElementById('admin-layout');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  const views = {
    dashboard: document.getElementById('view-dashboard'),
    properties: document.getElementById('view-properties'),
    leads: document.getElementById('view-leads'),
    settings: document.getElementById('view-settings')
  };

  const navItems = document.querySelectorAll('.nav-item');
  const propTableBody = document.getElementById('properties-list');
  const leadTableBody = document.getElementById('leads-list');
  const statsCards = {
    total: document.getElementById('stat-total'),
    active: document.getElementById('stat-active'),
    lotes: document.getElementById('stat-lotes'),
    casas: document.getElementById('stat-casas'),
    leadsNew: document.getElementById('stat-leads-new'),
    leadsTotal: document.getElementById('stat-leads-total')
  };

  const propModal = document.getElementById('prop-modal');
  const propForm = document.getElementById('prop-form');
  const modalTitle = document.getElementById('modal-title-admin');
  const cancelPropBtn = document.getElementById('cancel-prop-btn');
  const addPropBtn = document.getElementById('add-prop-btn');

  let currentEditingId = null;
  let currentImages = [];
  let currentHeroImages = [];
  let currentAboutImages = [];

  /* --- Auth Check --- */
  function checkAuth() {
    if (DataManager.isLoggedIn()) {
      loginSection.style.display = 'none';
      adminLayout.classList.add('active');
      renderDashboard();
    } else {
      loginSection.style.display = 'flex';
      adminLayout.classList.remove('active');
    }
  }

  /* --- Login --- */
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      if (DataManager.login(user, pass)) {
        checkAuth();
      } else {
        alert('Credenciais inválidas! (quintasdaserra / @Qs198236)');
      }
    });
  }

  /* --- Logout --- */
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      DataManager.logout();
      location.reload();
    });
  }

  /* --- Navigation --- */
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.dataset.view;
      if (!view) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      Object.values(views).forEach(v => v.style.display = 'none');
      views[view].style.display = 'block';

      if (view === 'dashboard') renderDashboard();
      if (view === 'properties') renderPropertiesList();
      if (view === 'leads') renderLeadsList();
      if (view === 'settings') renderSettings();
    });
  });

  /* --- Dashboard Rendering --- */
  function renderDashboard() {
    const stats = DataManager.getStats();
    // Use optional chaining or check for null as some methods might have been missing
    const leadStats = DataManager.getLeadStats ? DataManager.getLeadStats() : { total: 0, new: 0 };

    if (statsCards.total) statsCards.total.textContent = stats.total;
    if (statsCards.active) statsCards.active.textContent = stats.active;
    if (statsCards.lotes) statsCards.lotes.textContent = stats.lotes;
    if (statsCards.casas) statsCards.casas.textContent = stats.casas;

    if (statsCards.leadsNew) statsCards.leadsNew.textContent = leadStats.new;
    if (statsCards.leadsTotal) statsCards.leadsTotal.textContent = leadStats.total;

    // persistence warning
    const dashboardView = document.getElementById('view-dashboard');
    let warning = document.getElementById('persistence-warning');
    if (dashboardView && !warning) {
      warning = document.createElement('div');
      warning.id = 'persistence-warning';
      warning.style = "background:#fff3cd; border-left:5px solid #ffc107; padding:15px; margin-bottom:25px; border-radius:8px; color:#856404; font-size:14px;";
      dashboardView.prepend(warning);
      warning.innerHTML = `<strong>Dica de Persistência:</strong> Suas alterações (fotos e novos imóveis) estão salvas apenas <strong>neste navegador</strong>. 
      As fotos que você adicionou ontem sumiram porque o site mudou para o endereço da Vercel. 
      <br><br>Para salvar permanentemente para todos, use o botão <strong>"Gerar Código data.js"</strong> e atualize o código do projeto.`;
    }
  }

  /* --- Properties List Rendering --- */
  function renderPropertiesList() {
    const props = DataManager.getAllProps();
    propTableBody.innerHTML = props.map(p => `
            <tr>
                <td><strong>${p.title}</strong><br><small>${p.location}</small></td>
                <td><span class="status-pill ${p.type === 'lote' ? 'status-active' : 'status-inactive'}" style="background:var(--blue-pale);color:var(--blue-mid);">${p.type}</span></td>
                <td>${DataManager.fmtPrice(p.price)}</td>
                <td><span class="status-pill status-${p.status}">${p.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn-icon btn-edit" title="Editar" onclick="editProp('${p.id}')">✎</button>
                        <button class="btn-icon btn-edit" style="background:#fff3cd;color:#856404;" title="Destaque" onclick="toggleFeatured('${p.id}')">${p.featured ? '★' : '☆'}</button>
                        <button class="btn-icon btn-edit" style="background:#e2e8f0;color:#475569;" title="Ativar/Desativar" onclick="toggleStatus('${p.id}')">🔄</button>
                        <button class="btn-icon btn-delete" title="Excluir" onclick="deleteProp('${p.id}')">🗑</button>
                    </div>
                </td>
            </tr>
        `).join('');
  }

  /* --- Property Actions --- */
  window.editProp = (id) => {
    const p = DataManager.getProp(id);
    if (!p) return;
    currentEditingId = id;
    modalTitle.textContent = 'Editar Imóvel';

    document.getElementById('p-title').value = p.title;
    document.getElementById('p-type').value = p.type;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-area').value = p.area;
    document.getElementById('p-location').value = p.location;
    document.getElementById('p-bedrooms').value = p.bedrooms || 0;
    document.getElementById('p-bathrooms').value = p.bathrooms || 0;
    document.getElementById('p-garages').value = p.garages || 0;
    document.getElementById('p-desc').value = p.description;
    document.getElementById('p-features').value = (p.features || []).join(', ');
    document.getElementById('p-video').value = p.videoUrl || '';

    currentImages = [...(p.images || [])];
    renderAdminGallery();

    propModal.classList.add('active');
    toggleTypeFields(p.type);
  };

  window.renderAdminGallery = () => {
    const list = document.getElementById('admin-gallery-list');
    if (!list) return;
    list.innerHTML = currentImages.map((img, index) => `
            <div class="gallery-item-admin">
                <img src="${img}" alt="Preview">
                <button type="button" class="gallery-item-remove" onclick="removeImage(${index})">×</button>
            </div>
        `).join('');
  };

  window.removeImage = (index) => {
    currentImages.splice(index, 1);
    renderAdminGallery();
  };

  const addImgBtn = document.getElementById('add-image-btn');
  if (addImgBtn) {
    addImgBtn.addEventListener('click', () => {
      const input = document.getElementById('p-new-image');
      const url = input.value.trim();
      if (url) {
        currentImages.push(url);
        input.value = '';
        renderAdminGallery();
      }
    });
  }

  /* --- Image Upload Logic & Optimization --- */
  const uploadInput = document.getElementById('p-upload-image');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Resizing to prevent localStorage overflow
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSide = 800; // Optimized from 1000 to save space

            if (width > height && width > maxSide) {
              height *= maxSide / width;
              width = maxSide;
            } else if (height > maxSide) {
              width *= maxSide / height;
              height = maxSide;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Save as optimized JPEG with lower quality (0.55 is visually excellent but much smaller)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.55);
            currentImages.push(dataUrl);
            renderAdminGallery();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
      // Clear input so same file can be uploaded again if needed
      uploadInput.value = '';
    });
  }

  window.deleteProp = (id) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      DataManager.deleteProp(id);
      renderPropertiesList();
      renderDashboard();
    }
  };

  window.toggleStatus = (id) => {
    DataManager.toggleStatus(id);
    renderPropertiesList();
    renderDashboard();
  };

  window.toggleFeatured = (id) => {
    DataManager.toggleFeatured(id);
    renderPropertiesList();
  };

  addPropBtn.addEventListener('click', () => {
    currentEditingId = null;
    currentImages = [];
    renderAdminGallery();
    propForm.reset();
    propModal.classList.add('active');
    toggleTypeFields('lote');
  });

  cancelPropBtn.addEventListener('click', () => {
    propModal.classList.remove('active');
  });

  propForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prop = {
      id: currentEditingId || DataManager.genId(),
      title: document.getElementById('p-title').value,
      type: document.getElementById('p-type').value,
      price: Number(document.getElementById('p-price').value),
      area: Number(document.getElementById('p-area').value),
      location: document.getElementById('p-location').value,
      bedrooms: Number(document.getElementById('p-bedrooms').value),
      bathrooms: Number(document.getElementById('p-bathrooms').value),
      garages: Number(document.getElementById('p-garages').value),
      description: document.getElementById('p-desc').value,
      features: document.getElementById('p-features').value.split(',').map(s => s.trim()).filter(s => s),
      status: 'active',
      featured: false,
      images: currentImages.length > 0 ? currentImages : (document.getElementById('p-type').value === 'lote' ? ['assets/images/lot.png'] : ['assets/images/house.png']),
      videoUrl: document.getElementById('p-video').value.trim()
    };

    try {
      DataManager.saveProp(prop);
      propModal.classList.remove('active');
      renderPropertiesList();
      renderDashboard();
    } catch (err) {
      alert('Erro ao salvar imóvel! O espaço de armazenamento do navegador está cheio. Por favor, reduza a quantidade ou o tamanho das fotos anexadas para liberar espaço.');
    }
  });

  function toggleTypeFields(type) {
    const houseFields = document.querySelectorAll('.house-only');
    houseFields.forEach(f => f.style.display = (type === 'casa' ? 'block' : 'none'));
  }

  document.getElementById('p-type').addEventListener('change', (e) => {
    toggleTypeFields(e.target.value);
  });

  /* --- Settings Management --- */
  function renderSettings() {
    const s = DataManager.getSettings();
    document.getElementById('s-hero-title').value = s.heroTitle;
    document.getElementById('s-hero-subtitle').value = s.heroSubtitle;
    document.getElementById('s-hero-btn').value = s.heroBtn;
    document.getElementById('s-about-title').value = s.aboutTitle;
    document.getElementById('s-about-text').value = s.aboutText;
    document.getElementById('s-mission').value = s.missionText;
    document.getElementById('s-whatsapp').value = s.whatsapp;
    document.getElementById('s-phone').value = s.phone;
    document.getElementById('s-email').value = s.email;
    document.getElementById('s-address').value = s.address;
    document.getElementById('s-footer').value = s.footer;

    currentHeroImages = [...(s.heroImages || [])];
    renderAdminHeroList();

    currentAboutImages = [...(s.aboutImages || [])];
    renderAdminAboutList();
  }

  function renderAdminHeroList() {
    const list = document.getElementById('admin-hero-list');
    if (!list) return;
    list.innerHTML = currentHeroImages.map((img, index) => `
            <div class="gallery-item-admin">
                <img src="${img}" alt="Hero Thumbnail">
                <button type="button" class="gallery-item-remove" onclick="removeHeroImage(${index})">×</button>
            </div>
        `).join('');
  }

  window.removeHeroImage = (index) => {
    currentHeroImages.splice(index, 1);
    renderAdminHeroList();
  };

  const heroUpload = document.getElementById('hero-upload');
  if (heroUpload) {
    heroUpload.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSide = 1200; // Optimized from 1600 to prevent quota overflow

            if (width > height && width > maxSide) {
              height *= maxSide / width;
              width = maxSide;
            } else if (height > maxSide) {
              width *= maxSide / height;
              height = maxSide;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Optimized quality (0.6 is clean but lightweight)
            currentHeroImages.push(dataUrl);
            renderAdminHeroList();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
      heroUpload.value = '';
    });
  }

  function renderAdminAboutList() {
    const list = document.getElementById('admin-about-list');
    if (!list) return;
    list.innerHTML = currentAboutImages.map((img, index) => `
            <div class="gallery-item-admin">
                <img src="${img}" alt="About Thumbnail">
                <button type="button" class="gallery-item-remove" onclick="removeAboutImage(${index})">×</button>
            </div>
        `).join('');
  }

  window.removeAboutImage = (index) => {
    currentAboutImages.splice(index, 1);
    renderAdminAboutList();
  };

  const aboutUpload = document.getElementById('about-upload');
  if (aboutUpload) {
    aboutUpload.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSide = 800; // Smaller than hero images to optimize space

            if (width > height && width > maxSide) {
              height *= maxSide / width;
              width = maxSide;
            } else if (height > maxSide) {
              width *= maxSide / height;
              height = maxSide;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.65); // Standard compressed jpeg
            currentAboutImages.push(dataUrl);
            renderAdminAboutList();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
      aboutUpload.value = '';
    });
  }

  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const s = {
        heroTitle: document.getElementById('s-hero-title').value,
        heroSubtitle: document.getElementById('s-hero-subtitle').value,
        heroBtn: document.getElementById('s-hero-btn').value,
        aboutTitle: document.getElementById('s-about-title').value,
        aboutText: document.getElementById('s-about-text').value,
        missionText: document.getElementById('s-mission').value,
        whatsapp: document.getElementById('s-whatsapp').value,
        phone: document.getElementById('s-phone').value,
        email: document.getElementById('s-email').value,
        address: document.getElementById('s-address').value,
        footer: document.getElementById('s-footer').value,
        heroImages: currentHeroImages,
        aboutImages: currentAboutImages,
        facebook: DataManager.getSettings().facebook,
        instagram: DataManager.getSettings().instagram
      };
      try {
        DataManager.saveSettings(s);
        alert('Configurações salvas com sucesso!');
      } catch (err) {
        alert('Erro ao salvar configurações! O espaço de armazenamento do navegador está cheio. Por favor, remova ou otimize as fotos de fundo (Hero/Sobre Nós) para liberar espaço.');
      }
    });
  }

  /* --- Lead Action Functions (defined first for hoisting) --- */
  let leadToDeleteId = null;

  function handleDeleteLead(id) {
    leadToDeleteId = id;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('active');
  }

  function handleWhatsappLead(id) {
    const leads = DataManager.getAllLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    const purePhone = lead.phone.replace(/\D/g, '');
    let finalPhone = purePhone;
    if (purePhone.length <= 11 && !purePhone.startsWith('55')) {
      finalPhone = '55' + purePhone;
    }

    const message = encodeURIComponent('Olá ' + lead.name + ', vi seu contato no site Quintas Da Serra sobre "' + lead.subject + '". Como posso ajudar?');
    window.open('https://wa.me/' + finalPhone + '?text=' + message, '_blank');
  }

  function handleViewLead(id) {
    const leads = DataManager.getAllLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    const content = document.getElementById('lead-details-content');
    const modal = document.getElementById('lead-modal');
    const btnWa = document.getElementById('btn-modal-wa');

    if (content) {
      content.innerHTML = '<div style="display: grid; gap: 15px; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">'
        + '<div><strong>Nome:</strong><br>' + lead.name + '</div>'
        + '<div><strong>Data:</strong><br>' + DataManager.fmtDate(lead.createdAt) + '</div>'
        + '<div><strong>WhatsApp:</strong><br>' + lead.phone + '</div>'
        + '<div><strong>E-mail:</strong><br>' + lead.email + '</div>'
        + '<div style="grid-column: span 2;"><strong>Assunto:</strong><br>' + lead.subject + '</div>'
        + '</div>'
        + '<div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid var(--admin-primary);">'
        + '<strong>Mensagem:</strong><br>'
        + '<p style="margin-top: 10px; white-space: pre-wrap; line-height: 1.6;">' + lead.message + '</p>'
        + '</div>';
    }

    if (btnWa) {
      btnWa.onclick = function () { handleWhatsappLead(id); };
    }

    if (modal) modal.classList.add('active');
  }

  // Expose on window for global access
  window.handleDeleteLead = handleDeleteLead;
  window.handleWhatsappLead = handleWhatsappLead;
  window.handleViewLead = handleViewLead;

  /* --- Leads List Rendering --- */
  function renderLeadsList() {
    const leads = DataManager.getAllLeads();
    const list = document.getElementById('leads-list');
    if (!list) return;

    if (leads.length === 0) {
      list.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#94a3b8;">Nenhum contato recebido ainda.</td></tr>';
      return;
    }

    list.innerHTML = leads.map(function (l) {
      var date = DataManager.fmtDate(l.createdAt);

      return '<tr>'
        + '<td>' + date + '</td>'
        + '<td><strong>' + l.name + '</strong></td>'
        + '<td>' + l.phone + '<br><small>' + l.email + '</small></td>'
        + '<td>' + l.subject + '</td>'
        + '<td>'
        + '<select onchange="DataManager.updateLeadStatus(\'' + l.id + '\', this.value)" style="padding:4px; border-radius:4px; font-size:12px; border:1px solid #ddd;">'
        + '<option value="Novo"' + (l.status === 'Novo' ? ' selected' : '') + '>Novo</option>'
        + '<option value="Em Atendimento"' + (l.status === 'Em Atendimento' ? ' selected' : '') + '>Em Atendimento</option>'
        + '<option value="Finalizado"' + (l.status === 'Finalizado' ? ' selected' : '') + '>Finalizado</option>'
        + '</select>'
        + '</td>'
        + '<td>'
        + '<div class="actions">'
        + '<button class="btn-icon" style="background:#25d366; color:white; font-size:16px;" title="WhatsApp" onclick="handleWhatsappLead(\'' + l.id + '\')">📲</button>'
        + '<button class="btn-icon" style="background:#f1f5f9; color:#475569;" title="Ver Mensagem" onclick="handleViewLead(\'' + l.id + '\')">👁️</button>'
        + '<button class="btn-icon" style="background:#fbeaea; color:#8b1a1a;" title="Excluir" onclick="handleDeleteLead(\'' + l.id + '\')">🗑</button>'
        + '</div>'
        + '</td>'
        + '</tr>';
    }).join('');
  }

  /* --- Modal Event Listeners --- */
  const btnCloseLeadModal = document.getElementById('btn-close-lead-modal');
  if (btnCloseLeadModal) {
    btnCloseLeadModal.addEventListener('click', function () {
      document.getElementById('lead-modal').classList.remove('active');
    });
  }

  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  if (btnCancelDelete) {
    btnCancelDelete.addEventListener('click', function () {
      leadToDeleteId = null;
      document.getElementById('delete-confirm-modal').classList.remove('active');
    });
  }

  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', function () {
      if (leadToDeleteId) {
        DataManager.deleteLead(leadToDeleteId);
        renderLeadsList();
        renderDashboard();
        leadToDeleteId = null;
        document.getElementById('delete-confirm-modal').classList.remove('active');
      }
    });
  }

  /* --- JSON Backup & Sync Lógica --- */
  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const data = {
        properties: DataManager.getAllProps(),
        settings: DataManager.getSettings(),
        leads: DataManager.getAllLeads ? DataManager.getAllLeads() : []
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quintas_da_serra_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  const btnImportJsonTrigger = document.getElementById('btn-import-json-trigger');
  const importJsonFile = document.getElementById('import-json-file');
  if (btnImportJsonTrigger && importJsonFile) {
    btnImportJsonTrigger.addEventListener('click', () => {
      importJsonFile.click();
    });

    importJsonFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (!data.properties || !data.settings) {
            throw new Error('Formato de backup inválido. Chaves obrigatórias ausentes.');
          }

          if (confirm('A importação irá mesclar os imóveis novos e sobrescrever as configurações. Deseja continuar?')) {
            // Merge properties:
            const existingProps = DataManager.getAllProps();
            let mergedProps = [...existingProps];
            let propsAdded = 0;
            let propsUpdated = 0;

            data.properties.forEach(newP => {
              const idx = mergedProps.findIndex(p => p.id === newP.id);
              if (idx === -1) {
                mergedProps.unshift(newP);
                propsAdded++;
              } else {
                // If the imported property is newer, update it
                const existingP = mergedProps[idx];
                if (!existingP.updatedAt || !newP.updatedAt || new Date(newP.updatedAt) >= new Date(existingP.updatedAt)) {
                  mergedProps[idx] = { ...existingP, ...newP };
                  propsUpdated++;
                }
              }
            });

            localStorage.setItem('qds_properties', JSON.stringify(mergedProps));
            localStorage.setItem('qds_settings', JSON.stringify(data.settings));

            if (data.leads && Array.isArray(data.leads) && data.leads.length > 0) {
              const existingLeads = DataManager.getAllLeads ? DataManager.getAllLeads() : [];
              let mergedLeads = [...existingLeads];
              data.leads.forEach(newL => {
                if (!mergedLeads.some(l => l.id === newL.id)) {
                  mergedLeads.unshift(newL);
                }
              });
              localStorage.setItem('qds_leads', JSON.stringify(mergedLeads));
            }

            alert(`Backup importado com sucesso!\nImóveis adicionados: ${propsAdded}\nImóveis atualizados/mesclados: ${propsUpdated}`);
            location.reload();
          }
        } catch (err) {
          alert('Erro ao processar o arquivo de backup: ' + err.message);
        }
      };
      reader.readAsText(file);
      importJsonFile.value = ''; // Reset file input
    });
  }

  /* --- Export data.js Code Lógica --- */
  const btnExportCode = document.getElementById('btn-export-code');
  const codeModal = document.getElementById('code-modal');
  const codeExportTextarea = document.getElementById('code-export-textarea');
  const btnCloseCodeModal = document.getElementById('btn-close-code-modal');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const btnDownloadCodeFile = document.getElementById('btn-download-code-file');

  if (btnExportCode && codeModal && codeExportTextarea) {
    btnExportCode.addEventListener('click', () => {
      const props = DataManager.getAllProps();
      const settings = DataManager.getSettings();

      const code = generateDataJsCode(props, settings);
      codeExportTextarea.value = code;
      codeModal.classList.add('active');
    });
  }

  if (btnCloseCodeModal && codeModal) {
    btnCloseCodeModal.addEventListener('click', () => {
      codeModal.classList.remove('active');
    });
  }

  if (btnCopyCode && codeExportTextarea) {
    btnCopyCode.addEventListener('click', () => {
      codeExportTextarea.select();
      document.execCommand('copy');
      alert('Código copiado para a área de transferência!');
    });
  }

  if (btnDownloadCodeFile && codeExportTextarea) {
    btnDownloadCodeFile.addEventListener('click', () => {
      const code = codeExportTextarea.value;
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function generateDataJsCode(props, settings) {
    // Formata as propriedades e as configurações atuais de volta para a estrutura de data.js
    const propsJson = JSON.stringify(props, null, 6);
    const settingsJson = JSON.stringify(settings, null, 6);

    return `const DataManager = (() => {
  'use strict';
  const KEYS = { PROPERTIES: 'qds_properties', SETTINGS: 'qds_settings', AUTH: 'qds_auth_session', LEADS: 'qds_leads' };
  const ADMIN = { username: 'quintasdaserra', password: '@Qs198236' };

  function genId() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }

  function defaultSettings() {
    return ${settingsJson};
  }

  function defaultProperties() {
    return ${propsJson};
  }

  function shrinkBase64Image(base64Str, maxSide = 800, quality = 0.5) {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:image')) {
        resolve(base64Str);
        return;
      }
      if (base64Str.length < 50000) {
        resolve(base64Str);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSide) {
          height *= maxSide / width;
          width = maxSide;
        } else if (height > maxSide) {
          width *= maxSide / height;
          height = maxSide;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (e) {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
      img.src = base64Str;
    });
  }

  async function optimizeAllStoredImages() {
    if (localStorage.getItem('qds_images_migrated_v3')) return;
    
    // 1. Optimize properties images
    try {
      const propsStr = localStorage.getItem(KEYS.PROPERTIES);
      if (propsStr) {
        const props = JSON.parse(propsStr);
        let modified = false;
        for (let p of props) {
          if (p.images && p.images.length > 0) {
            for (let i = 0; i < p.images.length; i++) {
              const original = p.images[i];
              if (original && original.startsWith('data:image') && original.length > 50000) {
                const optimized = await shrinkBase64Image(original, 800, 0.5);
                if (optimized.length < original.length) {
                  p.images[i] = optimized;
                  modified = true;
                }
              }
            }
          }
        }
        if (modified) {
          localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
          console.log('qds_properties optimized successfully to free up localStorage.');
        }
      }
    } catch (e) {
      console.error('Error optimizing qds_properties:', e);
    }
    
    // 2. Optimize settings heroImages & aboutImages
    try {
      const settingsStr = localStorage.getItem(KEYS.SETTINGS);
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        let settingsModified = false;
        if (settings.heroImages && settings.heroImages.length > 0) {
          for (let i = 0; i < settings.heroImages.length; i++) {
            const original = settings.heroImages[i];
            if (original && original.startsWith('data:image') && original.length > 80000) {
              const optimized = await shrinkBase64Image(original, 1000, 0.5);
              if (optimized.length < original.length) {
                settings.heroImages[i] = optimized;
                settingsModified = true;
              }
            }
          }
        }
        if (settings.aboutImages && settings.aboutImages.length > 0) {
          for (let i = 0; i < settings.aboutImages.length; i++) {
            const original = settings.aboutImages[i];
            if (original && original.startsWith('data:image') && original.length > 80000) {
              const optimized = await shrinkBase64Image(original, 800, 0.5);
              if (optimized.length < original.length) {
                settings.aboutImages[i] = optimized;
                settingsModified = true;
              }
            }
          }
        }
        if (settingsModified) {
          localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
          console.log('qds_settings images optimized successfully.');
        }
      }
    } catch (e) {
      console.error('Error optimizing qds_settings:', e);
    }
    
    try {
      localStorage.setItem('qds_images_migrated_v3', 'true');
    } catch (e) {}
  }

  function init() {
    try {
      // 1. Merge default properties with stored properties
      const storedPropsStr = localStorage.getItem(KEYS.PROPERTIES);
      const defaults = defaultProperties();
      if (!storedPropsStr) {
        localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaults));
      } else {
        let storedProps = [];
        try {
          storedProps = JSON.parse(storedPropsStr) || [];
        } catch (e) {
          storedProps = [];
        }
        
        let merged = [...storedProps];
        let changed = false;
        
        // Add default properties that do not exist in localStorage
        for (const defProp of defaults) {
          const index = storedProps.findIndex(p => p.id === defProp.id);
          if (index === -1) {
            merged.push(defProp);
            changed = true;
          } else {
            // Update if default has a newer timestamp than stored
            const storedProp = storedProps[index];
            if (defProp.updatedAt && storedProp.updatedAt && new Date(defProp.updatedAt) > new Date(storedProp.updatedAt)) {
              merged[index] = { ...storedProp, ...defProp };
              changed = true;
            }
          }
        }
        
        if (changed) {
          localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(merged));
        }
      }

      // 2. Merge default settings with stored settings
      const storedSettingsStr = localStorage.getItem(KEYS.SETTINGS);
      const defaultS = defaultSettings();
      if (!storedSettingsStr) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultS));
      } else {
        let storedSettings = {};
        try {
          storedSettings = JSON.parse(storedSettingsStr) || {};
        } catch (e) {
          storedSettings = {};
        }
        
        let changedS = false;
        for (const key in defaultS) {
          if (!(key in storedSettings)) {
            storedSettings[key] = defaultS[key];
            changedS = true;
          }
        }
        if (changedS) {
          localStorage.setItem(KEYS.SETTINGS, JSON.stringify(storedSettings));
        }
      }
    } catch (e) {
      console.error('Failed to initialize default storage:', e);
    }
    setTimeout(optimizeAllStoredImages, 1000);
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
    
    try {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr));
      return prop;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      throw e;
    }
  }

  function deleteProp(id) {
    try {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(getAllProps().filter(p => p.id !== id)));
    } catch (e) {
      console.error('Failed to delete property:', e);
      throw e;
    }
  }

  function toggleStatus(id) {
    const arr = getAllProps(); const p = arr.find(x => x.id === id);
    if (p) {
      p.status = p.status === 'active' ? 'inactive' : 'active';
      p.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr));
        return p;
      } catch (e) {
        console.error('Failed to toggle status:', e);
        throw e;
      }
    }
    return null;
  }

  function toggleFeatured(id) {
    const arr = getAllProps(); const p = arr.find(x => x.id === id);
    if (p) {
      p.featured = !p.featured;
      p.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(arr));
        return p;
      } catch (e) {
        console.error('Failed to toggle featured:', e);
        throw e;
      }
    }
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
  
  function saveSettings(s) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
    } catch (e) {
      console.error('Failed to save settings:', e);
      throw e;
    }
  }

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
    try {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(arr));
      return newLead;
    } catch (e) {
      console.error('Failed to save lead:', e);
      throw e;
    }
  }

  function updateLeadStatus(id, status) {
    const arr = getAllLeads();
    const lead = arr.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      try {
        localStorage.setItem(KEYS.LEADS, JSON.stringify(arr));
        return lead;
      } catch (e) {
        console.error('Failed to update lead status:', e);
        throw e;
      }
    }
    return null;
  }

  function deleteLead(id) {
    try {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(getAllLeads().filter(l => l.id !== id)));
    } catch (e) {
      console.error('Failed to delete lead:', e);
      throw e;
    }
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

  function reset() {
    try {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(defaultProperties()));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings()));
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
  }

  return {
    init, getAllProps, getActiveProps, getFeatured, getProp, saveProp, deleteProp, toggleStatus, toggleFeatured,
    getSettings, saveSettings, login, logout, isLoggedIn, fmtPrice, fmtArea, fmtDate, getStats, reset, genId,
    getAllLeads, saveLead, updateLeadStatus, deleteLead, getLeadStats
  };
})();

DataManager.init();
`;
  }

  checkAuth();
});
