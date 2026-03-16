// Navbar.jsx — server component, fetches data, passes to client
import { supabase } from '@/app/lib/supabase';
import NavbarClient from './navbarclient';

function normalizeNavData(rows) {
  return (rows || [])
    .filter(r => r?.slug)
    .map(r => ({
      ...r,
      states: (r.states || [])
        .filter(s => s?.slug)
        .map(s => ({
          ...s,
          places: (s.places || [])
            .filter(p => p?.slug)
            .sort((a, b) => (a.title || '').localeCompare(b.title || '')),
        }))
        .sort((a, b) => (a.title || '').localeCompare(b.title || '')),
    }))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));
}

export default async function Navbar() {
  const { data, error } = await supabase
    .from('regions')
    .select('id,title,slug,states(id,title,slug,places(id,title,slug))');

  const regions = error ? [] : normalizeNavData(data);
  return <NavbarClient regions={regions} />;
}
