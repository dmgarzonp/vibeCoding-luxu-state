import { supabase } from '../supabase';
import { Property } from '../../app/data/properties';

const dummyImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=600'
];

function resolveImages(item: any): string[] {
  let images = item.images ? [...item.images] : [];
  
  if (images.length === 0 && item.image) {
    images.push(item.image);
  } else if (images.length === 0 && !item.image) {
    images.push(dummyImages[0]);
  }
  
  while (images.length < 4) {
    images.push(dummyImages[(images.length - 1) % dummyImages.length]);
  }
  
  // Replace broken unsplash URLs that might come from the database
  return images.map(img => {
    if (img === 'https://images.unsplash.com/photo-1600607687931-cebf581897de?auto=format&fit=crop&q=80&w=600') {
      return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600';
    }
    if (img === 'https://images.unsplash.com/photo-1600607688960-e09282b2fa15?auto=format&fit=crop&q=80&w=600') {
      return 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=600';
    }
    return img;
  });
}

export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  featured?: boolean;
}

export async function getProperties({ 
  page = 1, 
  limit = 8, 
  featured 
}: GetPropertiesParams = {}) {
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  // Sort by created_at or is_new to show recent ones first
  query = query.order('created_at', { ascending: false });

  if (!featured) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return { data: [], count: 0 };
  }

  // Map snake_case to camelCase
  const mappedData: Property[] = data.map((item: any) => {
    // Generate slug from title if not present
    const defaultSlug = item.title 
      ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
      : item.id;

    return {
      id: item.id,
      title: item.title,
      location: item.location,
      price: item.price,
      type: item.type,
      beds: Number(item.beds),
      baths: Number(item.baths),
      sqm: item.sqm,
      images: resolveImages(item),
      slug: item.slug || defaultSlug,
      isExclusive: item.is_exclusive,
      isNew: item.is_new,
      isFeatured: item.is_featured,
      status: item.status,
    };
  });

  return { data: mappedData, count: count || 0 };
}

export async function getPropertyBySlug(slug: string) {
  // First we attempt to see if there is a 'slug' column in Supabase
  let { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    // Fallback: If slug column doesn't exist, we fetch all properties and find the matching slug manually
    const { data: allData } = await getProperties({ limit: 1000 }); // High limit to find it
    const mathingProperty = allData.find(p => p.slug === slug);
    if (!mathingProperty) return { data: null, error: 'Property not found' };
    return { data: mathingProperty, error: null };
  }

  // Map to matching Property type
  const mappedData: Property = {
    id: data.id,
    title: data.title,
    location: data.location,
    price: data.price,
    type: data.type,
    beds: Number(data.beds),
    baths: Number(data.baths),
    sqm: data.sqm,
    images: resolveImages(data),
    slug: data.slug || slug,
    isExclusive: data.is_exclusive,
    isNew: data.is_new,
    isFeatured: data.is_featured,
    status: data.status,
  };

  return { data: mappedData, error: null };
}
