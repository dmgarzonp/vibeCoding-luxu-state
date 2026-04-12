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

const cities = ["Madrid", "Barcelona", "Marbella", "Ibiza", "Mallorca", "Valencia"];
const types = ["House", "Apartment", "Villa", "Penthouse"];
const statuses = ["FOR SALE", "FOR RENT"];

const imagesPool = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600607687931-cebf581897de?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600607688960-e09282b2fa15?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItems(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function run() {
  console.log("Inserting 20 test properties into Supabase...");
  const properties = [];

  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const priceInt = getRandomInt(2, 50) * 100000; // Between 200,000 and 5,000,000
    const priceStr = "$" + priceInt.toLocaleString();
    const isNew = Math.random() > 0.5;
    const isFeatured = Math.random() > 0.8;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const idNum = Date.now() + i;

    properties.push({
      title: `Moderna ${type} en ${city}`,
      location: `${city}, España`,
      price: priceStr,
      type: type,
      beds: getRandomInt(1, 5),
      baths: getRandomInt(1, 4),
      sqm: getRandomInt(50, 500),
      images: getRandomItems(imagesPool, getRandomInt(3, 5)), // Minimo 3 imagenes
      slug: `moderna-${type.toLowerCase()}-${city.toLowerCase()}-${idNum}`,
      status: status,
      is_new: isNew,
      is_featured: isFeatured
    });
  }

  const { data, error } = await supabase
    .from('properties')
    .insert(properties)
    .select();

  if (error) {
    console.error("Error inserting properties:", error);
  } else {
    console.log(`Successfully inserted ${data.length} properties!`);
  }
}

run();
