import { NextRequest } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  type: 'production' | 'development';
  limit_enabled: boolean;
  limit: number | null;
}

export interface ApiKeyUpdateData {
  name?: string;
  type?: 'production' | 'development';
  limit_enabled?: boolean;
  limit?: number | null;
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    const body = await request.json();
    const updates: ApiKeyUpdateData = {};

    if (body.name) updates.name = body.name;
    if (body.type) updates.type = body.type;
    if ('limit_enabled' in body) updates.limit_enabled = !!body.limit_enabled;
    if ('limit' in body) updates.limit = body.limit;

    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 