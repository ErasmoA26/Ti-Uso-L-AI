import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template email HTML
function createEmailHTML(messageData, replyMessage) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Risposta alla tua richiesta</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00ff88, #00ccff); padding: 20px; border-radius: 10px 10px 0 0; }
        .header h1 { color: #000; margin: 0; font-size: 24px; }
        .content { background: #fff; padding: 30px; border-radius: 0 0 10px 10px; }
        .reply-box { background: #f0f8ff; border-left: 4px solid #00ff88; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .original-box { background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .highlight { color: #00ff88; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TI USO L'AI</h1>
        </div>
        <div class="content">
          <h2 style="color: #00ff88;">Risposta alla tua richiesta</h2>
          
          <p>Ciao <span class="highlight">${messageData.nome}</span>,</p>
          
          <p>Grazie per averci contattato. Ecco la nostra risposta alla tua richiesta:</p>
          
          <div class="reply-box">
            <p style="margin: 0; font-style: italic; color: #333;">"${replyMessage}"</p>
          </div>
          
          <h3>Dettagli della tua richiesta originale:</h3>
          <ul>
            <li><strong>Data:</strong> ${new Date(messageData.data_invio).toLocaleDateString('it-IT')}</li>
            <li><strong>Telefono:</strong> ${messageData.telefono}</li>
          </ul>
          
          <div class="original-box">
            <h4>La tua richiesta originale:</h4>
            <p>"${messageData.messaggio}"</p>
          </div>
          
          <p>Se hai ulteriori domande, non esitare a contattarci di nuovo.</p>
          
          <p>Cordiali saluti,<br>
          <strong>Il Team di TI USO L'AI</strong></p>
        </div>
        <div class="footer">
          <p>Questo messaggio è stato inviato in risposta alla tua richiesta del ${new Date(messageData.data_invio).toLocaleDateString('it-IT')}.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Middleware per CORS
function corsHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// Error handler
function errorHandler(res, error, message = 'Errore invio email') {
  console.error('Email Error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? message : error.message,
    timestamp: new Date().toISOString()
  });
}

// POST /api/send-email - Invia email di risposta
export default async function handler(req, res) {
  if (corsHandler(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Metodo non consentito'
    });
  }

  try {
    const { messageData, replyMessage } = req.body;

    // Validazione input
    if (!messageData || !replyMessage) {
      return res.status(400).json({
        success: false,
        error: 'Dati mancanti: messageData e replyMessage sono richiesti'
      });
    }

    if (!messageData.email || !messageData.nome) {
      return res.status(400).json({
        success: false,
        error: 'Email e nome del destinatario sono richiesti'
      });
    }

    // Verifica configurazione Resend
    if (!process.env.RESEND_API_KEY) {
      throw new Error('API key Resend non configurata');
    }

    // Invia email
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'Admin Dashboard'} <${process.env.RESEND_FROM_EMAIL || 'admin@tuosito.com'}>`,
      to: [messageData.email],
      subject: `Risposta alla tua richiesta - ${messageData.nome}`,
      html: createEmailHTML(messageData, replyMessage)
    });

    if (error) {
      throw new Error(`Errore Resend: ${error.message}`);
    }

    // Log successo (solo in produzione)
    if (process.env.NODE_ENV === 'production') {
      console.log('✅ Email inviata:', {
        to: messageData.email,
        messageId: data.id,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email inviata con successo',
      messageId: data.id
    });

  } catch (error) {
    errorHandler(res, error);
  }
} 