// Admin Dashboard JavaScript
class AdminSystem {
    constructor() {
        this.tickets = this.loadAllTickets();
        this.clients = this.loadClients();
        this.currentFilter = 'all';
        this.selectedTickets = new Set();
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderTicketsTable();
        this.renderClients();
        this.initCharts();
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('ticketSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTickets(e.target.value);
            });
        }

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTicketsTable();
    }

    filterTickets(searchTerm) {
        const rows = document.querySelectorAll('#ticketsTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('#ticketsTableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedTickets.add(checkbox.value);
            } else {
                this.selectedTickets.delete(checkbox.value);
            }
        });
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const count = this.selectedTickets.size;
        document.getElementById('selectedCount').textContent = count;
    }

    renderTicketsTable() {
        const tbody = document.getElementById('ticketsTableBody');
        if (!tbody) return;

        let filteredTickets = this.tickets;
        
        if (this.currentFilter !== 'all') {
            filteredTickets = this.tickets.filter(ticket => {
                if (this.currentFilter === 'open') return ticket.status === 'open';
                if (this.currentFilter === 'in-progress') return ticket.status === 'in-progress';
                if (this.currentFilter === 'completed') return ticket.status === 'completed';
                if (this.currentFilter === 'urgent') return ticket.priority === 'urgent';
                return true;
            });
        }

        tbody.innerHTML = filteredTickets.map(ticket => this.renderTicketRow(ticket)).join('');
        
        // Re-attach event listeners
        this.attachTicketRowListeners();
    }

    renderTicketRow(ticket) {
        const statusClass = `status-${ticket.status.replace(' ', '-')}`;
        const statusText = this.getStatusText(ticket.status);
        const priorityText = ticket.priority === 'urgent' ? 'Urgente' : 'Normale';
        const priorityClass = `priority-${ticket.priority}`;
        const client = this.getClientById(ticket.clientId);
        
        return `
            <tr data-ticket-id="${ticket.id}">
                <td>
                    <input type="checkbox" value="${ticket.id}" ${this.selectedTickets.has(ticket.id) ? 'checked' : ''}>
                </td>
                <td class="ticket-id">${ticket.id}</td>
                <td class="ticket-client">
                    <span class="client-name">${client ? client.name : 'Cliente'}</span>
                    <span class="client-email">${client ? client.email : 'cliente@email.com'}</span>
                </td>
                <td class="ticket-title" title="${ticket.title}">${ticket.title}</td>
                <td><span class="ticket-type">${this.getProjectTypeText(ticket.type)}</span></td>
                <td><span class="ticket-priority ${priorityClass}">${priorityText}</span></td>
                <td><span class="ticket-status ${statusClass}">${statusText}</span></td>
                <td>${this.formatDate(ticket.createdAt)}</td>
                <td class="ticket-actions">
                    <button class="btn-table-action" onclick="adminSystem.viewTicketDetails('${ticket.id}')" title="Visualizza">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-table-action" onclick="adminSystem.editTicket('${ticket.id}')" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-table-action" onclick="adminSystem.changeStatus('${ticket.id}')" title="Cambia Stato">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    attachTicketRowListeners() {
        // Checkbox listeners
        document.querySelectorAll('#ticketsTableBody input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedTickets.add(e.target.value);
                } else {
                    this.selectedTickets.delete(e.target.value);
                }
                this.updateSelectedCount();
            });
        });
    }

    renderClients() {
        const clientsGrid = document.getElementById('clientsGrid');
        if (!clientsGrid) return;

        clientsGrid.innerHTML = this.clients.map(client => this.renderClientCard(client)).join('');
    }

    renderClientCard(client) {
        const clientTickets = this.tickets.filter(t => t.clientId === client.id);
        const openTickets = clientTickets.filter(t => t.status === 'open').length;
        const completedTickets = clientTickets.filter(t => t.status === 'completed').length;

        return `
            <div class="client-card">
                <div class="client-header">
                    <div class="client-info">
                        <h3>${client.name}</h3>
                        <span class="client-email">${client.email}</span>
                    </div>
                    <button class="btn-table-action" onclick="adminSystem.viewClientDetails('${client.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="client-stats">
                    <div class="client-stat">
                        <span class="client-stat-number">${clientTickets.length}</span>
                        <span class="client-stat-label">Ticket Totali</span>
                    </div>
                    <div class="client-stat">
                        <span class="client-stat-number">${openTickets}</span>
                        <span class="client-stat-label">In Attesa</span>
                    </div>
                    <div class="client-stat">
                        <span class="client-stat-number">${completedTickets}</span>
                        <span class="client-stat-label">Completati</span>
                    </div>
                    <div class="client-stat">
                        <span class="client-stat-number">${client.joinDate}</span>
                        <span class="client-stat-label">Membro da</span>
                    </div>
                </div>
            </div>
        `;
    }

    initCharts() {
        this.initTicketsChart();
        this.initStatusChart();
    }

    initTicketsChart() {
        const ctx = document.getElementById('ticketsChart');
        if (!ctx) return;

        const monthlyData = this.getMonthlyTicketData();
        
        this.charts.tickets = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Ticket Creati',
                    data: monthlyData.data,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    initStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const statusData = this.getStatusDistribution();
        
        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Aperti', 'In Lavorazione', 'Completati'],
                datasets: [{
                    data: [statusData.open, statusData.inProgress, statusData.completed],
                    backgroundColor: [
                        '#ffc107',
                        '#007bff',
                        '#28a745'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    getMonthlyTicketData() {
        const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const data = new Array(12).fill(0);
        
        this.tickets.forEach(ticket => {
            const month = new Date(ticket.createdAt).getMonth();
            data[month]++;
        });

        return {
            labels: months,
            data: data
        };
    }

    getStatusDistribution() {
        return {
            open: this.tickets.filter(t => t.status === 'open').length,
            inProgress: this.tickets.filter(t => t.status === 'in-progress').length,
            completed: this.tickets.filter(t => t.status === 'completed').length
        };
    }

    updateStats() {
        const totalTickets = this.tickets.length;
        const activeClients = this.clients.length;
        const pendingTickets = this.tickets.filter(t => t.status === 'open').length;
        const monthlyRevenue = this.calculateMonthlyRevenue();

        document.getElementById('totalTicketsAdmin').textContent = totalTickets;
        document.getElementById('activeClients').textContent = activeClients;
        document.getElementById('pendingTickets').textContent = pendingTickets;
        document.getElementById('monthlyRevenue').textContent = `€${monthlyRevenue}`;
    }

    calculateMonthlyRevenue() {
        // Simulate revenue calculation based on completed tickets
        const completedTickets = this.tickets.filter(t => t.status === 'completed');
        return completedTickets.reduce((total, ticket) => {
            const budget = this.parseBudget(ticket.budget);
            return total + budget.average;
        }, 0);
    }

    parseBudget(budgetString) {
        const ranges = {
            '€500-1000': { min: 500, max: 1000, average: 750 },
            '€1000-3000': { min: 1000, max: 3000, average: 2000 },
            '€3000-5000': { min: 3000, max: 5000, average: 4000 },
            '€5000+': { min: 5000, max: 10000, average: 7500 }
        };
        return ranges[budgetString] || { min: 0, max: 0, average: 0 };
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

    getClientById(clientId) {
        return this.clients.find(c => c.id === clientId);
    }

    loadAllTickets() {
        const saved = localStorage.getItem('tickets');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Sample data with client IDs
        return [
            {
                id: '#T001',
                clientId: 'client1',
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
                clientId: 'client2',
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
            },
            {
                id: '#T003',
                clientId: 'client1',
                title: 'App Mobile E-commerce',
                type: 'mobile-app',
                description: 'Sviluppo di un\'app mobile per e-commerce con funzionalità di pagamento e gestione ordini.',
                budget: '€5000+',
                priority: 'normal',
                deliveryDate: '2024-03-15',
                status: 'completed',
                createdAt: '2024-01-10T14:20:00Z',
                updatedAt: '2024-01-25T16:30:00Z',
                files: ['design-mockups.zip', 'api-docs.pdf']
            }
        ];
    }

    loadClients() {
        const saved = localStorage.getItem('clients');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Sample clients
        return [
            {
                id: 'client1',
                name: 'Mario Rossi',
                email: 'mario.rossi@azienda.com',
                company: 'Azienda SRL',
                joinDate: 'Gen 2024',
                phone: '+39 123 456 7890'
            },
            {
                id: 'client2',
                name: 'Giulia Bianchi',
                email: 'giulia.bianchi@startup.it',
                company: 'Startup Innovativa',
                joinDate: 'Feb 2024',
                phone: '+39 098 765 4321'
            }
        ];
    }

    // Action methods
    viewTicketDetails(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            const client = this.getClientById(ticket.clientId);
            const content = document.getElementById('ticketDetailsContent');
            
            content.innerHTML = `
                <div class="ticket-details-full">
                    <div class="ticket-header-details">
                        <h3>${ticket.title}</h3>
                        <span class="ticket-id">${ticket.id}</span>
                    </div>
                    
                    <div class="ticket-info-grid">
                        <div class="info-group">
                            <label>Cliente</label>
                            <p>${client ? client.name : 'Cliente'}</p>
                        </div>
                        <div class="info-group">
                            <label>Email</label>
                            <p>${client ? client.email : 'cliente@email.com'}</p>
                        </div>
                        <div class="info-group">
                            <label>Tipo Progetto</label>
                            <p>${this.getProjectTypeText(ticket.type)}</p>
                        </div>
                        <div class="info-group">
                            <label>Budget</label>
                            <p>${ticket.budget}</p>
                        </div>
                        <div class="info-group">
                            <label>Priorità</label>
                            <p>${ticket.priority === 'urgent' ? 'Urgente' : 'Normale'}</p>
                        </div>
                        <div class="info-group">
                            <label>Data Consegna</label>
                            <p>${this.formatDate(ticket.deliveryDate)}</p>
                        </div>
                    </div>
                    
                    <div class="ticket-description-full">
                        <label>Descrizione</label>
                        <p>${ticket.description}</p>
                    </div>
                    
                    ${ticket.files.length > 0 ? `
                        <div class="ticket-files-full">
                            <label>File Allegati</label>
                            <div class="files-list">
                                ${ticket.files.map(file => `<span class="file-tag">${file}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="ticket-actions-full">
                        <button class="btn-submit" onclick="adminSystem.changeStatus('${ticket.id}')">
                            <i class="fas fa-exchange-alt"></i>
                            Cambia Stato
                        </button>
                        <button class="btn-admin-action" onclick="adminSystem.editTicket('${ticket.id}')">
                            <i class="fas fa-edit"></i>
                            Modifica
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('ticketDetailsModal').classList.add('active');
        }
    }

    changeStatus(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
            const statuses = ['open', 'in-progress', 'completed'];
            const currentIndex = statuses.indexOf(ticket.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            
            ticket.status = nextStatus;
            ticket.updatedAt = new Date().toISOString();
            
            this.saveTickets();
            this.updateStats();
            this.renderTicketsTable();
            this.updateCharts();
            
            this.showNotification(`Ticket ${ticketId} aggiornato a ${this.getStatusText(nextStatus)}`, 'success');
        }
    }

    editTicket(ticketId) {
        // Implement ticket editing functionality
        this.showNotification('Funzionalità di modifica in sviluppo', 'info');
    }

    viewClientDetails(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            const clientTickets = this.tickets.filter(t => t.clientId === clientId);
            alert(`Dettagli cliente: ${client.name}\nEmail: ${client.email}\nTicket totali: ${clientTickets.length}`);
        }
    }

    updateCharts() {
        if (this.charts.tickets) {
            const monthlyData = this.getMonthlyTicketData();
            this.charts.tickets.data.datasets[0].data = monthlyData.data;
            this.charts.tickets.update();
        }
        
        if (this.charts.status) {
            const statusData = this.getStatusDistribution();
            this.charts.status.data.datasets[0].data = [statusData.open, statusData.inProgress, statusData.completed];
            this.charts.status.update();
        }
    }

    saveTickets() {
        localStorage.setItem('tickets', JSON.stringify(this.tickets));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Modal functions
function openTicketDetailsModal() {
    document.getElementById('ticketDetailsModal').classList.add('active');
}

function closeTicketDetailsModal() {
    document.getElementById('ticketDetailsModal').classList.remove('active');
}

function openBulkActions() {
    if (adminSystem.selectedTickets.size === 0) {
        adminSystem.showNotification('Seleziona almeno un ticket', 'info');
        return;
    }
    document.getElementById('bulkActionsModal').classList.add('active');
}

function closeBulkActionsModal() {
    document.getElementById('bulkActionsModal').classList.remove('active');
}

function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function executeBulkAction() {
    const action = document.getElementById('bulkAction').value;
    if (!action) {
        adminSystem.showNotification('Seleziona un\'azione', 'info');
        return;
    }
    
    // Implement bulk actions
    adminSystem.showNotification('Azione di massa eseguita', 'success');
    closeBulkActionsModal();
}

function exportTickets() {
    const data = JSON.stringify(adminSystem.tickets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    adminSystem.showNotification('Esportazione completata', 'success');
}

function saveSettings() {
    const form = document.getElementById('settingsForm');
    const formData = new FormData(form);
    
    // Save settings to localStorage
    const settings = {
        emailNotifications: formData.get('emailNotifications'),
        autoAssign: formData.get('autoAssign'),
        ticketPrefix: formData.get('ticketPrefix')
    };
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    adminSystem.showNotification('Impostazioni salvate', 'success');
    closeSettingsModal();
}

function toggleAdminDropdown() {
    const dropdown = document.getElementById('adminDropdown');
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
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.admin-menu')) {
        document.getElementById('adminDropdown').classList.remove('active');
    }
});

// Check admin authentication
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!isLoggedIn || !currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return false;
    }
    
    // For now, allow all authenticated users to access admin
    // In a real system, you'd check for admin role
    return true;
}

// Initialize only if authenticated
if (checkAdminAuth()) {
    const adminSystem = new AdminSystem();
} 