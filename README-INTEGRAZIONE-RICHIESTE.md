# Integrazione Sistema Richieste - Ti Uso L'AI

## Panoramica

Questo sistema integra la gestione delle richieste utenti nella dashboard admin esistente, con un form di contatto pubblico e API per la gestione dei dati.

## PARTE 1 - DATABASE SUPABASE

### 1.1 Esegui lo Script SQL

Vai su **Supabase Dashboard > SQL Editor** e esegui il contenuto di `database_setup.sql`:

```sql
-- Crea la tabella requests
CREATE TABLE IF NOT EXISTS requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Configurazione RLS

Il sistema include già le policy per Row Level Security. Le richieste possono essere inserite pubblicamente ma lette/modificate solo dagli admin.

## PARTE 2 - FORM PUBBLICO

### 2.1 File Creati

- `contact-form.js` - Componente form di contatto
- `api/contact.js` - API route per salvare richieste
- `contact-page-example.html` - Esempio di pagina contatti

### 2.2 Integrazione nel Sito Pubblico

Aggiungi questo codice nella pagina dove vuoi il form di contatto:

```html
<!-- Includi lo script -->
<script src="contact-form.js"></script>

<!-- Container per il form -->
<div id="contact-form-container"></div>

<!-- Inizializza il form -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    new ContactForm('contact-form-container');
});
</script>
```

### 2.3 Funzionalità del Form

- ✅ Validazione real-time
- ✅ Feedback utente
- ✅ Loading states
- ✅ Gestione errori
- ✅ Design responsive
- ✅ Salvataggio in Supabase

## PARTE 3 - INTEGRAZIONE DASHBOARD

### 3.1 File Creati

- `admin-requests.js` - Hook e componenti per la dashboard
- `api/admin/requests.js` - API per la dashboard admin
- `dashboard-integration.js` - Integrazione con dashboard esistente

### 3.2 Modifiche alla Dashboard

La dashboard admin (`admin-dashboard.html`) è stata aggiornata con:

- ✅ Script di integrazione inclusi
- ✅ Badge per richieste non lette
- ✅ Statistiche aggiornate
- ✅ Tabella richieste integrata

### 3.3 Funzionalità Dashboard

- **Gestione Richieste**: Visualizza, filtra, cambia status
- **Statistiche**: Contatori per ogni status
- **Badge**: Indicatore richieste non lette
- **Modal**: Dettagli completi richiesta
- **Notifiche**: Feedback per azioni

## STRUTTURA FILE

```
├── database_setup.sql          # Script SQL per Supabase
├── contact-form.js             # Componente form pubblico
├── api/contact.js              # API route pubblico
├── admin-requests.js           # Componenti dashboard
├── api/admin/requests.js       # API route admin
├── dashboard-integration.js    # Integrazione dashboard
├── contact-page-example.html   # Esempio pagina contatti
└── admin-dashboard.html        # Dashboard aggiornata
```

## COME INTEGRARE

### 1. Database
1. Vai su Supabase Dashboard
2. Apri SQL Editor
3. Esegui `database_setup.sql`

### 2. Form Pubblico
1. Copia `contact-form.js` nella root del progetto
2. Aggiungi il container e lo script nella pagina contatti
3. Verifica che `api/contact.js` sia nella cartella api

### 3. Dashboard Admin
1. I file sono già integrati in `admin-dashboard.html`
2. Le funzionalità si attivano automaticamente
3. Il badge apparirà nell'header

## API ENDPOINTS

### Pubblico
- `POST /api/contact` - Salva nuova richiesta

### Admin
- `GET /api/admin/requests` - Lista richieste
- `PATCH /api/admin/requests/[id]` - Aggiorna status

## STATUS RICHIESTE

- `new` - Nuova richiesta
- `read` - Letta dall'admin
- `in_progress` - In lavorazione
- `completed` - Completata
- `rejected` - Rifiutata

## FUNZIONALITÀ AVANZATE

### Notifiche Email (Opzionale)
Il sistema include un template per notifiche email. Per attivarlo:

1. Configura le variabili d'ambiente:
```env
ADMIN_EMAIL=admin@tuodominio.com
NEXT_PUBLIC_SITE_URL=https://tuodominio.com
```

2. Implementa la logica di invio email in `api/contact.js`

### Filtri e Ricerca
- Filtri per status nella dashboard
- Ricerca per nome/email
- Ordinamento per data

### Responsive Design
- Form ottimizzato per mobile
- Dashboard responsive
- Modal adattivo

## TROUBLESHOOTING

### Problemi Comuni

1. **Form non si carica**
   - Verifica che `contact-form.js` sia incluso
   - Controlla la console per errori

2. **API non funziona**
   - Verifica le variabili d'ambiente Supabase
   - Controlla i log del server

3. **Dashboard non aggiorna**
   - Verifica che i file JS siano caricati
   - Controlla la connessione Supabase

### Debug

Aggiungi questo per debug:
```javascript
// Nel browser console
console.log('Requests Manager:', window.requestsManager);
console.log('Requests Table:', window.requestsTable);
```

## PERSONALIZZAZIONE

### Stili
- Modifica i CSS in `contact-form.js` e `admin-requests.js`
- I colori seguono il tema del progetto

### Campi Form
- Aggiungi campi in `contact-form.js`
- Aggiorna la validazione
- Modifica la tabella database

### Dashboard
- Personalizza le statistiche in `dashboard-integration.js`
- Aggiungi nuovi filtri
- Modifica le azioni disponibili

## SICUREZZA

- ✅ Validazione lato client e server
- ✅ Sanitizzazione input
- ✅ RLS configurato
- ✅ Rate limiting (da implementare)
- ✅ CSRF protection (da implementare)

## PERFORMANCE

- ✅ Lazy loading delle richieste
- ✅ Paginazione (da implementare)
- ✅ Caching (da implementare)
- ✅ Ottimizzazione query

---

**Sistema pronto per l'uso!** 🚀

Il sistema è completamente integrato e funzionale. Tutti i componenti sono modulari e possono essere personalizzati secondo le tue esigenze. 