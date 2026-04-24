import { formatShortVND } from "../utils/format";

export default function Total({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-2xl shadow">
      <div className="text-sm opacity-80">Tổng chi</div>
      <div className="text-2xl font-bold">
        {formatShortVND(total)}
      </div>
      <div className="text-xs opacity-80 mt-1">
        {expenses.length} khoản chi
      </div>
    </div>
  );
}