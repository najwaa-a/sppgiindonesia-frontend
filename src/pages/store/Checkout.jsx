import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { submitOrder } from "../../api/menuApi.js";
import { validateForm, validators } from "../../utils/validators.js";
import FoodPicture from "../../components/FoodPicture.jsx";
import QtyStepper from "../../components/QtyStepper.jsx";
import FormField from "../../components/FormField.jsx";

const EMPTY = { nama: "", hp: "", alamat: "", catatan: "" };

export default function Checkout() {
  const {
    items,
    totalPorsi,
    totalKalori,
    totalProtein,
    changeQty,
    removeItem,
    clear,
  } = useCart();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(null);
  const formRef = useRef(null);

  const errorOf = (key) =>
    touched[key] && validators[key] ? validators[key](values[key]) : "";
  const handleChange = (event) =>
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleBlur = (event) =>
    setTouched((current) => ({ ...current, [event.target.name]: true }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const errors = validateForm(values);
    setTouched({ nama: true, hp: true, alamat: true });
    const first = Object.keys(errors)[0];
    if (first) return formRef.current.elements[first].focus();

    setSubmitting(true);
    try {
      const response = await submitOrder({
        pembeli: {
          nama: values.nama.trim(),
          hp: values.hp.trim(),
          alamat: values.alamat.trim(),
          catatan: values.catatan.trim(),
        },
        items: items.map(({ id, qty }) => ({ id, qty })),
      });
      setDone({
        ...response,
        nama: values.nama.trim(),
        hp: values.hp.trim(),
        alamat: values.alamat.trim(),
        totalPorsi,
        totalKalori,
      });
      clear();
      setValues(EMPTY);
      setTouched({});
    } catch (error) {
      setSubmitError(error.message || "Pesanan gagal dikirim. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="card success" aria-labelledby="judul">
        <div className="check" aria-hidden="true">✓</div>
        <h1 id="judul" tabIndex={-1} ref={(element) => element?.focus()}>
          Pesanan diterima!
        </h1>
        <p className="sub">
          Terima kasih, {done.nama}. Dapur MBG sedang menyiapkan pesananmu.
        </p>
        <dl>
          <dt>Kode pesanan</dt><dd>{done.kode}</dd>
          <dt>Dikirim ke</dt><dd>{done.alamat}</dd>
          <dt>Konfirmasi via WhatsApp</dt><dd>{done.hp}</dd>
          <dt>Total</dt><dd>{done.totalPorsi} porsi · {done.totalKalori} kkal</dd>
        </dl>
        <Link className="btn" to="/menu">Pesan menu lain</Link>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="card empty">
        <div className="big" aria-hidden="true">🛒</div>
        <h1>Keranjang masih kosong</h1>
        <p className="sub">
          Pilih menu bergizi dari katalog, lalu kembali ke sini untuk checkout.
        </p>
        <Link className="btn" to="/menu">Lihat katalog menu</Link>
      </section>
    );
  }

  return (
    <>
      <h1>Keranjang &amp; Checkout</h1>
      <p className="sub">Periksa pesananmu, atur jumlah porsi, lalu isi data pembeli.</p>
      <div className="checkout">
        <section className="card" aria-labelledby="rincian">
          <h2 id="rincian">Rincian pesanan</h2>
          <ul className="lines">
            {items.map((item) => (
              <li key={item.id} className="line">
                <FoodPicture menu={item} size="sm" />
                <div>
                  <h3><Link to={`/menu/${item.id}`}>{item.nama}</Link></h3>
                  <p className="muted">
                    {item.kalori} kkal · {item.protein} g protein / porsi
                  </p>
                  <button
                    type="button"
                    className="link-danger"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Hapus ${item.nama} dari keranjang`}
                  >
                    Hapus
                  </button>
                </div>
                <QtyStepper
                  value={item.qty}
                  min={0}
                  onChange={(delta) => changeQty(item.id, delta)}
                  label={`porsi ${item.nama}`}
                />
              </li>
            ))}
          </ul>
          <dl className="summary">
            <div><dt>Total porsi</dt><dd>{totalPorsi}</dd></div>
            <div><dt>Total kalori</dt><dd>{totalKalori} kkal</dd></div>
            <div><dt>Total protein</dt><dd>{totalProtein} g</dd></div>
            <div className="total">
              <dt>Biaya</dt><dd className="free">Gratis (Program MBG)</dd>
            </div>
          </dl>
        </section>

        <form
          className="card"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="data-pembeli"
        >
          <h2 id="data-pembeli">Data pembeli</h2>
          <FormField
            id="nama"
            label="Nama lengkap"
            required
            placeholder="Contoh: Siti Aminah"
            autoComplete="name"
            value={values.nama}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorOf("nama")}
          />
          <FormField
            id="hp"
            label="No. WhatsApp"
            required
            placeholder="Contoh: 081234567890"
            inputMode="numeric"
            autoComplete="tel"
            hint="Hanya angka, 10–13 digit."
            value={values.hp}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorOf("hp")}
          />
          <FormField
            id="alamat"
            label="No. meja / alamat pengiriman"
            required
            placeholder="Contoh: Meja 12 atau Jl. Merdeka No. 5"
            value={values.alamat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorOf("alamat")}
          />
          <FormField
            id="catatan"
            label="Catatan (opsional)"
            multiline
            rows={3}
            placeholder="Contoh: tanpa sambal, alergi kacang"
            value={values.catatan}
            onChange={handleChange}
          />
          {submitError && <p className="banner-err" role="alert">{submitError}</p>}
          <button
            className="btn block"
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Mengirim pesanan…" : "Kirim pesanan"}
          </button>
        </form>
      </div>
    </>
  );
}
