# Ti Uso L'AI - Sito Web Cyberpunk

Un sito web moderno e futuristico per servizi di Intelligenza Artificiale, con design cyberpunk e chatbot intelligente integrato con Google Gemini AI.

## 🚀 Funzionalità

### Design Cyberpunk
- **Animazioni fluide** e effetti futuristici
- **Cursor personalizzato** con trailing effect
- **Particelle animate** di sfondo
- **Hologram 3D** centrale con animazioni
- **Modali interattivi** per le sezioni

### Chatbot Intelligente
- **Integrazione Google Gemini AI** per risposte dinamiche
- **Indicatore "sta scrivendo..."** durante le chiamate API
- **Gestione errori** e fallback
- **Memoria conversazione** (context)
- **Limite messaggi** per sessione

## 🔧 Configurazione Chatbot Gemini

### 1. Ottieni API Key Google Gemini
1. Vai su [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuovo progetto o seleziona uno esistente
3. Genera una nuova API key
4. Copia l'API key generata

### 2. Configura l'API Key
1. Apri il file `script.js`
2. Trova la riga: `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';`
3. Sostituisci `YOUR_GEMINI_API_KEY_HERE` con la tua API key
4. Salva il file

### 3. Testa il Chatbot
1. Apri `index.html` nel browser
2. Clicca sull'icona del chatbot
3. Invia un messaggio per testare l'integrazione

## 📁 Struttura File

```
sito assurdo/
├── index.html          # Struttura HTML principale
├── styles.css          # Stili CSS cyberpunk
├── script.js           # JavaScript e logica chatbot
└── README.md           # Documentazione
```

## 🎨 Caratteristiche Design

### Navbar
- **Background scuro** con blur
- **LED verde animato** nella parte inferiore
- **Menu modali** per le sezioni
- **Bottoni neon** con effetti hover

### Hero Section
- **Hologram 3D** centrale con animazioni
- **Particelle orbitanti** intorno all'hologram
- **Testo con glow** e animazioni
- **Cards fluttuanti** con link AI

### Modali
- **Design glassmorphism** con backdrop blur
- **Animazioni fluide** di apertura/chiusura
- **Grid pattern** animato di sfondo
- **Scrollbar personalizzata** verde

### Chatbot
- **Design futuristico** coerente con il sito
- **Integrazione Gemini AI** per risposte intelligenti
- **Indicatore di scrittura** durante le chiamate
- **Gestione errori** e fallback

## 🔌 API Configuration

### Google Gemini API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Model**: `gemini-pro`
- **Max Tokens**: 1024
- **Temperature**: 0.7
- **Safety Settings**: Configurati per contenuto sicuro

### Prompt System
```
Sei AIDA, consulente AI per servizi di Intelligenza Artificiale. 
Rispondi sempre in italiano, sii specifico e pratico nelle tue risposte. 
Aiuta gli utenti con domande su sviluppo web, AI, automazioni e progetti digitali.
```

## 🛠️ Personalizzazione

### Colori
- **Verde neon**: `#00ff88`
- **Ciano**: `#00ccff`
- **Sfondo scuro**: `rgba(0, 0, 0, 0.95)`

### Animazioni
- **Durata**: 0.3s - 0.6s
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Transform**: scale, translateY, rotate

### Responsive
- **Mobile**: 768px breakpoint
- **Tablet**: 1024px breakpoint
- **Desktop**: 1200px+ breakpoint

## 🚀 Deployment

1. **Configura API Key**: Inserisci la tua Gemini API key in `script.js`
2. **Testa localmente**: Apri `index.html` nel browser
3. **Deploy**: Carica i file su un web server
4. **HTTPS**: Assicurati che il dominio usi HTTPS per le chiamate API

## 📞 Supporto

Per problemi con:
- **API Gemini**: Controlla la documentazione ufficiale Google
- **Design**: Modifica i colori in `styles.css`
- **Funzionalità**: Controlla la console del browser per errori

## 🔒 Sicurezza

- **API Key**: Non condividere mai la tua API key
- **HTTPS**: Usa sempre HTTPS in produzione
- **Rate Limiting**: Rispetta i limiti di Google Gemini API
- **Safety Settings**: Configurati per contenuto appropriato

---

**Creato con ❤️ per servizi AI innovativi** 