/*
  Simplified Supabase client initializer.

  Usage:
    1) Copy `env.example.js` -> `env.js` and fill in your Supabase project values.
    2) Include the Supabase UMD script (from CDN) in your HTML.
    3) Include `env.js` and `supabase-client.js` before any scripts that use `supa`.
*/

window.SUPABASE_URL = 'https://jjjjtweowzhanzkidzaz.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqamp0d2Vvd3poYW56a2lkemF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDgzNDEsImV4cCI6MjA4NTk4NDM0MX0.YA531eivIrpg8N8jj9KTeP4f0zl_0ew42kxQqmEbAQg';
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.min.js';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase config is missing. Please add env.js with SUPABASE_URL and SUPABASE_ANON_KEY.');
}

function loadSupabaseScript() {
  if (window.supabase) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SUPABASE_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Supabase script from CDN')));
      return;
    }

    const s = document.createElement('script');
    s.src = SUPABASE_CDN;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Supabase script from CDN'));
    document.head.appendChild(s);
  });
}

async function ensureSupabase() {
  if (!window.supabase) {
    try {
      await loadSupabaseScript();
    } catch (err) {
      console.error(err);
      throw new Error('Could not load Supabase client script. Make sure you have internet access or host the Supabase script locally.');
    }
  }

  if (!window.supa && window.supabase && window.supabase.createClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    window.supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  if (!window.supa) {
    throw new Error('Supabase client not initialized. Ensure env.js is loaded and contains SUPABASE_URL/SUPABASE_ANON_KEY.');
  }

  return window.supa;
}

// Expose a common global for legacy usage in the app.
window.supa = window.supa || null;
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('pb_currentUser') || 'null');
  } catch {
    return null;
  }
}

async function createOrder(order) {
  const supa = ensureSupabase();
  const { data, error } = await supa.from('orders').insert([order]).select().single();
  if (error) throw error;
  return data;
}

async function fetchOrdersForUser(userId, { status, limit = 50 } = {}) {
  const supa = ensureSupabase();
  let query = supa.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function fetchStoreById(storeId) {
  if (!storeId) return null;
  const supa = ensureSupabase();
  const { data, error } = await supa.from('stores').select('*').eq('id', storeId).single();
  if (error) throw error;
  return data;
}

async function updateOrder(orderId, updates) {
  const supa = ensureSupabase();
  const { data, error } = await supa.from('orders').update(updates).eq('id', orderId).select().single();
  if (error) throw error;
  return data;
}

async function fetchPublishedStores() {
  const supa = ensureSupabase();
  const { data, error } = await supa.from('stores').select('*').eq('published', true);
  if (error) throw error;
  return data || [];
}

window.supabaseClient = {
  supa: window.supa,
  ensureSupabase,
  getCurrentUser,
  createOrder,
  fetchOrdersForUser,
  updateOrder,
  fetchPublishedStores
};
