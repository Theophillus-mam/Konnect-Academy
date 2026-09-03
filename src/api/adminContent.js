import { supabaseAdmin as supabase, unwrap } from "../lib/supabaseAdmin.js";

/**
 * Reads go straight at the tables: content is public read-only, so the normal
 * select policy already covers an admin. Writes go through the security
 * definer functions in 0006, because authenticated has no insert, update or
 * delete privilege on content and should not be given one.
 */

export async function listRows(entity, { fk, parentId } = {}) {
  let q = supabase.from(entity).select("*");
  if (fk && parentId) q = q.eq(fk, parentId);
  return unwrap(await q.order("sort_order", { ascending: true }));
}

export async function countChildren(entity, fk, parentIds) {
  if (!parentIds.length) return {};
  const rows = unwrap(await supabase.from(entity).select(`id, ${fk}`).in(fk, parentIds));
  return rows.reduce((acc, r) => ({ ...acc, [r[fk]]: (acc[r[fk]] || 0) + 1 }), {});
}

export async function saveRow(entity, payload, rowId = null) {
  return unwrap(
    await supabase.rpc("admin_content_save", { entity, payload, row_id: rowId })
  );
}

export async function deleteRow(entity, rowId) {
  return unwrap(await supabase.rpc("admin_content_delete", { entity, row_id: rowId }));
}

export async function swapOrder(entity, idA, idB) {
  return unwrap(await supabase.rpc("admin_content_swap_order", { entity, id_a: idA, id_b: idB }));
}

export async function listLevels() {
  return unwrap(await supabase.from("cefr_levels").select("code, name").order("sort_order"));
}
