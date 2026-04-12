import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We should probably use the service_role key to bypass RLS if it's available, 
// but NEXT_PUBLIC_SUPABASE_ANON_KEY might be the only one we have.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Fetching one property...");
  const { data, error } = await supabase.from('properties').select('id, image, images');
  if (error) {
    console.error("Fetch error:", error);
    return;
  }
  console.log("Current state in DB:", JSON.stringify(data, null, 2));

  // Let's attempt to update this single row and see if it returns data
  if (data && data.length > 0) {
    console.log("Attempting test update...");
    const { data: updatedData, error: updateError } = await supabase
      .from('properties')
      .update({ images: ['test'] })
      .eq('id', data[0].id)
      .select(); // .select() forces it to return the updated rows
      
    if (updateError) {
      console.error("Update error:", updateError);
    } else {
      console.log("Update result:", JSON.stringify(updatedData, null, 2));
      if (updatedData.length === 0) {
        console.log("WARNING: 0 rows updated! This indicates Row Level Security (RLS) is blocking the update using the anon key.");
      }
    }
  }
}

check();
