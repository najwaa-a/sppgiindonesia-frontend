export default function FoodPicture({ menu, size = "md" }) {
  return (
    <div
      className={`pic pic-${size}`}
      style={{ "--c1": menu.warna[0], "--c2": menu.warna[1] }}
      role="img"
      aria-label={`Foto ${menu.nama}`}
    >
      <span aria-hidden="true">{menu.emoji}</span>
    </div>
  );
}
