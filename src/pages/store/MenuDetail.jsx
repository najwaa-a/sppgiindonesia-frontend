import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMenuById } from "../../api/menuApi.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useCart } from "../../context/CartContext.jsx";
import FoodPicture from "../../components/FoodPicture.jsx";
import NutritionTable from "../../components/NutritionTable.jsx";
import QtyStepper from "../../components/QtyStepper.jsx";
import { DetailSkeleton, ErrorState } from "../../components/StateViews.jsx";

export default function MenuDetail() {
  const { id } = useParams();
  const { data: menu, loading, error, retry } = useFetch(
    (signal) => getMenuById(id, signal),
    [id]
  );
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);

  if (loading) return <DetailSkeleton />;
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
        backTo={<Link className="btn ghost" to="/menu">Ke katalog</Link>}
      />
    );
  }

  const handleAdd = () => {
    addItem(menu, qty);
    setAdded(qty);
    setQty(1);
  };

  return (
    <article className="detail">
      <FoodPicture menu={menu} size="lg" />
      <div>
        <nav aria-label="Breadcrumb" className="crumb">
          <Link to="/menu">Katalog Menu</Link> / <span aria-current="page">{menu.kategori}</span>
        </nav>
        <ul className="chips" aria-label="Ringkasan">
          <li>{menu.kategori}</li>
          <li>{menu.kalori} kkal</li>
          <li>Higienis &amp; Halal</li>
        </ul>
        <h1>{menu.nama}</h1>
        <p className="sub">{menu.deskripsi}</p>
        <p className="porsi"><strong>Porsi:</strong> {menu.porsi}</p>
        <NutritionTable menu={menu} />
        <div className="row">
          <QtyStepper
            value={qty}
            onChange={(delta) =>
              setQty((current) => Math.min(20, Math.max(1, current + delta)))
            }
          />
          <button className="btn" onClick={handleAdd}>Tambah ke Keranjang</button>
        </div>
        <p className="status" role="status" aria-live="polite">
          {added > 0 && (
            <>{added} porsi ditambahkan. <Link to="/checkout">Lihat keranjang</Link></>
          )}
        </p>
      </div>
    </article>
  );
}
