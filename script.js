// Funzioni per i modali - Semplificate
function openModal(modalId) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    // Nascondi tutti i modali
    const allModals = document.querySelectorAll('.modal-section');
    allModals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Mostra il modale specifico
    modal.style.display = 'block';
    
    // Attiva l'overlay
    overlay.classList.add('active');
    
    // Blocca lo scroll del body
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    
    // Rimuovi la classe active
    overlay.classList.remove('active');
    
    // Ripristina lo scroll del body
    document.body.style.overflow = '';
    
    // Nascondi tutti i modali dopo l'animazione
    setTimeout(() => {
        const allModals = document.querySelectorAll('.modal-section');
        allModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }, 400);
}

// Chiudi modale cliccando sull'overlay
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modalOverlay');
    if (e.target === overlay) {
        closeModal();
    }
});

// Chiudi modale con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Cursor personalizzato
const cursor = document.querySelector('.custom-cursor');
const cursorTrail = document.querySelector('.cursor-trail');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
    }, 100);
});

// Effetti hover per il cursore
document.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
    cursorTrail.style.transform = 'scale(1.2)';
});

document.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursorTrail.style.transform = 'scale(1)';
});

// Orb interattivi
const orbs = document.querySelectorAll('.orb');

orbs.forEach(orb => {
    orb.addEventListener('mouseenter', () => {
        orb.style.transform = 'scale(1.5)';
        orb.style.filter = 'brightness(1.5)';
    });
    
    orb.addEventListener('mouseleave', () => {
        orb.style.transform = 'scale(1)';
        orb.style.filter = 'brightness(1)';
    });
});

// Effetto parallax per le particelle
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Animazioni di entrata per gli elementi
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Osserva tutti gli elementi che devono animarsi
document.querySelectorAll('.workflow-card, .partner-card, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Effetti hover per i pulsanti
document.querySelectorAll('.btn-demo, .btn-get-started, .btn-submit').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
    });
});

// Effetti hover per le card
document.querySelectorAll('.workflow-card, .partner-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scrolling per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Chatbot pre-programmato
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messageCount = 0;
        this.maxMessages = 20;
        this.conversationHistory = [];
        this.initializeChatbot();
    }

    initializeChatbot() {
        const fab = document.querySelector('.fab');
        const chatWidget = document.getElementById('chatWidget');
        const closeBtn = document.querySelector('.close-chat');
        const sendBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');

        if (fab) {
            fab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleChat();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeChatWidget();
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        if (this.isOpen) {
            this.closeChatWidget();
        } else {
            this.openChatWidget();
        }
    }

    openChatWidget() {
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget) {
            chatWidget.style.display = 'block';
            setTimeout(() => {
                chatWidget.classList.add('active');
            }, 10);
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeChatWidget() {
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget) {
            chatWidget.classList.remove('active');
            setTimeout(() => {
                chatWidget.style.display = 'none';
            }, 400);
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message && this.messageCount < this.maxMessages) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            this.messageCount++;
            
            // Aggiungi messaggio utente alla cronologia
            this.conversationHistory.push({ role: 'user', parts: [{ text: message }] });
            
            // Mostra indicatore "sta scrivendo..."
            this.showTypingIndicator();
            
            try {
                const botResponse = await this.callGeminiAPI(message);
                this.hideTypingIndicator();
                this.addMessage(botResponse, 'bot');
                
                // Aggiungi risposta bot alla cronologia
                this.conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });
            } catch (error) {
                this.hideTypingIndicator();
                this.addMessage('Mi dispiace, c\'è stato un errore. Riprova tra un momento.', 'bot');
                console.error('Errore API Gemini:', error);
            }
        } else if (this.messageCount >= this.maxMessages) {
            this.addMessage('Hai raggiunto il limite di messaggi per questa sessione. Grazie per avermi contattato!', 'bot');
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        const content = sender === 'bot' ? `<span>${text}</span>` : `<span>${text}</span>`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="${icon}"></i>
                ${content}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <span>AIDA sta scrivendo...</span>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getPreProgrammedResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Saluti e Apertura
        if (message.includes('ciao') || message.includes('salve') || message.includes('buongiorno') || message.includes('buonasera')) {
            const greetings = [
                "Ciao! Sono qui per aiutarti con qualsiasi domanda sui nostri servizi AI. Cosa ti incuriosisce di più?",
                "Salve! Mi occupo di assistenza per progetti digitali e intelligenza artificiale. Come posso supportarti oggi?",
                "Buongiorno! Posso aiutarti a capire meglio come l'AI può trasformare il tuo business. Dimmi pure!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Domande sui Servizi - "Cosa fate?"
        if (message.includes('cosa fate') || message.includes('cosa fai') || message.includes('servizi') || message.includes('offrite')) {
            const serviceResponses = [
                "Ci specializziamo in soluzioni AI personalizzate: automazioni, chatbot intelligenti, analisi dati e sviluppo web con integrazione AI. Quale area ti interessa di più?",
                "Trasformiamo le idee in soluzioni digitali concrete utilizzando l'intelligenza artificiale. Siti web, automazioni, chatbot... tutto su misura. Hai già un progetto in mente?"
            ];
            return serviceResponses[Math.floor(Math.random() * serviceResponses.length)];
        }
        
        // Domande sui Costi - "Quanto costa?"
        if (message.includes('quanto costa') || message.includes('prezzo') || message.includes('costo') || message.includes('tariffe')) {
            const costResponses = [
                "I costi variano molto in base alla complessità del progetto. Per darti un'idea precisa, potresti dirmi che tipo di soluzione stai cercando? Così posso essere più specifico.",
                "Dipende dalle funzionalità che desideri. Un chatbot semplice ha costi diversi da un sistema di automazione complesso. Parlami del tuo progetto!"
            ];
            return costResponses[Math.floor(Math.random() * costResponses.length)];
        }
        
        // Domande Tecniche - "Come funziona l'AI?"
        if (message.includes('come funziona') || message.includes('funzionamento') || message.includes('tecnologia')) {
            const techResponses = [
                "In pratica, l'AI analizza grandi quantità di dati per trovare pattern e prendere decisioni. Nel tuo caso specifico, potrebbe automatizzare processi ripetitivi o migliorare l'esperienza clienti. Che tipo di attività vorresti ottimizzare?",
                "L'intelligenza artificiale impara dai dati per svolgere compiti che normalmente richiederebbero l'intervento umano. Per esempio, può gestire le richieste clienti 24/7 o analizzare feedback automaticamente. Ti serve qualcosa del genere?"
            ];
            return techResponses[Math.floor(Math.random() * techResponses.length)];
        }
        
        // Tempi di Realizzazione
        if (message.includes('tempi') || message.includes('quando') || message.includes('scadenza') || message.includes('durata')) {
            const timeResponses = [
                "Generalmente parliamo di 1-3 settimane per progetti standard, ma dipende dalla complessità. Hai scadenze particolari da rispettare?",
                "I tempi variano: un sito web semplice richiede 5-10 giorni, sistemi più complessi 2-4 settimane. Quando avresti bisogno che fosse pronto?"
            ];
            return timeResponses[Math.floor(Math.random() * timeResponses.length)];
        }
        
        // Gestione Obiezioni - "È troppo complicato"
        if (message.includes('complicato') || message.includes('difficile') || message.includes('non capisco')) {
            const objectionResponses = [
                "Capisco la preoccupazione! La bellezza dell'AI è che la complessità rimane dietro le quinte. Tu utilizzi un'interfaccia semplice, noi gestiamo tutta la parte tecnica. Vuoi che ti mostri alcuni esempi?",
                "Non ti preoccupare, è proprio per questo che ci siamo noi! Tu pensi al risultato che vuoi ottenere, noi ci occupiamo di tutta la parte tecnica. Qual è l'obiettivo che vorresti raggiungere?"
            ];
            return objectionResponses[Math.floor(Math.random() * objectionResponses.length)];
        }
        
        // Gestione Obiezioni - "Non sono sicuro che mi serva"
        if (message.includes('non sono sicuro') || message.includes('non so se') || message.includes('dubbi')) {
            return "È normale avere dubbi all'inizio. Molti nostri clienti erano nella tua stessa situazione. Potresti dirmi quali sono le sfide principali che affronti nel tuo lavoro quotidiano? Magari posso suggerirti se l'AI può aiutarti.";
        }
        
        // Chiusura e Call-to-Action
        if (message.includes('grazie') || message.includes('ok') || message.includes('perfetto')) {
            const closingResponses = [
                "Ti ho dato le informazioni che cercavi? Se vuoi approfondire, posso metterti in contatto con il nostro team per una consulenza gratuita.",
                "Perfetto! Se hai altre domande sono qui. Altrimenti, che ne dici di programmare una chiamata veloce per vedere come possiamo aiutarti concretamente?",
                "Spero di essere stato utile! Per iniziare il tuo progetto, puoi compilare il form nella sezione contatti o scrivermi qui se hai altre curiosità."
            ];
            return closingResponses[Math.floor(Math.random() * closingResponses.length)];
        }
        
        // Risposte Generiche Intelligenti per domande non coperte
        const genericResponses = [
            "Interessante domanda! Ogni situazione è unica, ma posso dirti che solitamente in casi simili al tuo abbiamo risolto con soluzioni personalizzate. Vuoi che approfondiamo il tuo caso specifico?",
            "Capisco perfettamente il tuo punto di vista. Molti clienti inizialmente hanno la stessa preoccupazione, poi si rendono conto dei vantaggi. Posso farti un esempio pratico?",
            "Ottima osservazione! È proprio questo tipo di dettagli che ci permettono di creare soluzioni su misura. Dimmi di più sul tuo contesto."
        ];
        
        return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    async callGeminiAPI(userMessage) {
        // Ora usa le risposte pre-programmate invece dell'API
        return this.getPreProgrammedResponse(userMessage);
    }
}

// Inizializza il chatbot
const chatbot = new Chatbot();

// Effetti di particelle dinamiche
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    const container = document.querySelector('.particles-container');
    if (container) {
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }
}

// Crea particelle periodicamente
setInterval(createParticle, 2000);

// Effetti di luce dinamici
function createLightEffect() {
    const light = document.createElement('div');
    light.style.position = 'fixed';
    light.style.width = '2px';
    light.style.height = '2px';
    light.style.background = '#00ff88';
    light.style.borderRadius = '50%';
    light.style.pointerEvents = 'none';
    light.style.zIndex = '1';
    light.style.left = Math.random() * 100 + '%';
    light.style.top = '100%';
    light.style.animation = 'float 4s linear';
    
    document.body.appendChild(light);
    
    setTimeout(() => {
        light.remove();
    }, 4000);
}

// Crea effetti di luce periodicamente
setInterval(createLightEffect, 3000);

// Effetti di interazione con il mouse
document.addEventListener('mousemove', (e) => {
    // Crea particelle al movimento del mouse
    if (Math.random() < 0.1) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#00ff88';
        particle.style.borderRadius = '50%';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.animation = 'particleFade 1s ease-out';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
});

// Aggiungi keyframe per l'animazione delle particelle
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    .typing-indicator {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-indicator span {
        width: 6px;
        height: 6px;
        background: #00ff88;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.3;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Effetti di scroll parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.orb, .particle');
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Effetti di interazione con i pulsanti
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'linear-gradient(135deg, #00ff88, #00ccff)';
        }
    });
    
    element.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'linear-gradient(135deg, #00ff88, #00ccff)';
        }
    });
});

// Effetti di caricamento della pagina
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Effetti di performance e ottimizzazione
let ticking = false;

function updateAnimations() {
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// Ottimizza le animazioni
window.addEventListener('scroll', requestTick);
window.addEventListener('resize', requestTick);

// Gestione form contatto finale
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Mostra loading
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Salva la richiesta
    const request = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Salva in localStorage
    const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    requests.push(request);
    localStorage.setItem('contactRequests', JSON.stringify(requests));
    
    // Simula invio (1 secondo)
    setTimeout(() => {
        // Nascondi form e mostra successo
        form.style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'flex';
        
        // Reset form
        form.reset();
        
        // Chiudi modal dopo 3 secondi
        setTimeout(() => {
            closeModal();
            // Ripristina form per prossimo uso
            form.style.display = 'block';
            document.getElementById('contactSuccess').style.display = 'none';
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }, 3000);
        
    }, 1000);
}

// Funzione per scorrere alla sezione di registrazione finale
function scrollToRegistration() {
    const contactSection = document.querySelector('.contact-final');
    if (contactSection) {
        // Aggiungi un effetto di feedback visivo al pulsante cliccato
        const clickedButton = event.target;
        if (clickedButton) {
            clickedButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickedButton.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Scorri alla sezione
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Aggiungi un leggero highlight alla sezione per attirare l'attenzione
        contactSection.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
        setTimeout(() => {
            contactSection.style.boxShadow = '';
        }, 2000);
    }
}

// Funzione per aprire il chat
function openChat() {
    if (chatbot) {
        chatbot.openChatWidget();
    }
}

// Gestione form di contatto finale
document.addEventListener('DOMContentLoaded', function() {
    const contactFormFinal = document.querySelector('.contact-form-final');
    
    if (contactFormFinal) {
        contactFormFinal.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Raccogli i dati del form
            const name = document.getElementById('final-name').value.trim();
            const email = document.getElementById('final-email').value.trim();
            const phonePrefix = document.getElementById('phone-prefix').value;
            const phone = document.getElementById('final-phone').value.trim();
            const fullPhone = phonePrefix + ' ' + phone;
            const message = document.getElementById('final-message').value.trim();
            
            // Validazione
            if (!name || !email || !phone || !message) {
                alert('Per favore compila tutti i campi');
                return;
            }
            
            // Validazione formato telefono
            if (phone.length < 8) {
                alert('Il numero di telefono deve essere di almeno 8 cifre');
                return;
            }
            
            // Crea oggetto richiesta
            const request = {
                id: Date.now(),
                nome: name,
                email: email,
                telefono: fullPhone,
                messaggio: message,
                data_invio: new Date().toISOString(),
                stato: 'Nuova'
            };
            
            // Salva nel database del CRM
            const requests = JSON.parse(localStorage.getItem('crm_requests') || '[]');
            requests.unshift(request); // Aggiungi in cima
            localStorage.setItem('crm_requests', JSON.stringify(requests));
            
            // Log per debug
            console.log('Richiesta salvata:', request);
            console.log('Totale richieste:', requests.length);
            
            // Mostra messaggio di successo
            alert('Richiesta inviata con successo! Ti contatteremo presto.');
            
            // Reset form
            contactFormFinal.reset();
            
            // Test: verifica che la richiesta sia stata salvata
            setTimeout(() => {
                const savedRequests = JSON.parse(localStorage.getItem('crm_requests') || '[]');
                console.log('Verifica salvataggio - Richieste totali:', savedRequests.length);
                console.log('Ultima richiesta salvata:', savedRequests[0]);
            }, 100);
        });
    }
});

// Event listener per CTRL+A per accedere all'admin (solo nelle pagine pubbliche)
document.addEventListener('keydown', function(e) {
    // Verifica se siamo in una pagina admin
    const isAdminPage = window.location.pathname.includes('admin') || 
                       window.location.pathname.includes('dashboard');
    
    // Se non siamo in una pagina admin e viene premuto CTRL+A
    if (!isAdminPage && e.ctrlKey && e.key === 'a') {
        e.preventDefault(); // Previeni la selezione di tutto il testo
        window.open('admin-login.html', '_blank');
    }
});

// Scroll to top al refresh della pagina
window.addEventListener('beforeunload', function() {
    // Salva un flag per indicare che la pagina è stata ricaricata
    sessionStorage.setItem('pageRefreshed', 'true');
});

// Scroll to top anche quando si naviga con i pulsanti del browser
window.addEventListener('pageshow', function(event) {
    // Se la pagina viene caricata dal cache del browser
    if (event.persisted) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Controlla se la pagina è stata ricaricata e scrolla in cima
document.addEventListener('DOMContentLoaded', function() {
    // Scrolla sempre in cima al caricamento della pagina
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    if (sessionStorage.getItem('pageRefreshed')) {
        // Rimuovi il flag
        sessionStorage.removeItem('pageRefreshed');
        
        // Reset di eventuali stati della pagina
        resetPageState();
    }
});

// Assicurati che la pagina parta sempre dall'inizio anche in nuove tab
window.addEventListener('load', function() {
    // Scrolla in cima anche dopo che tutto è caricato
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
});

// Funzione per resettare lo stato della pagina
function resetPageState() {
    // Chiudi eventuali modali aperti
    const overlay = document.getElementById('modalOverlay');
    if (overlay && overlay.classList.contains('active')) {
        closeModal();
    }
    
    // Chiudi eventuali chat aperti
    const chatWidget = document.querySelector('.chat-widget');
    if (chatWidget && chatWidget.classList.contains('active')) {
        if (chatbot) {
            chatbot.closeChatWidget();
        }
    }
    
    // Reset di eventuali animazioni
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
    });
    
    // Reset cursore personalizzato
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    if (cursor) cursor.style.transform = 'scale(1)';
    if (cursorTrail) cursorTrail.style.transform = 'scale(1)';
    
    console.log('✅ Pagina resettata al refresh');
}

 