// API route per gestire le richieste di contatto
// POST /api/contact

import { createClient } from '@supabase/supabase-js';

// Inizializza Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // Solo metodo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo non consentito' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validazione dei dati
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Tutti i campi sono obbligatori' 
            });
        }

        // Validazione email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Indirizzo email non valido' 
            });
        }

        // Validazione lunghezza
        if (name.length < 2) {
            return res.status(400).json({ 
                error: 'Il nome deve essere di almeno 2 caratteri' 
            });
        }

        if (subject.length < 5) {
            return res.status(400).json({ 
                error: 'L\'oggetto deve essere di almeno 5 caratteri' 
            });
        }

        if (message.length < 10) {
            return res.status(400).json({ 
                error: 'Il messaggio deve essere di almeno 10 caratteri' 
            });
        }

        // Inserisci la richiesta nel database
        const { data, error } = await supabase
            .from('requests')
            .insert([
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    subject: subject.trim(),
                    message: message.trim(),
                    status: 'new'
                }
            ])
            .select();

        if (error) {
            console.error('Errore Supabase:', error);
            return res.status(500).json({ 
                error: 'Errore nel salvataggio della richiesta' 
            });
        }

        // Log della richiesta per debugging
        console.log('Nuova richiesta ricevuta:', {
            id: data[0].id,
            name,
            email,
            subject,
            timestamp: new Date().toISOString()
        });

        // Invia email di notifica all'admin (opzionale)
        try {
            await sendAdminNotification({
                name,
                email,
                subject,
                message,
                requestId: data[0].id
            });
        } catch (emailError) {
            console.error('Errore invio email:', emailError);
            // Non blocchiamo la risposta per errori email
        }

        return res.status(200).json({ 
            success: true,
            message: 'Richiesta inviata con successo',
            requestId: data[0].id
        });

    } catch (error) {
        console.error('Errore API contact:', error);
        return res.status(500).json({ 
            error: 'Errore interno del server' 
        });
    }
}

// Funzione per inviare notifica email all'admin
async function sendAdminNotification(requestData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ti-uso-l-ai.com';
    
    const emailContent = `
        <h2>Nuova Richiesta Ricevuta</h2>
        <p><strong>ID Richiesta:</strong> ${requestData.requestId}</p>
        <p><strong>Nome:</strong> ${requestData.name}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Oggetto:</strong> ${requestData.subject}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${requestData.message}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
        <br>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Vai alla Dashboard Admin</a></p>
    `;

    // Usa il tuo sistema di invio email esistente
    // Questo è un esempio, adatta al tuo sistema
    const emailData = {
        to: adminEmail,
        subject: `Nuova richiesta: ${requestData.subject}`,
        html: emailContent
    };

    // Se hai già un sistema di invio email, usa quello
    // Altrimenti puoi implementare qui la logica di invio
    console.log('Email di notifica:', emailData);
    
    // Per ora logghiamo solo, implementa l'invio email se necessario
    return Promise.resolve();
} 