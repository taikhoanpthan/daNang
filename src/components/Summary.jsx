export default function Summary({ balances }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="font-bold mb-2">📊 Tổng kết</h3>

      {Object.entries(balances).map(([name, money]) => (
        <div key={name} className="flex justify-between">
          <span>{name}</span>
          <span
            className={
              money > 0 ? "text-green-500" : "text-red-500"
            }
          >
            {money > 0 ? "+" : ""}
            {money.toLocaleString()}đ
          </span>
        </div>
      ))}
    </div>
  );
}