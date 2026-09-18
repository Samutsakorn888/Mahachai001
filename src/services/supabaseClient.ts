import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwcanvzcnjudthruulul.supabase.co';
const supabaseKey = 'sb_publishable_c2PNad_RRkZut9m_K9HETg_brXqQKMn';

export const supabase = createClient(supabaseUrl, supabaseKey);
