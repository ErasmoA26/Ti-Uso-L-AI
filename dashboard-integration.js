// Integrazione gestione richieste nella dashboard admin esistente

// Inizializzazione quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza il manager delle richieste
    window.requestsManager = new RequestsManager();
    
    // Inizializza la tabella delle richieste
    window.requestsTable = new RequestsTable('requests-container', window.requestsManager);
    
    // Aggiungi il badge per le richieste non lette nell'header
    addRequestsBadge();
    
    // Carica le richieste iniziali
    loadInitialRequests();
});

// Aggiungi badge richieste nell'header
function addRequestsBadge() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        const badge = document.createElement('div');
        badge.id = 'requests-badge';
        badge.className = 'requests-badge';
        badge.textContent = '0';
        badge.style.display = 'none';
        
        // Inserisci il badge prima del pulsante refresh
        const refreshBtn = headerActions.querySelector('.btn-refresh');
        if (refreshBtn) {
            headerActions.insertBefore(badge, refreshBtn);
        } else {
            headerActions.appendChild(badge);
        }
    }
}

// Carica le richieste iniziali
async function loadInitialRequests() {
    if (window.requestsManager) {
        await window.requestsManager.fetchRequests();
        updateDashboardStats();
    }
}

// Aggiorna le statistiche della dashboard
function updateDashboardStats() {
    if (!window.requestsManager) return;
    
    const requests = window.requestsManager.requests;
    
    // Conta le richieste per status
    const stats = {
        total: requests.length,
        new: requests.filter(r => r.status === 'new').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        read: requests.filter(r => r.status === 'read').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    };
    
    // Aggiorna i contatori nella dashboard
    const totalElement = document.getElementById('totalRequests');
    const newElement = document.getElementById('newRequests');
    const workingElement = document.getElementById('workingRequests');
    const completedElement = document.getElementById('completedRequests');
    
    if (totalElement) totalElement.textContent = stats.total;
    if (newElement) newElement.textContent = stats.new;
    if (workingElement) workingElement.textContent = stats.in_progress;
    if (completedElement) completedElement.textContent = stats.completed;
    
    // Aggiorna il badge
    if (window.requestsManager) {
        window.requestsManager.updateUnreadCount();
    }
}

// Funzione per aggiornare le richieste (chiamata dal pulsante refresh)
async function loadRequests() {
    if (window.requestsManager) {
        await window.requestsManager.fetchRequests();
        updateDashboardStats();
        
        // Mostra notifica di aggiornamento
        showNotification('Richieste aggiornate', 'success');
    }
}

// Funzione per mostrare notifiche
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Integrazione con il sistema esistente
function integrateWithExistingSystem() {
    // Sostituisci la tabella esistente con il nuovo componente
    const existingTable = document.querySelector('.table-container');
    if (existingTable) {
        // Crea il container per le richieste
        const requestsContainer = document.createElement('div');
        requestsContainer.id = 'requests-container';
        requestsContainer.className = 'requests-integration';
        
        // Sostituisci la tabella esistente
        existingTable.parentNode.replaceChild(requestsContainer, existingTable);
        
        // Inizializza la nuova tabella
        if (window.RequestsTable) {
            window.requestsTable = new RequestsTable('requests-container', window.requestsManager);
        }
    }
}

// CSS per l'integrazione
const integrationStyles = `
<style>
.requests-badge {
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    margin-right: 10px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.requests-integration {
    margin-top: 2rem;
}

/* Stili per le notifiche */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    color: white;
    z-index: 1001;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

/* Miglioramenti per la dashboard esistente */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 20px rgba(102,126,234,0.3);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-card.new {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.stat-card.working {
    background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
}

.stat-card.completed {
    background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
}

.stat-icon {
    font-size: 2rem;
    opacity: 0.8;
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
}

.stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .stat-card {
        padding: 1rem;
    }
    
    .stat-number {
        font-size: 1.5rem;
    }
}
</style>
`;

// Inserisci gli stili di integrazione
document.head.insertAdjacentHTML('beforeend', integrationStyles);

// Esporta funzioni per uso globale
window.loadRequests = loadRequests;
window.updateDashboardStats = updateDashboardStats;
window.showNotification = showNotification;
window.integrateWithExistingSystem = integrateWithExistingSystem; 