// Componente ContactForm per il sito pubblico
class ContactForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.form = null;
        this.init();
    }

    init() {
        this.createForm();
        this.attachEventListeners();
    }

    createForm() {
        this.form = document.createElement('form');
        this.form.className = 'contact-form';
        this.form.innerHTML = `
            <div class="form-group">
                <label for="name">Nome *</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="subject">Oggetto *</label>
                <input type="text" id="subject" name="subject" required>
            </div>
            
            <div class="form-group">
                <label for="message">Messaggio *</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="submit-btn">
                <span class="btn-text">Invia Richiesta</span>
                <span class="btn-loading" style="display: none;">
                    <svg class="spinner" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                    Invio in corso...
                </span>
            </button>
            
            <div class="form-message" style="display: none;"></div>
        `;
        
        this.container.appendChild(this.form);
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validazione real-time
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Rimuovi errori precedenti
        this.clearFieldError(field);
        
        // Validazioni specifiche
        if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Inserisci un indirizzo email valido');
            return false;
        }
        
        if (fieldName === 'name' && value && value.length < 2) {
            this.showFieldError(field, 'Il nome deve essere di almeno 2 caratteri');
            return false;
        }
        
        if (fieldName === 'subject' && value && value.length < 5) {
            this.showFieldError(field, 'L\'oggetto deve essere di almeno 5 caratteri');
            return false;
        }
        
        if (fieldName === 'message' && value && value.length < 10) {
            this.showFieldError(field, 'Il messaggio deve essere di almeno 10 caratteri');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showMessage(message, type = 'success') {
        const messageDiv = this.form.querySelector('.form-message');
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Nascondi dopo 5 secondi
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    setLoading(loading) {
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validazione completa
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showMessage('Correggi gli errori nel form', 'error');
            return;
        }
        
        // Raccogli dati
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showMessage('Richiesta inviata con successo! Ti risponderemo presto.', 'success');
                this.form.reset();
            } else {
                this.showMessage(result.error || 'Errore nell\'invio della richiesta', 'error');
            }
        } catch (error) {
            console.error('Errore:', error);
            this.showMessage('Errore di connessione. Riprova più tardi.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
}

// CSS per il form
const contactFormStyles = `
<style>
.contact-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.form-group input.error,
.form-group textarea.error {
    border-color: #dc3545;
}

.field-error {
    color: #dc3545;
    font-size: 14px;
    margin-top: 0.25rem;
}

.submit-btn {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102,126,234,0.3);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-loading {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spinner {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.form-message {
    margin-top: 1rem;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
}

.form-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.form-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
</style>
`;

// Inserisci gli stili nel documento
document.head.insertAdjacentHTML('beforeend', contactFormStyles);

// Esporta per uso globale
window.ContactForm = ContactForm; 