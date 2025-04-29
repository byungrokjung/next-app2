import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  type: 'production' | 'development';
  limit_enabled: boolean;
  limit: number | null;
}

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

/** PUT: API 키 정보 수정 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  const { name, type, limit_enabled, limitEnabled, limit } = await request.json();
  const updates: Partial<ApiKey> = {};
  if (name) updates.name = name;
  if (type) updates.type = type;
  updates.limit_enabled = !!(limit_enabled || limitEnabled);
  updates.limit = (limit_enabled || limitEnabled) ? limit : null;

  const { data, error } = await supabase
    .from('api_keys')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
} 