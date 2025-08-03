// API handler per richieste di contatto - versione compatibile con sistema statico
// Questo file gestisce le richieste POST per salvare i dati in Supabase

// Configurazione Supabase
const SUPABASE_URL = 'https://ilofwcpzxpcpgvdtpqyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2Z3Y3B6eHBjcGd2ZHRwcXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjUxMjgsImV4cCI6MjA2OTc0MTEyOH0.icBsqzDthL43AZ-ybtDXc-KhgWF-9DT2_rQVrXyReiM';

// Funzione per creare client Supabase
function createSupabaseClient() {
    return {
        from: (table) => ({
            insert: (data) => ({
                select: async () => {
                    try {
                        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                'Prefer': 'return=representation'
                            },
                            body: JSON.stringify(data)
                        });

                        if (!response.ok) {
                            const error = await response.text();
                            throw new Error(error);
                        }

                        const result = await response.json();
                        return { data: result, error: null };
                    } catch (error) {
                        return { data: null, error };
                    }
                }
            })
        })
    };
}

// Funzione per gestire le richieste di contatto
async function handleContactRequest(requestData) {
    try {
        const { name, email, subject, message } = requestData;

        // Validazione dei dati
        if (!name || !email || !subject || !message) {
            return { success: false, error: 'Tutti i campi sono obbligatori' };
        }

        // Validazione email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Indirizzo email non valido' };
        }

        // Validazione lunghezza
        if (name.length < 2) {
            return { success: false, error: 'Il nome deve essere di almeno 2 caratteri' };
        }

        if (subject.length < 5) {
            return { success: false, error: 'L\'oggetto deve essere di almeno 5 caratteri' };
        }

        if (message.length < 10) {
            return { success: false, error: 'Il messaggio deve essere di almeno 10 caratteri' };
        }

        // Crea client Supabase
        const supabase = createSupabaseClient();

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
            return { success: false, error: 'Errore nel salvataggio della richiesta' };
        }

        // Log della richiesta per debugging
        console.log('Nuova richiesta ricevuta:', {
            id: data[0].id,
            name,
            email,
            subject,
            timestamp: new Date().toISOString()
        });

        return { 
            success: true, 
            message: 'Richiesta inviata con successo',
            requestId: data[0].id
        };

    } catch (error) {
        console.error('Errore generale:', error);
        return { success: false, error: 'Errore interno del server' };
    }
}

// Funzione per ottenere le richieste (per la dashboard admin)
async function getRequests() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/requests?select=*&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nel caricamento delle richieste');
        }

        const data = await response.json();
        return { success: true, requests: data };
    } catch (error) {
        console.error('Errore nel caricamento richieste:', error);
        return { success: false, error: error.message };
    }
}

// Funzione per aggiornare lo status di una richiesta
async function updateRequestStatus(requestId, newStatus) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/requests?id=eq.${requestId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Errore nell\'aggiornamento della richiesta');
        }

        const data = await response.json();
        return { success: true, request: data[0] };
    } catch (error) {
        console.error('Errore nell\'aggiornamento:', error);
        return { success: false, error: error.message };
    }
}

// Esporta le funzioni per uso globale
window.handleContactRequest = handleContactRequest;
window.getRequests = getRequests;
window.updateRequestStatus = updateRequestStatus; 