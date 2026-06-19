import { z } from 'zod';
import * as ClientsService from '../services/clients.service.js';

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  website: z.string().url().optional(),
});
const updateSchema = clientSchema.partial();

export async function create(req, res) {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const client = await ClientsService.createClient(req.agency.agency_id, parsed.data);
    res.status(201).json(client);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function list(req, res) {
  const status = ['active', 'archived', 'all'].includes(req.query.status)
    ? req.query.status
    : 'active';

  try {
    const clients = await ClientsService.listClients(req.agency.agency_id, status);
    res.json(clients);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function update(req, res) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const client = await ClientsService.updateClient(
      req.agency.agency_id,
      req.params.id,
      parsed.data
    );
    res.json(client);
  } catch (err) {
    if (err.message === 'CLIENT_NOT_FOUND') return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function archive(req, res) {
  try {
    const client = await ClientsService.archiveClient(req.agency.agency_id, req.params.id);
    res.json(client);
  } catch (err) {
    if (err.message === 'CLIENT_NOT_FOUND') return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(500).json({ error: 'Error interno' });
  }
}