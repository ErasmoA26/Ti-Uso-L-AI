# 🚀 Deploy su Vercel - TI USO L'AI

## 📋 Prerequisiti

1. **Account Vercel**: [vercel.com](https://vercel.com)
2. **Account Resend**: [resend.com](https://resend.com) (per email)
3. **Vercel CLI**: `npm i -g vercel`

## 🔧 Configurazione

### 1. **Variabili Ambiente Vercel**

Configura queste variabili nel dashboard Vercel:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=admin@tuosito.com
RESEND_FROM_NAME=Admin Dashboard

# Configurazione
NODE_ENV=production
EMAIL_SERVICE=RESEND
DEBUG=false
```

### 2. **Database Vercel Postgres**

1. Vai su [vercel.com/dashboard](https://vercel.com/dashboard)
2. Crea un nuovo progetto Postgres
3. Copia la `DATABASE_URL` nelle variabili ambiente

### 3. **Email Service Resend**

1. Vai su [resend.com](https://resend.com)
2. Crea account e ottieni API key
3. Configura dominio email
4. Aggiungi `RESEND_API_KEY` nelle variabili ambiente

## 🚀 Deploy

### **Opzione 1: Deploy Automatico (Raccomandato)**

1. **Connetti Repository GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deploy"
   git push origin main
   ```

2. **Deploy su Vercel**:
   - Vai su [vercel.com/new](https://vercel.com/new)
   - Importa il repository GitHub
   - Configura le variabili ambiente
   - Clicca "Deploy"

### **Opzione 2: Deploy Manuale**

```bash
# Installa dipendenze
npm install

# Login Vercel
vercel login

# Deploy
vercel --prod
```

## 📁 Struttura Progetto

```
ti-uso-l-ai/
├── index.html                 # Homepage
├── admin-dashboard.html       # Dashboard admin
├── admin-login.html          # Login admin
├── admin-message-detail.html # Dettaglio messaggio
├── api/                      # API endpoints
│   ├── crm.js               # CRM API
│   ├── send-email.js        # Email API
│   └── database.js          # Database functions
├── vercel.json              # Configurazione Vercel
├── package.json             # Dipendenze
├── next.config.js           # Configurazione Next.js
└── env.example              # Esempio variabili ambiente
```

## 🔗 URL Deploy

Dopo il deploy, il sito sarà disponibile su:
- **Homepage**: `https://your-project.vercel.app`
- **Admin**: `https://your-project.vercel.app/admin`
- **Login**: `https://your-project.vercel.app/admin-login`

## 🧪 Test Post-Deploy

### 1. **Test Homepage**
- ✅ Caricamento pagina principale
- ✅ Form di contatto funzionante
- ✅ Navigazione responsive

### 2. **Test Admin Dashboard**
- ✅ Login con credenziali admin
- ✅ Visualizzazione richieste
- ✅ Gestione note admin
- ✅ Invio email di risposta

### 3. **Test API**
```bash
# Test CRM API
curl https://your-project.vercel.app/api/crm

# Test Email API
curl -X POST https://your-project.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"messageData":{"nome":"Test","email":"test@example.com"},"replyMessage":"Test"}'
```

## 🔒 Sicurezza

### **Headers Configurati**:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`

### **Caching Ottimizzato**:
- ✅ **File statici**: Cache 1 anno
- ✅ **Admin pages**: No cache
- ✅ **API**: Cache dinamico

## 📊 Monitoraggio

### **Vercel Analytics**:
- ✅ Performance metrics
- ✅ Error tracking
- ✅ User analytics

### **Log Monitoring**:
- ✅ API error logs
- ✅ Email delivery logs
- ✅ Database query logs

## 🆘 Troubleshooting

### **Errori Comuni**:

1. **Database Connection Error**:
   - Verifica `DATABASE_URL` nelle variabili ambiente
   - Controlla che il database sia attivo

2. **Email Not Sending**:
   - Verifica `RESEND_API_KEY`
   - Controlla dominio email configurato

3. **Build Errors**:
   - Verifica Node.js version (>=18)
   - Controlla dipendenze nel `package.json`

### **Debug Commands**:
```bash
# Logs Vercel
vercel logs

# Test locale
vercel dev

# Deploy preview
vercel --prod
```

## 📈 Performance

### **Ottimizzazioni Implementate**:
- ✅ **Static file caching** (1 anno)
- ✅ **Image optimization**
- ✅ **Gzip compression**
- ✅ **CDN globale**
- ✅ **Edge functions** per API

### **Lighthouse Score Target**:
- ✅ **Performance**: 90+
- ✅ **Accessibility**: 95+
- ✅ **Best Practices**: 90+
- ✅ **SEO**: 90+

## 🔄 Aggiornamenti

### **Deploy Automatico**:
- ✅ Push su `main` branch = deploy automatico
- ✅ Preview deployments per PR
- ✅ Rollback automatico in caso di errori

### **Variabili Ambiente**:
- ✅ Modifiche immediate senza rebuild
- ✅ Versioning delle configurazioni
- ✅ Backup automatico

---

**🎯 Il progetto è ora pronto per il deploy su Vercel!**

Per iniziare: `vercel --prod` 