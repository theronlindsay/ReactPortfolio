/**
 * Extra time to keep loading UI visible after data is ready (for layout/debug).
 * Set in .env.local, restart dev server:
 *   NEXT_PUBLIC_DEBUG_LOADING_MS=3000
 * Use 0 or unset to disable.
 */
const raw = process.env.NEXT_PUBLIC_DEBUG_LOADING_MS;
const n = raw != null && String(raw).trim() !== '' ? Number(raw) : 0;
export const DEBUG_LOADING_EXTRA_MS = Number.isFinite(n) && n > 0 ? n : 0;

export async function pauseForDebugLoading() {
  if (DEBUG_LOADING_EXTRA_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, DEBUG_LOADING_EXTRA_MS));
  }
}
