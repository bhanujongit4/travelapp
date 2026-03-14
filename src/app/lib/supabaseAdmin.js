// lib/supabaseAdmin.js
// ── Service-role client — NEVER import in browser code ───────
// Used only in /app/api/** route handlers
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession:       false, // no cookie/localStorage — server only
      autoRefreshToken:     false, // service role doesn't need token refresh
      detectSessionFromUrl: false,
    },
  }
);