export async function getJson(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internetmu.", {
      cause: error,
    });
  }
  if (!response.ok) throw new Error(`Gagal memuat data (kode ${response.status}).`);
  try {
    return await response.json();
  } catch {
    throw new Error("Format data dari server tidak valid.");
  }
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
