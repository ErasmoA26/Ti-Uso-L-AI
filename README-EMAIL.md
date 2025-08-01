# 📧 Sistema Email Admin Dashboard

## 🚀 Configurazione Rapida

### 1. Installazione Dipendenze
```bash
npm install
```

### 2. Configurazione Email

#### OPZIONE A: Resend (RACCOMANDATO)
1. Vai su [resend.com](https://resend.com)
2. Crea un account gratuito
3. Ottieni la tua API key
4. Modifica `config.js`:
```javascript
RESEND: {
    API_KEY: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // La tua API key
    FROM_EMAIL: 'admin@tuosito.com',
    FROM_NAME: 'Admin Dashboard'
}
```

#### OPZIONE B: Gmail SMTP
1. Abilita "App meno sicure" in Gmail
2. Genera una password per app
3. Modifica `config.js`:
```javascript
GMAIL: {
    USER: 'tuoemail@gmail.com',
    PASS: 'password_app_gmail',
    FROM: 'tuoemail@gmail.com'
}
```

### 3. Avvio Server
```bash
npm start
```

Il server sarà disponibile su `http://localhost:3000`

## 📋 Funzionalità

### ✅ Invio Email di Risposta
- **Template HTML professionale** con stile TI USO L'AI
- **Gestione errori completa** con retry automatico
- **Log dettagliati** per debugging
- **Supporto multiplo servizi** (Resend/Gmail)

### ✅ Dashboard Admin
- **Visualizzazione messaggi** con dettagli completi
- **Form di risposta** integrato
- **Aggiornamento stato** automatico
- **Interfaccia responsive** e moderna

### ✅ API Endpoints
- `POST /api/send-reply` - Invia email di risposta
- `GET /api/email-status` - Verifica configurazione email

## 🔧 Configurazione Avanzata

### Variabili di Configurazione (`config.js`)

```javascript
const EMAIL_CONFIG = {
    RESEND: {
        API_KEY: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        FROM_EMAIL: 'admin@tuosito.com',
        FROM_NAME: 'Admin Dashboard'
    },
    GMAIL: {
        USER: 'tuoemail@gmail.com',
        PASS: 'password_app_gmail',
        FROM: 'tuoemail@gmail.com'
    },
    GENERAL: {
        SERVICE: 'RESEND', // 'RESEND' o 'GMAIL'
        DEBUG: true, // Abilita log dettagliati
        RETRY_ATTEMPTS: 3 // Tentativi in caso di errore
    }
};
```

### Template Email Personalizzato

Il template email include:
- **Header con logo** TI USO L'AI
- **Risposta evidenziata** in box verde
- **Dettagli richiesta originale**
- **Messaggio originale** in box grigio
- **Footer professionale**

## 🐛 Troubleshooting

### Errore "API key non valida"
1. Verifica che l'API key sia corretta
2. Controlla che il servizio sia attivo
3. Verifica i limiti del piano gratuito

### Errore "Gmail non configurato"
1. Abilita "App meno sicure" in Gmail
2. Genera password per app specifica
3. Verifica credenziali in `config.js`

### Email non arrivano
1. Controlla la cartella spam
2. Verifica log del server
3. Testa configurazione con `/api/email-status`

## 📊 Monitoraggio

### Log del Server
```bash
# Avvia con log dettagliati
DEBUG=true npm start
```

### Endpoint di Status
```bash
curl http://localhost:3000/api/email-status
```

## 🔒 Sicurezza

### Best Practices
- ✅ **API keys** mai committate nel codice
- ✅ **HTTPS** in produzione
- ✅ **Rate limiting** per prevenire spam
- ✅ **Validazione input** lato server

### Configurazione Produzione
1. Usa variabili ambiente
2. Abilita HTTPS
3. Configura firewall
4. Monitora log di accesso

## 📱 Test

### Test Invio Email
1. Accedi alla dashboard admin
2. Clicca su un messaggio
3. Scrivi una risposta
4. Clicca "Invia Risposta"
5. Verifica ricezione email

### Test Configurazione
```bash
# Verifica stato servizi
curl http://localhost:3000/api/email-status
```

## 🆘 Supporto

### Problemi Comuni
1. **Server non avvia**: Verifica Node.js >= 16
2. **Email non inviate**: Controlla configurazione API
3. **Errore CORS**: Verifica configurazione CORS
4. **Template non funziona**: Controlla HTML template

### Log Utili
```bash
# Log dettagliati
npm run dev

# Log errori
tail -f logs/error.log
```

## 📈 Metriche

### Monitoraggio Performance
- **Tempo di invio** email
- **Tasso di successo** invio
- **Errori per servizio**
- **Utilizzo API** (limiti)

### Dashboard Metrics
- **Messaggi totali** ricevuti
- **Risposte inviate** oggi
- **Stato messaggi** (Nuova/In Lavorazione/Completata)
- **Tempo medio** risposta

---

**🎯 Sistema pronto per produzione!** 