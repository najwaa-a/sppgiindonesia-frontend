export const validateNama = (value) => {
  const letters = value.replace(/[^A-Za-zÀ-ÿ]/g, "").length;
  if (!value.trim()) return "Nama wajib diisi.";
  if (letters < 3) return "Nama minimal 3 huruf.";
  return "";
};

export const validateHp = (value) => {
  const phone = value.trim();
  if (!phone) return "Nomor WhatsApp wajib diisi.";
  if (!/^\d+$/.test(phone)) {
    return "Nomor hanya boleh berisi angka, tanpa spasi atau tanda +/-.";
  }
  if (phone.length < 10 || phone.length > 13) {
    return `Nomor harus 10–13 digit (sekarang ${phone.length} digit).`;
  }
  return "";
};

export const validateAlamat = (value) =>
  value.trim() ? "" : "No. meja atau alamat pengiriman wajib diisi.";

export const validators = {
  nama: validateNama,
  hp: validateHp,
  alamat: validateAlamat,
};

export function validateForm(values) {
  const errors = {};
  Object.keys(validators).forEach((key) => {
    const message = validators[key](values[key] ?? "");
    if (message) errors[key] = message;
  });
  return errors;
}
