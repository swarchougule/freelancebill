import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hmaqmfqfoxssepxhbcde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYXFtZnFmb3hzc2VweGhiY2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTk5MzEsImV4cCI6MjEwNDkzNTkzMX0.L2O8kDNhvpVtLv5d4etvYFbP94TH5jUaK6FI7ahkge4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
