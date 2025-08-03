// API route per la dashboard admin - gestione richieste
// GET /api/admin/requests - Lista richieste
// PATCH /api/admin/requests/[id] - Aggiorna status

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // Verifica autenticazione admin (implementa la tua logica)
    // const isAdmin = await verifyAdminAuth(req);
    // if (!isAdmin) {
    //     return res.status(401).json({ error: 'Non autorizzato' });
    // }

    switch (req.method) {
        case 'GET':
            return await getRequests(req, res);
        case 'PATCH':
            return await updateRequest(req, res);
        default:
            return res.status(405).json({ error: 'Metodo non consentito' });
    }
}

async function getRequests(req, res) {
    try {
        const { status, limit = 100, offset = 0 } = req.query;

        let query = supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        if (offset) {
            query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Errore Supabase:', error);
            return res.status(500).json({ error: 'Errore nel caricamento delle richieste' });
        }

        return res.status(200).json({ 
            requests: data || [],
            total: data?.length || 0
        });

    } catch (error) {
        console.error('Errore API getRequests:', error);
        return res.status(500).json({ error: 'Errore interno del server' });
    }
}

async function updateRequest(req, res) {
    try {
        const { id } = req.query;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID richiesta mancante' });
        }

        if (!status) {
            return res.status(400).json({ error: 'Status mancante' });
        }

        // Validazione status
        const validStatuses = ['new', 'read', 'in_progress', 'completed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Status non valido' });
        }

        const { data, error } = await supabase
            .from('requests')
            .update({ 
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Errore Supabase update:', error);
            return res.status(500).json({ error: 'Errore nell\'aggiornamento della richiesta' });
        }

        return res.status(200).json({ 
            success: true,
            request: data[0]
        });

    } catch (error) {
        console.error('Errore API updateRequest:', error);
        return res.status(500).json({ error: 'Errore interno del server' });
    }
} 