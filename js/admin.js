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
                alert('Credenciais inválidas! (admin / admin123)');
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
        
        if(statsCards.total) statsCards.total.textContent = stats.total;
        if(statsCards.active) statsCards.active.textContent = stats.active;
        if(statsCards.lotes) statsCards.lotes.textContent = stats.lotes;
        if(statsCards.casas) statsCards.casas.textContent = stats.casas;
        
        if(statsCards.leadsNew) statsCards.leadsNew.textContent = leadStats.new;
        if(statsCards.leadsTotal) statsCards.leadsTotal.textContent = leadStats.total;
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
        if(!list) return;
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
    if(addImgBtn) {
        addImgBtn.addEventListener('click', () => {
            const input = document.getElementById('p-new-image');
            const url = input.value.trim();
            if(url) {
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
                        const maxSide = 1000;

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

                        // Save as optimized JPEG
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
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

        DataManager.saveProp(prop);
        propModal.classList.remove('active');
        renderPropertiesList();
        renderDashboard();
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
    }

    function renderAdminHeroList() {
        const list = document.getElementById('admin-hero-list');
        if(!list) return;
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
                        const maxSide = 1600; // Larger for hero backgrounds

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
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
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
                facebook: DataManager.getSettings().facebook,
                instagram: DataManager.getSettings().instagram
            };
            DataManager.saveSettings(s);
            alert('Configurações salvas com sucesso!');
        });
    }

    /* --- Init --- */
    /* --- Leads List Rendering --- */
    function renderLeadsList() {
        const leads = DataManager.getAllLeads();
        const list = document.getElementById('leads-list');
        if(!list) return;

        list.innerHTML = leads.map(l => {
            const date = DataManager.fmtDate(l.createdAt);
            
            return `
                <tr data-id="${l.id}">
                    <td>${date}</td>
                    <td><strong>${l.name}</strong></td>
                    <td>${l.phone}<br><small>${l.email}</small></td>
                    <td>${l.subject}</td>
                    <td>
                        <select class="lead-status-select" style="padding:4px; border-radius:4px; font-size:12px; border:1px solid #ddd;">
                            <option value="Novo" ${l.status === 'Novo' ? 'selected' : ''}>Novo</option>
                            <option value="Em Atendimento" ${l.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option>
                            <option value="Finalizado" ${l.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                        </select>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon action-wa" style="background:#25d366; color:white; font-size:16px;" title="WhatsApp">📲</button>
                            <button class="btn-icon action-view" style="background:#f1f5f9; color:#475569;" title="Ver Mensagem">👁️</button>
                            <button class="btn-icon btn-delete action-delete" title="Excluir">🗑</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Event Delegation for Lead Actions
    const leadsList = document.getElementById('leads-list');
    if (leadsList) {
        leadsList.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const id = row.dataset.id;

            if (e.target.closest('.action-wa')) {
                whatsappLead(id);
            } else if (e.target.closest('.action-view')) {
                openLeadModal(id);
            } else if (e.target.closest('.action-delete')) {
                deleteLead(id);
            }
        });

        leadsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('lead-status-select')) {
                const row = e.target.closest('tr');
                if (row) {
                    DataManager.updateLeadStatus(row.dataset.id, e.target.value);
                    renderDashboard();
                }
            }
        });
    }

    const deleteLead = (id) => {
        if(confirm('Deseja excluir este lead permanentemente?')) {
            DataManager.deleteLead(id);
            renderLeadsList();
            renderDashboard();
        }
    };

    const whatsappLead = (id) => {
        const leads = DataManager.getAllLeads();
        const lead = leads.find(l => l.id === id);
        if(!lead) return;

        const purePhone = lead.phone.replace(/\D/g, '');
        let finalPhone = purePhone;
        if (purePhone.length <= 11 && !purePhone.startsWith('55')) {
            finalPhone = '55' + purePhone;
        }

        const message = encodeURIComponent(`Olá ${lead.name}, vi seu contato no site Quintas Da Serra sobre "${lead.subject}". Como posso ajudar?`);
        window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
    };

    const openLeadModal = (id) => {
        const leads = DataManager.getAllLeads();
        const lead = leads.find(l => l.id === id);
        if(!lead) return;

        const content = document.getElementById('lead-details-content');
        const modal = document.getElementById('lead-modal');
        const btnWa = document.getElementById('btn-modal-wa');

        if(content) {
            content.innerHTML = `
                <div style="display: grid; gap: 15px; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
                    <div><strong>Nome:</strong><br>${lead.name}</div>
                    <div><strong>Data:</strong><br>${DataManager.fmtDate(lead.createdAt)}</div>
                    <div><strong>WhatsApp:</strong><br>${lead.phone}</div>
                    <div><strong>E-mail:</strong><br>${lead.email}</div>
                    <div style="grid-column: span 2;"><strong>Assunto:</strong><br>${lead.subject}</div>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid var(--admin-primary);">
                    <strong>Mensagem:</strong><br>
                    <p style="margin-top: 10px; white-space: pre-wrap; line-height: 1.6;">${lead.message}</p>
                </div>
            `;
        }

        if(btnWa) {
            btnWa.onclick = () => whatsappLead(id);
        }

        if(modal) modal.classList.add('active');
    };

    checkAuth();
});
