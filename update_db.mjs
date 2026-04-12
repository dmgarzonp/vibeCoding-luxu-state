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

const dummyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600607687931-cebf581897de?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600607688960-e09282b2fa15?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600607687940-4e52723659a9?auto=format&fit=crop&q=80&w=800'
];

function getRandomDummyImage() {
  return dummyImages[Math.floor(Math.random() * dummyImages.length)];
}

async function run() {
  console.log("Fetching properties from Supabase...");
  const { data: properties, error } = await supabase.from('properties').select('*');
  
  if (error) {
    console.error("Error fetching properties:", error);
    return;
  }
  
  if (!properties || properties.length === 0) {
    console.log("No properties found.");
    return;
  }
  
  console.log(`Found ${properties.length} properties. Updating images...`);

  for (const property of properties) {
    // Current images array or empty
    let images = property.images ? [...property.images] : [];
    
    // If empty but there is an image field, make it the first image
    if (images.length === 0 && property.image) {
      images.push(property.image);
    }
    
    // We need at least the original image + 3 additional images.
    // If we want each property to have "at least 3 images adicionales", 
    // we should ensure the array length is at least 4 (if the original was there)
    // Actually, let's just make sure it has at least 4 images total.
    const targetLength = Math.max(images.length + 3, 4);
    
    while (images.length < targetLength) {
      images.push(getRandomDummyImage());
    }
    
    console.log(`Updating property ${property.id}: setting ${images.length} images.`);
    
    const { error: updateError } = await supabase
      .from('properties')
      .update({ images })
      .eq('id', property.id);
      
    if (updateError) {
      console.error(`Failed to update ${property.id}:`, updateError);
    }
  }
  
  console.log("Migration completed.");
}

run();
