const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const headers = { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` };

export async function getSharedImages(shareId: string): Promise<string[] | null> {
  const response = await fetch(`${supabaseUrl}/rest/v1/shares?id=eq.${encodeURIComponent(shareId)}&select=images`, { headers });
  if (!response.ok) throw new Error('读取分享记录失败');
  const rows = await response.json();
  return rows[0]?.images || null;
}

export async function uploadSharedPhoto(path: string, blob: Blob): Promise<string> {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/christmas-tree-photos/${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
    body: blob,
  });
  if (!response.ok) throw new Error('照片上传失败，请检查存储桶权限');
  return `${supabaseUrl}/storage/v1/object/public/christmas-tree-photos/${path}`;
}

export async function createShare(shareId: string, images: string[]): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/shares`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ id: shareId, images }),
  });
  if (!response.ok) throw new Error('分享记录保存失败，请检查数据表权限');
}
