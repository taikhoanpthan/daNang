import { formatShortVND } from "../utils/format";
export default function Transactions({ transactions = [] }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="font-bold mb-2">💸 Ai trả ai</h3>

      {transactions.length === 0 ? (
        <div className="text-sm text-gray-400">
          Không có khoản cần thanh toán
        </div>
      ) : (
        transactions.map((t, i) => (
          <div key={i} className="flex justify-between py-1 text-sm">
            <span>
              {t.from} → {t.to}
            </span>

            <span className="text-red-500 font-medium">
              {formatShortVND(t.amount)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}