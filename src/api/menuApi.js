import { delay, getJson } from "./client.js";

const MENU_URL = "/data/menus.json";

export const getMenus = (signal) => getJson(MENU_URL, signal);

export async function getMenuById(id, signal) {
  const menus = await getMenus(signal);
  const menu = menus.find((item) => String(item.id) === String(id));
  if (!menu) throw new Error("Menu yang kamu cari tidak ditemukan.");
  return menu;
}

export async function submitOrder(payload) {
  await delay(900);
  if (!payload.items.length) throw new Error("Keranjang kosong.");
  return { kode: `MBG-${Date.now().toString(36).toUpperCase().slice(-6)}` };
}
