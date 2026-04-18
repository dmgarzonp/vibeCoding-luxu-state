'use server'

import { supabaseAdmin } from '../../../lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadPropertyFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from('properties')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) return { error: error.message };

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('properties')
      .getPublicUrl(filePath);

    return { publicUrl: publicUrlData.publicUrl };
  } catch (err: any) {
    return { error: err.message || 'Error occurred while uploading' };
  }
}

export async function saveProperty(propertyData: any) {
  try {
    // Map camelCase → snake_case for all known DB columns
    const payload: Record<string, any> = {
      title:       propertyData.title,
      location:    propertyData.location,
      price:       propertyData.price,
      type:        propertyData.type,
      status:      propertyData.status,
      beds:        propertyData.beds ?? 0,
      baths:       propertyData.baths ?? 0,
      sqm:         propertyData.sqm ? Number(propertyData.sqm) : 0,
      images:      propertyData.images ?? [],
      is_featured: propertyData.isFeatured ?? false,
      description: propertyData.description ?? null,
      year_built:  propertyData.year_built ?? null,
      parking:     propertyData.parking ?? null,
      amenities:   propertyData.amenities ?? [],
    };

    if (propertyData.id) {
      // update — include id for the .eq() filter but don't put it in the SET clause
      const { error } = await supabaseAdmin
        .from('properties')
        .update(payload)
        .eq('id', propertyData.id);

      if (error) {
        console.error('[saveProperty] update error:', error);
        return { error: error.message };
      }
    } else {
      // insert — generate slug from title
      payload.slug = (propertyData.title as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { error } = await supabaseAdmin
        .from('properties')
        .insert([payload]);

      if (error) {
        console.error('[saveProperty] insert error:', error);
        return { error: error.message };
      }
    }

    revalidatePath('/admin/properties');
    return { success: true };
  } catch (err: any) {
    console.error('[saveProperty] unexpected error:', err);
    return { error: err.message || 'Error saving property' };
  }
}

export async function getProperty(id: string | number) {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { error: error.message };
  return { data };
}
