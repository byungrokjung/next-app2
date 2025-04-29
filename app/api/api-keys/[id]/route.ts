import { NextResponse } from 'next/server';
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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const body = await req.json();
    const updates: ApiKeyUpdateData = {};

    if (body.name) updates.name = body.name;
    if (body.type) updates.type = body.type;
    if ('limit_enabled' in body) updates.limit_enabled = !!body.limit_enabled;
    if ('limit' in body) updates.limit = body.limit;

    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', params.id);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 