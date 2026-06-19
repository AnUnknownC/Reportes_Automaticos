import { supabase } from '../config/supabase.js';

interface ClientInput {
  name: string;
  email: string;
  website?: string;
}

export async function createClient(agencyId: string, data: ClientInput) {
  const { data: client, error } = await supabase
    .from('clients')
    .insert({ ...data, agency_id: agencyId, status: 'active' })
    .select('id, name, email, website, status, created_at')
    .single();
  if (error) throw error;
  return client;
}

export async function listClients(agencyId: string, status: string = 'active') {
  const query = supabase
    .from('clients')
    .select('id, name, email, website, status, created_at')
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: false });

  if (status !== 'all') query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateClient(agencyId: string, clientId: string, data: Partial<ClientInput>) {
  const { data: client, error } = await supabase
    .from('clients')
    .update(data)
    .eq('id', clientId)
    .eq('agency_id', agencyId)
    .select('id, name, email, website, status')
    .single();
  if (error) throw error;
  if (!client) throw new Error('CLIENT_NOT_FOUND');
  return client;
}

export async function archiveClient(agencyId: string, clientId: string) {
  return updateClient(agencyId, clientId, { status: 'archived' } as Partial<ClientInput>);
}