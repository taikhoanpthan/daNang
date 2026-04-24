export default function Transactions({ transactions }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="font-bold mb-2">💸 Ai trả ai</h3>

      {transactions.length === 0 ? (
        <div className="text-gray-500 text-sm">
          Không ai nợ ai 🎉
        </div>
      ) : (
        transactions.map((t, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>
              {t.from} ➝ {t.to}
            </span>
            <span className="text-red-500">
              {t.amount.toLocaleString()}đ
            </span>
          </div>
        ))
      )}
    </div>
  );
}