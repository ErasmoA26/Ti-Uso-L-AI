// Hook e componenti per la gestione delle richieste nella dashboard admin

// Hook per gestire le richieste
class RequestsManager {
    constructor() {
        this.supabase = null;
        this.requests = [];
        this.loading = false;
        this.error = null;
        this.unreadCount = 0;
        this.init();
    }

    async init() {
        // Inizializza Supabase se non è già fatto
        if (typeof window !== 'undefined' && window.supabase) {
            this.supabase = window.supabase;
        } else {
            // Fallback per inizializzazione
            console.warn('Supabase non inizializzato, usando fetch API');
        }
    }

    async fetchRequests() {
        this.loading = true;
        this.error = null;

        try {
            // Usa la funzione globale per ottenere le richieste
            const result = await window.getRequests();
            
            if (result.success) {
                this.requests = result.requests || [];
                this.updateUnreadCount();
            } else {
                throw new Error(result.error || 'Errore nel caricamento delle richieste');
            }
            
        } catch (error) {
            console.error('Errore nel caricamento delle richieste:', error);
            this.error = 'Errore nel caricamento delle richieste';
        } finally {
            this.loading = false;
        }
    }

    async updateRequestStatus(requestId, newStatus) {
        try {
            // Usa la funzione globale per aggiornare lo status
            const result = await window.updateRequestStatus(requestId, newStatus);
            
            if (result.success) {
                // Aggiorna la richiesta locale
                const requestIndex = this.requests.findIndex(r => r.id === requestId);
                if (requestIndex !== -1) {
                    this.requests[requestIndex].status = newStatus;
                    this.updateUnreadCount();
                }
                return true;
            } else {
                throw new Error(result.error || 'Errore nell\'aggiornamento');
            }
        } catch (error) {
            console.error('Errore nell\'aggiornamento dello status:', error);
            return false;
        }
    }

    updateUnreadCount() {
        this.unreadCount = this.requests.filter(r => r.status === 'new').length;
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.getElementById('requests-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }

    getRequestsByStatus(status) {
        return this.requests.filter(r => status === 'all' || r.status === status);
    }

    getRequestById(id) {
        return this.requests.find(r => r.id === id);
    }
}

// Componente tabella richieste
class RequestsTable {
    constructor(containerId, requestsManager) {
        this.container = document.getElementById(containerId);
        this.requestsManager = requestsManager;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.createTable();
        this.attachEventListeners();
        this.loadRequests();
    }

    createTable() {
        this.container.innerHTML = `
            <div class="requests-container">
                <div class="requests-header">
                    <h2>Gestione Richieste</h2>
                    <div class="requests-filters">
                        <button class="filter-btn active" data-filter="all">Tutte</button>
                        <button class="filter-btn" data-filter="new">Nuove</button>
                        <button class="filter-btn" data-filter="read">Lette</button>
                        <button class="filter-btn" data-filter="in_progress">In Lavorazione</button>
                        <button class="filter-btn" data-filter="completed">Completate</button>
                        <button class="filter-btn" data-filter="rejected">Rifiutate</button>
                    </div>
                </div>
                
                <div class="requests-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="total-requests">0</span>
                        <span class="stat-label">Totale</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="new-requests">0</span>
                        <span class="stat-label">Nuove</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="completed-requests">0</span>
                        <span class="stat-label">Completate</span>
                    </div>
                </div>
                
                <div class="requests-table-container">
                    <div class="loading-spinner" id="requests-loading" style="display: none;">
                        <div class="spinner"></div>
                        <p>Caricamento richieste...</p>
                    </div>
                    
                    <div class="error-message" id="requests-error" style="display: none;"></div>
                    
                    <table class="requests-table" id="requests-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Oggetto</th>
                                <th>Status</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody id="requests-tbody">
                            <!-- Le richieste verranno inserite qui -->
                        </tbody>
                    </table>
                    
                    <div class="no-requests" id="no-requests" style="display: none;">
                        <p>Nessuna richiesta trovata</p>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Filtri
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Aggiorna bottoni attivi
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderRequests();
    }

    async loadRequests() {
        await this.requestsManager.fetchRequests();
        this.renderRequests();
    }

    renderRequests() {
        const requests = this.requestsManager.getRequestsByStatus(this.currentFilter);
        const tbody = this.container.querySelector('#requests-tbody');
        const loading = this.container.querySelector('#requests-loading');
        const error = this.container.querySelector('#requests-error');
        const noRequests = this.container.querySelector('#no-requests');
        const table = this.container.querySelector('#requests-table');

        // Gestione stati
        if (this.requestsManager.loading) {
            loading.style.display = 'block';
            table.style.display = 'none';
            error.style.display = 'none';
            noRequests.style.display = 'none';
            return;
        }

        if (this.requestsManager.error) {
            loading.style.display = 'none';
            table.style.display = 'none';
            error.style.display = 'block';
            error.textContent = this.requestsManager.error;
            noRequests.style.display = 'none';
            return;
        }

        loading.style.display = 'none';
        error.style.display = 'none';

        if (requests.length === 0) {
            table.style.display = 'none';
            noRequests.style.display = 'block';
        } else {
            table.style.display = 'table';
            noRequests.style.display = 'none';
        }

        // Renderizza richieste
        tbody.innerHTML = requests.map(request => this.renderRequestRow(request)).join('');
        
        // Aggiorna statistiche
        this.updateStats();
    }

    renderRequestRow(request) {
        const date = new Date(request.created_at).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusClass = `status-${request.status}`;
        const statusText = this.getStatusText(request.status);

        return `
            <tr class="request-row ${request.status === 'new' ? 'unread' : ''}" data-id="${request.id}">
                <td class="request-date">${date}</td>
                <td class="request-name">${this.escapeHtml(request.name)}</td>
                <td class="request-email">${this.escapeHtml(request.email)}</td>
                <td class="request-subject">${this.escapeHtml(request.subject)}</td>
                <td class="request-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td class="request-actions">
                    <button class="btn-view" onclick="requestsTable.viewRequest('${request.id}')" title="Visualizza">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <div class="status-dropdown">
                        <button class="btn-status" onclick="requestsTable.toggleStatusDropdown('${request.id}')" title="Cambia Status">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${request.id}">
                            <button onclick="requestsTable.updateStatus('${request.id}', 'new')">Nuova</button>
                            <button onclick="requestsTable.updateStatus('${request.id}', 'read')">Letta</button>
                            <button onclick="requestsTable.updateStatus('${request.id}', 'in_progress')">In Lavorazione</button>
                            <button onclick="requestsTable.updateStatus('${request.id}', 'completed')">Completata</button>
                            <button onclick="requestsTable.updateStatus('${request.id}', 'rejected')">Rifiutata</button>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'new': 'Nuova',
            'read': 'Letta',
            'in_progress': 'In Lavorazione',
            'completed': 'Completata',
            'rejected': 'Rifiutata'
        };
        return statusMap[status] || status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const total = this.requestsManager.requests.length;
        const newCount = this.requestsManager.requests.filter(r => r.status === 'new').length;
        const completedCount = this.requestsManager.requests.filter(r => r.status === 'completed').length;

        this.container.querySelector('#total-requests').textContent = total;
        this.container.querySelector('#new-requests').textContent = newCount;
        this.container.querySelector('#completed-requests').textContent = completedCount;
    }

    async updateStatus(requestId, newStatus) {
        const success = await this.requestsManager.updateRequestStatus(requestId, newStatus);
        if (success) {
            this.renderRequests();
            this.showNotification('Status aggiornato con successo', 'success');
        } else {
            this.showNotification('Errore nell\'aggiornamento dello status', 'error');
        }
    }

    viewRequest(requestId) {
        const request = this.requestsManager.getRequestById(requestId);
        if (request) {
            this.showRequestModal(request);
        }
    }

    toggleStatusDropdown(requestId) {
        const dropdown = document.getElementById(`dropdown-${requestId}`);
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        
        // Chiudi tutti gli altri dropdown
        allDropdowns.forEach(d => {
            if (d.id !== `dropdown-${requestId}`) {
                d.classList.remove('show');
            }
        });
        
        dropdown.classList.toggle('show');
    }

    showRequestModal(request) {
        const modal = document.createElement('div');
        modal.className = 'request-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Dettagli Richiesta</h3>
                    <button class="modal-close" onclick="this.closest('.request-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="request-detail">
                        <label>ID:</label>
                        <span>${request.id}</span>
                    </div>
                    <div class="request-detail">
                        <label>Nome:</label>
                        <span>${this.escapeHtml(request.name)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Email:</label>
                        <span>${this.escapeHtml(request.email)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Oggetto:</label>
                        <span>${this.escapeHtml(request.subject)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Status:</label>
                        <span class="status-badge status-${request.status}">${this.getStatusText(request.status)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Data:</label>
                        <span>${new Date(request.created_at).toLocaleString('it-IT')}</span>
                    </div>
                    <div class="request-detail full-width">
                        <label>Messaggio:</label>
                        <div class="message-content">${this.escapeHtml(request.message)}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.request-modal').remove()">Chiudi</button>
                    <a href="mailto:${request.email}?subject=Re: ${request.subject}" class="btn-primary">Rispondi via Email</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Marca come letta se è nuova
        if (request.status === 'new') {
            this.updateStatus(request.id, 'read');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// CSS per i componenti
const requestsStyles = `
<style>
.requests-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

.requests-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.requests-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
}

.requests-filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e1e5e9;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.filter-btn:hover {
    background: #f8f9fa;
}

.filter-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.requests-stats {
    display: flex;
    gap: 2rem;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
}

.stat-label {
    font-size: 0.875rem;
    color: #6c757d;
}

.requests-table-container {
    position: relative;
    min-height: 200px;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #6c757d;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e1e5e9;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-message {
    padding: 2rem;
    text-align: center;
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    margin: 1rem;
}

.no-requests {
    padding: 2rem;
    text-align: center;
    color: #6c757d;
}

.requests-table {
    width: 100%;
    border-collapse: collapse;
}

.requests-table th,
.requests-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e1e5e9;
}

.requests-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
}

.request-row {
    transition: background-color 0.3s ease;
}

.request-row:hover {
    background: #f8f9fa;
}

.request-row.unread {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
}

.request-date {
    font-size: 0.875rem;
    color: #6c757d;
    white-space: nowrap;
}

.request-name {
    font-weight: 500;
}

.request-email {
    color: #007bff;
    font-size: 0.875rem;
}

.request-subject {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
}

.status-new {
    background: #fff3cd;
    color: #856404;
}

.status-read {
    background: #d1ecf1;
    color: #0c5460;
}

.status-in_progress {
    background: #d4edda;
    color: #155724;
}

.status-completed {
    background: #d1ecf1;
    color: #0c5460;
}

.status-rejected {
    background: #f8d7da;
    color: #721c24;
}

.request-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.btn-view,
.btn-status {
    padding: 0.5rem;
    border: none;
    background: #f8f9fa;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-view:hover,
.btn-status:hover {
    background: #e9ecef;
}

.status-dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 150px;
    display: none;
}

.dropdown-menu.show {
    display: block;
}

.dropdown-menu button {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.dropdown-menu button:hover {
    background: #f8f9fa;
}

/* Modal */
.request-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
}

.modal-body {
    padding: 1.5rem;
}

.request-detail {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
}

.request-detail.full-width {
    flex-direction: column;
}

.request-detail label {
    font-weight: 600;
    color: #495057;
    min-width: 80px;
}

.message-content {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    white-space: pre-wrap;
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e1e5e9;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

/* Notification */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    color: white;
    z-index: 1001;
    animation: slideIn 0.3s ease;
}

.notification.success {
    background: #28a745;
}

.notification.error {
    background: #dc3545;
}

.notification.info {
    background: #17a2b8;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .requests-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .requests-filters {
        justify-content: center;
    }
    
    .requests-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .requests-table {
        font-size: 0.875rem;
    }
    
    .requests-table th,
    .requests-table td {
        padding: 0.75rem 0.5rem;
    }
    
    .request-subject {
        max-width: 150px;
    }
}
</style>
`;

// Inserisci gli stili nel documento
document.head.insertAdjacentHTML('beforeend', requestsStyles);

// Esporta per uso globale
window.RequestsManager = RequestsManager;
window.RequestsTable = RequestsTable; 