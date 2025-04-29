import { NextResponse, NextRequest } from 'next/server';
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

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  if (!context.params.id) {
    return NextResponse.json(
      { error: 'Missing ID parameter' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const updates: ApiKeyUpdateData = {};

    if (body.name) updates.name = body.name;
    if (body.type) updates.type = body.type;
    if ('limit_enabled' in body) updates.limit_enabled = !!body.limit_enabled;
    if ('limit' in body) updates.limit = body.limit;

    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', context.params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  if (!context.params.id) {
    return NextResponse.json(
      { error: 'Missing ID parameter' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', context.params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 