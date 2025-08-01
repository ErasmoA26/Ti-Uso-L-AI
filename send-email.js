// API per invio email di risposta
// Questo è un esempio di come integrare un servizio email reale

class EmailService {
    constructor() {
        // Configurazione per servizi email (da personalizzare)
        this.config = {
            // Per EmailJS
            serviceId: 'service_a6o1ai9',
            templateId: 'template_reply',
            userId: 'YOUR_USER_ID',
            
            // Per altri servizi (es. SendGrid, Mailgun, etc.)
            apiKey: 'YOUR_API_KEY',
            fromEmail: 'admin@tuosito.com',
            fromName: 'Admin Dashboard'
        };
    }

    // Metodo principale per inviare email di risposta
    async sendReplyEmail(messageData, replyMessage) {
        try {
            // Per ora simuliamo l'invio
            // In produzione, sostituire con chiamata API reale
            return await this.simulateEmailSend(messageData, replyMessage);
            
            // Esempio per EmailJS:
            // return await this.sendWithEmailJS(messageData, replyMessage);
            
            // Esempio per SendGrid:
            // return await this.sendWithSendGrid(messageData, replyMessage);
            
        } catch (error) {
            console.error('Errore invio email:', error);
            throw new Error('Impossibile inviare l\'email di risposta');
        }
    }

    // Simulazione invio email (per sviluppo)
    async simulateEmailSend(messageData, replyMessage) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simula successo 90% delle volte
                if (Math.random() > 0.1) {
                    console.log('Email inviata con successo:', {
                        to: messageData.email,
                        from: this.config.fromEmail,
                        subject: `Risposta alla tua richiesta - ${messageData.nome}`,
                        message: replyMessage,
                        originalMessage: messageData.messaggio,
                        timestamp: new Date().toISOString()
                    });
                    resolve({ success: true, messageId: Date.now() });
                } else {
                    reject(new Error('Errore simulato nell\'invio email'));
                }
            }, 2000); // Simula delay di rete
        });
    }

    // Metodo per EmailJS
    async sendWithEmailJS(messageData, replyMessage) {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS non caricato');
        }

        const templateParams = {
            to_email: messageData.email,
            to_name: messageData.nome,
            reply_message: replyMessage,
            original_message: messageData.messaggio,
            admin_email: this.config.fromEmail,
            admin_name: this.config.fromName
        };

        return emailjs.send(
            this.config.serviceId,
            this.config.templateId,
            templateParams,
            this.config.userId
        );
    }

    // Metodo per SendGrid
    async sendWithSendGrid(messageData, replyMessage) {
        const emailData = {
            personalizations: [{
                to: [{ email: messageData.email, name: messageData.nome }]
            }],
            from: { email: this.config.fromEmail, name: this.config.fromName },
            subject: `Risposta alla tua richiesta - ${messageData.nome}`,
            content: [{
                type: 'text/html',
                value: this.createEmailHTML(messageData, replyMessage)
            }]
        };

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error(`Errore SendGrid: ${response.status}`);
        }

        return { success: true };
    }

    // Crea HTML per email
    createEmailHTML(messageData, replyMessage) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Risposta alla tua richiesta</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #00ff88;">Risposta alla tua richiesta</h2>
                    
                    <p>Ciao ${messageData.nome},</p>
                    
                    <p>Grazie per averci contattato. Ecco la nostra risposta alla tua richiesta:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00ff88; margin: 20px 0;">
                        <p style="margin: 0; font-style: italic;">"${replyMessage}"</p>
                    </div>
                    
                    <h3>Dettagli della tua richiesta originale:</h3>
                    <ul>
                        <li><strong>Data:</strong> ${new Date(messageData.data_invio).toLocaleDateString('it-IT')}</li>
                        <li><strong>Telefono:</strong> ${messageData.telefono}</li>
                    </ul>
                    
                    <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h4>La tua richiesta originale:</h4>
                        <p>"${messageData.messaggio}"</p>
                    </div>
                    
                    <p>Se hai ulteriori domande, non esitare a contattarci di nuovo.</p>
                    
                    <p>Cordiali saluti,<br>
                    <strong>Il Team di TI USO L'AI</strong></p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">
                        Questo messaggio è stato inviato in risposta alla tua richiesta del ${new Date(messageData.data_invio).toLocaleDateString('it-IT')}.
                    </p>
                </div>
            </body>
            </html>
        `;
    }

    // Metodo per Mailgun
    async sendWithMailgun(messageData, replyMessage) {
        const formData = new FormData();
        formData.append('from', `${this.config.fromName} <${this.config.fromEmail}>`);
        formData.append('to', messageData.email);
        formData.append('subject', `Risposta alla tua richiesta - ${messageData.nome}`);
        formData.append('html', this.createEmailHTML(messageData, replyMessage));

        const response = await fetch(`https://api.mailgun.net/v3/YOUR_DOMAIN/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('api:' + this.config.apiKey)
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Errore Mailgun: ${response.status}`);
        }

        return { success: true };
    }
}

// Esporta per uso globale
window.EmailService = EmailService; 