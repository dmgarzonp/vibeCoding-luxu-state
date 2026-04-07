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
  const mappedData: Property[] = data.map((item: any) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    price: item.price,
    type: item.type,
    beds: Number(item.beds),
    baths: Number(item.baths),
    sqm: item.sqm,
    image: item.image,
    isExclusive: item.is_exclusive,
    isNew: item.is_new,
    status: item.status,
  }));

  return { data: mappedData, count: count || 0 };
}
