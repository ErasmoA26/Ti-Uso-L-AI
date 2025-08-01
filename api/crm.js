import { getRequests, saveRequest, updateRequestStatus, saveAdminNotes, getAdminNotes, getStats } from './database.js';

// Middleware per CORS e error handling
function corsHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

function errorHandler(res, error, message = 'Errore interno del server') {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? message : error.message,
    timestamp: new Date().toISOString()
  });
}

// GET /api/crm/requests - Ottieni tutte le richieste
export default async function handler(req, res) {
  if (corsHandler(req, res)) return;

  try {
    if (req.method === 'GET') {
      const requests = await getRequests();
      res.status(200).json({
        success: true,
        data: requests,
        count: requests.length
      });
    } else if (req.method === 'POST') {
      const { action, data } = req.body;

      switch (action) {
        case 'save_request':
          const newRequest = await saveRequest(data);
          res.status(201).json({
            success: true,
            data: newRequest,
            message: 'Richiesta salvata con successo'
          });
          break;

        case 'update_status':
          const updatedRequest = await updateRequestStatus(data.id, data.status);
          res.status(200).json({
            success: true,
            data: updatedRequest,
            message: 'Stato aggiornato con successo'
          });
          break;

        case 'save_notes':
          const notesResult = await saveAdminNotes(data.id, data.notes);
          res.status(200).json({
            success: true,
            data: notesResult,
            message: 'Note salvate con successo'
          });
          break;

        case 'get_notes':
          const notes = await getAdminNotes(data.id);
          res.status(200).json({
            success: true,
            data: notes
          });
          break;

        case 'get_stats':
          const stats = await getStats();
          res.status(200).json({
            success: true,
            data: stats
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Azione non valida'
          });
      }
    } else {
      res.status(405).json({
        success: false,
        error: 'Metodo non consentito'
      });
    }
  } catch (error) {
    errorHandler(res, error);
  }
} 