export default function BalanceCard({ name, money }) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white flex justify-between items-center">
      <div className="font-medium">{name}</div>

      <div
        className={`font-bold ${
          money > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {money > 0 ? "Nhận " : "Trả "}
        {Math.abs(money).toLocaleString()}đ
      </div>
    </div>
  );
}