import { sql } from '@vercel/postgres';

// Inizializza tabella se non esiste
async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS crm_requests (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        messaggio TEXT NOT NULL,
        data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stato VARCHAR(50) DEFAULT 'Nuova',
        admin_notes TEXT,
        notes_updated_at TIMESTAMP
      );
    `;
    console.log('Database inizializzato con successo');
  } catch (error) {
    console.error('Errore inizializzazione database:', error);
    throw error;
  }
}

// Ottieni tutte le richieste
export async function getRequests() {
  try {
    const { rows } = await sql`
      SELECT * FROM crm_requests 
      ORDER BY data_invio DESC
    `;
    return rows;
  } catch (error) {
    console.error('Errore recupero richieste:', error);
    throw new Error('Impossibile recuperare le richieste');
  }
}

// Salva nuova richiesta
export async function saveRequest(request) {
  try {
    const { rows } = await sql`
      INSERT INTO crm_requests (nome, email, telefono, messaggio, stato)
      VALUES (${request.nome}, ${request.email}, ${request.telefono}, ${request.messaggio}, ${request.stato})
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Errore salvataggio richiesta:', error);
    throw new Error('Impossibile salvare la richiesta');
  }
}

// Aggiorna stato richiesta
export async function updateRequestStatus(id, newStatus) {
  try {
    const { rows } = await sql`
      UPDATE crm_requests 
      SET stato = ${newStatus}
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Errore aggiornamento stato:', error);
    throw new Error('Impossibile aggiornare lo stato');
  }
}

// Salva note admin
export async function saveAdminNotes(id, notes) {
  try {
    const { rows } = await sql`
      UPDATE crm_requests 
      SET admin_notes = ${notes}, notes_updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Errore salvataggio note:', error);
    throw new Error('Impossibile salvare le note');
  }
}

// Ottieni note admin
export async function getAdminNotes(id) {
  try {
    const { rows } = await sql`
      SELECT admin_notes, notes_updated_at 
      FROM crm_requests 
      WHERE id = ${id}
    `;
    return rows[0];
  } catch (error) {
    console.error('Errore recupero note:', error);
    throw new Error('Impossibile recuperare le note');
  }
}

// Statistiche dashboard
export async function getStats() {
  try {
    const { rows } = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN stato = 'Nuova' THEN 1 END) as nuove,
        COUNT(CASE WHEN stato = 'In Lavorazione' THEN 1 END) as in_lavorazione,
        COUNT(CASE WHEN stato = 'Completata' THEN 1 END) as completate
      FROM crm_requests
    `;
    return rows[0];
  } catch (error) {
    console.error('Errore recupero statistiche:', error);
    throw new Error('Impossibile recuperare le statistiche');
  }
}

// Inizializza database al primo deploy
if (process.env.NODE_ENV === 'production') {
  initDatabase().catch(console.error);
} 