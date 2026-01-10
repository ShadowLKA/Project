const SUPABASE_URL = "https://heihssimnnilkowuxvfa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaWhzc2ltbm5pbGtvd3V4dmZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODQxNzYsImV4cCI6MjA3OTI2MDE3Nn0.JGsfnHNVhnOIwfF_aJ_nCfRSkq8MF-QuoIyKQfzA5SY";

let supabaseClient = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  if (!window.supabase?.createClient) {
    return null;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

export async function checkProfileExists(supabaseClient, email, phone) {
  if (!supabaseClient) {
    return { exists: false, error: null };
  }
  try {
    const { data, error } = await supabaseClient.rpc("check_profile_exists", {
      input_email: email,
      input_phone: phone
    });
    if (error) {
      return { exists: false, error };
    }
    return { exists: data?.exists === true, error: null };
  } catch (err) {
    return { exists: false, error: err };
  }
}
