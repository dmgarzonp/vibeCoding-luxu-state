import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local natively without dotenv
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Key is missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Inserting a test property into Supabase...");
  const newProperty = {
    title: 'Test Property ' + Date.now(),
    location: 'Test City, Country',
    price: '$500,000',
    type: 'Apartment',
    beds: 2,
    baths: 2,
    sqm: 100,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600607687931-cebf581897de?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600607688960-e09282b2fa15?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    ],
    slug: 'test-property-' + Date.now(),
    status: 'FOR SALE'
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([newProperty])
    .select();

  if (error) {
    console.error("Error inserting property:", error);
  } else {
    console.log("Successfully inserted property!");
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
