export default function NutritionTable({ menu }) {
  const rows = [
    ["Kalori", `${menu.kalori} kkal`],
    ["Protein", `${menu.protein} g`],
    ["Karbohidrat", `${menu.karbohidrat} g`],
    ["Lemak", `${menu.lemak} g`],
    ["Serat", `${menu.serat} g`],
  ];
  return (
    <table className="nutrition">
      <caption>Informasi nilai gizi per porsi</caption>
      <thead>
        <tr>
          <th scope="col">Zat gizi</th>
          <th scope="col">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, value]) => (
          <tr key={key}>
            <th scope="row">{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
