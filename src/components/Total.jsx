import { formatVND } from "../utils/format";

export default function Total({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-green-100 p-4 rounded-2xl shadow text-center">
      <div className="text-sm text-gray-600">Tổng chi</div>
      <div className="text-2xl font-bold text-green-700">
        {formatVND(total)} đ
      </div>
    </div>
  );
}