import { supabase } from '../supabase';
import { Property } from '../../app/data/properties';

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
      image: item.image,
      images: item.images || [item.image],
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
    image: data.image,
    images: data.images || [data.image],
    slug: data.slug || slug,
    isExclusive: data.is_exclusive,
    isNew: data.is_new,
    isFeatured: data.is_featured,
    status: data.status,
  };

  return { data: mappedData, error: null };
}
