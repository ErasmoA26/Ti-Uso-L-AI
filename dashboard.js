// Dashboard JavaScript
class TicketSystem {
    constructor() {
        this.tickets = this.loadTickets();
        this.currentFilter = 'all';
        this.ticketCounter = this.tickets.length;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderTickets();
        this.setupDatePicker();
        this.showWelcomeBanner();
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // New ticket form
        const newTicketForm = document.getElementById('newTicketForm');
        if (newTicketForm) {
            newTicketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewTicket();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // File upload preview
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) {
            fileUpload.addEventListener('change', this.handleFileUpload.bind(this));
        }
    }

    setupDatePicker() {
        const deliveryDate = document.getElementById('deliveryDate');
        if (deliveryDate) {
            const today = new Date();
            const minDate = new Date(today.getTime() + (24 * 60 * 60 * 1000)); // Tomorrow
            deliveryDate.min = minDate.toISOString().split('T')[0];
        }
    }

    handleFileUpload(event) {
        const files = event.target.files;
        if (files.length > 0) {
            console.log(`${files.length} file(s) selezionati`);
            // Qui puoi aggiungere preview dei file se necessario
        }
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTickets();
    }

    createNewTicket() {
        const form = document.getElementById('newTicketForm');
        const formData = new FormData(form);
        
        const ticket = {
            id: `#T${String(this.ticketCounter + 1).padStart(3, '0')}`,
            title: formData.get('projectTitle'),
            type: formData.get('projectType'),
            description: formData.get('projectDescription'),
            budget: formData.get('budget'),
            priority: formData.get('priority'),
            deliveryDate: formData.get('deliveryDate'),
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            files: formData.get('fileUpload') ? Array.from(formData.get('fileUpload')).map(f => f.name) : []
        };

        this.tickets.unshift(ticket);
        this.ticketCounter++;
        this.saveTickets();
        this.updateStats();
        this.renderTickets();
        
        // Show success message with sound
        this.showNotification('🎉 Ticket creato con successo! Il tuo progetto è stato registrato.', 'success');
        this.playNotificationSound();
        
        // Close modal
        this.closeNewTicketModal();
        
        // Reset form
        form.reset();
    }

    updateProfile() {
        const form = document.getElementById('profileForm');
        const formData = new FormData(form);
        
        // Simulate profile update
        const profile = {
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            address: formData.get('address')
        };

        // Update user info in header
        document.querySelector('.user-name').textContent = profile.name;
        document.querySelector('.user-email').textContent = profile.email;
        
        this.showNotification('Profilo aggiornato con successo!', 'success');
        this.closeProfileModal();
    }

    updateTicketStatus(ticketId, newStatus) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.status = newStatus;
            ticket.updatedAt = new Date().toISOString();
            this.saveTickets();
            this.updateStats();
            this.renderTickets();
            this.showNotification(`Ticket ${ticketId} aggiornato a ${newStatus}`, 'success');
        }
    }

    renderTickets() {
        const ticketsList = document.getElementById('ticketsList');
        if (!ticketsList) return;

        let filteredTickets = this.tickets;
        
        if (this.currentFilter !== 'all') {
            filteredTickets = this.tickets.filter(ticket => {
                if (this.currentFilter === 'open') return ticket.status === 'open';
                if (this.currentFilter === 'in-progress') return ticket.status === 'in-progress';
                if (this.currentFilter === 'completed') return ticket.status === 'completed';
                return true;
            });
        }

        if (filteredTickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>Nessun ticket trovato</h3>
                    <p>${this.currentFilter === 'all' ? 'Crea il tuo primo ticket!' : 'Nessun ticket in questo stato'}</p>
                </div>
            `;
            return;
        }

        ticketsList.innerHTML = filteredTickets.map(ticket => this.renderTicketCard(ticket)).join('');
    }

    renderTicketCard(ticket) {
        const statusClass = `status-${ticket.status.replace(' ', '-')}`;
        const statusText = this.getStatusText(ticket.status);
        const priorityText = ticket.priority === 'urgent' ? 'Urgente' : 'Normale';
        const priorityClass = ticket.priority === 'urgent' ? 'urgent' : 'normal';
        
        return `
            <div class="ticket-card" data-ticket-id="${ticket.id}">
                <div class="ticket-header">
                    <div class="ticket-info">
                        <h3>${ticket.title}</h3>
                        <span class="ticket-id">${ticket.id}</span>
                    </div>
                    <span class="ticket-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="ticket-details">
                    <div class="ticket-detail">
                        <span class="detail-label">Tipo Progetto</span>
                        <span class="detail-value">${this.getProjectTypeText(ticket.type)}</span>
                    </div>
                    <div class="ticket-detail">
                        <span class="detail-label">Budget</span>
                        <span class="detail-value">${ticket.budget}</span>
                    </div>
                    <div class="ticket-detail">
                        <span class="detail-label">Priorità</span>
                        <span class="detail-value ${priorityClass}">${priorityText}</span>
                    </div>
                    <div class="ticket-detail">
                        <span class="detail-label">Data Consegna</span>
                        <span class="detail-value">${this.formatDate(ticket.deliveryDate)}</span>
                    </div>
                </div>
                
                <div class="ticket-description">
                    <p>${ticket.description.substring(0, 150)}${ticket.description.length > 150 ? '...' : ''}</p>
                </div>
                
                ${ticket.files.length > 0 ? `
                    <div class="ticket-files">
                        <span class="detail-label">File Allegati</span>
                        <div class="files-list">
                            ${ticket.files.map(file => `<span class="file-tag">${file}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="ticket-actions">
                    <button class="btn-ticket-action" onclick="ticketSystem.viewTicket('${ticket.id}')">
                        <i class="fas fa-eye"></i>
                        Visualizza
                    </button>
                    ${ticket.status === 'open' ? `
                        <button class="btn-ticket-action" onclick="ticketSystem.updateTicketStatus('${ticket.id}', 'in-progress')">
                            <i class="fas fa-play"></i>
                            Avvia
                        </button>
                    ` : ''}
                    ${ticket.status === 'in-progress' ? `
                        <button class="btn-ticket-action" onclick="ticketSystem.updateTicketStatus('${ticket.id}', 'completed')">
                            <i class="fas fa-check"></i>
                            Completa
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'open': 'Aperto',
            'in-progress': 'In Lavorazione',
            'completed': 'Completato'
        };
        return statusMap[status] || status;
    }

    getProjectTypeText(type) {
        const typeMap = {
            'website': 'Sito Web',
            'mobile-app': 'App Mobile',
            'ai-automation': 'Automazione AI',
            'chatbot': 'Chatbot',
            'ecommerce': 'E-commerce',
            'other': 'Altro'
        };
        return typeMap[type] || type;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT');
    }

    updateStats() {
        const totalTickets = this.tickets.length;
        const openTickets = this.tickets.filter(t => t.status === 'open').length;
        const inProgressTickets = this.tickets.filter(t => t.status === 'in-progress').length;
        const completedTickets = this.tickets.filter(t => t.status === 'completed').length;

        document.getElementById('totalTickets').textContent = totalTickets;
        document.getElementById('openTickets').textContent = openTickets;
        document.getElementById('inProgressTickets').textContent = inProgressTickets;
        document.getElementById('completedTickets').textContent = completedTickets;
    }

    viewTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            // Qui puoi implementare una vista dettagliata del ticket
            alert(`Visualizzazione ticket ${ticketId}: ${ticket.title}`);
        }
    }

    loadTickets() {
        const saved = localStorage.getItem('tickets');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Sample data
        return [
            {
                id: '#T001',
                title: 'Sito Web Aziendale',
                type: 'website',
                description: 'Creazione di un sito web moderno per la nostra azienda con sezioni per prodotti, servizi e contatti.',
                budget: '€1000-3000',
                priority: 'normal',
                deliveryDate: '2024-02-15',
                status: 'in-progress',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-20T14:45:00Z',
                files: ['logo.png', 'brand-guidelines.pdf']
            },
            {
                id: '#T002',
                title: 'Chatbot Customer Service',
                type: 'chatbot',
                description: 'Sviluppo di un chatbot intelligente per il supporto clienti 24/7.',
                budget: '€3000-5000',
                priority: 'urgent',
                deliveryDate: '2024-01-30',
                status: 'open',
                createdAt: '2024-01-18T09:15:00Z',
                updatedAt: '2024-01-18T09:15:00Z',
                files: ['requirements.docx']
            }
        ];
    }

    saveTickets() {
        localStorage.setItem('tickets', JSON.stringify(this.tickets));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 5 seconds for better visibility
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showWelcomeBanner() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const userName = currentUser ? currentUser.fullName.split(' ')[0] : 'Cliente';
        
        // Create welcome banner
        const banner = document.createElement('div');
        banner.className = 'welcome-banner';
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">
                    <i class="fas fa-rocket"></i>
                </div>
                <div class="banner-text">
                    <h3>Benvenuto, ${userName}! 🎉</h3>
                    <p>La tua dashboard è pronta. Crea il tuo primo ticket per iniziare!</p>
                </div>
                <button class="banner-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Insert banner at the top of the dashboard
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            dashboardContainer.insertBefore(banner, dashboardContainer.firstChild);
        }
        
        // Auto-remove banner after 10 seconds
        setTimeout(() => {
            if (banner.parentElement) {
                banner.remove();
            }
        }, 10000);
    }

    playNotificationSound() {
        // Crea un suono di notifica usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio non supportato:', error);
        }
    }
}

// Modal functions
function openNewTicketModal() {
    document.getElementById('newTicketModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewTicketModal() {
    document.getElementById('newTicketModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openProfileModal() {
    document.getElementById('profileModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
    document.body.style.overflow = '';
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

function logout() {
    if (confirm('Sei sicuro di voler uscire?')) {
        // Clear authentication data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// Check authentication before initializing
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    // Aggiorna header
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    if (userName && userEmail) {
        userName.textContent = currentUser.fullName || 'Cliente';
        userEmail.textContent = currentUser.email || 'cliente@email.com';
    }
    return true;
}
if (checkAuth()) {
    const ticketSystem = new TicketSystem();
}

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-color: rgba(40, 167, 69, 0.3);
}

.notification-success i {
    color: #28a745;
}

.notification-info i {
    color: #00ff88;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: rgba(255, 255, 255, 0.7);
}

.empty-state i {
    font-size: 3rem;
    color: rgba(0, 255, 136, 0.3);
    margin-bottom: 1rem;
}

.empty-state h3 {
    margin-bottom: 0.5rem;
    color: #fff;
}

.ticket-files {
    margin: 1rem 0;
}

.files-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.file-tag {
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    color: #00ff88;
}

.urgent {
    color: #ff6b6b;
    font-weight: 600;
}

.normal {
    color: #fff;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);