import { motion } from "framer-motion";
import { formatVND } from "../utils/format";
import { Trash2 } from "lucide-react";
import { simplifyDebts } from "../utils/calc";

export default function ExpenseList({
  expenses = [],
  onDelete,
  users = [],
}) {
  const finalDebts = simplifyDebts(expenses);

  const getUser = (name) => users.find((u) => u.name === name);

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        Chưa có khoản chi nào 😴
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ===== LIST ===== */}
      {expenses.map((e) => {
        const participants = e.participants || [];

        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center"
          >
            {/* LEFT */}
            <div className="flex-1">
              <div className="font-bold text-green-600 text-lg">
                {formatVND(e.amount)} đ
              </div>

              <div className="text-sm text-gray-700">
                {e.note || "Không có mô tả"}
              </div>

              <div className="text-xs text-gray-400">
                {e.date
                  ? new Date(e.date).toLocaleString("vi-VN")
                  : ""}
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {participants.map((p) => {
                  const user = getUser(p);
                  return (
                    <div
                      key={p}
                      className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center"
                      style={{
                        backgroundColor: user?.color || "#9ca3af",
                      }}
                    >
                      {user?.avatar || "?"}
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {e.payer} trả • {participants.join(", ")}
              </div>
            </div>

            {/* DELETE */}
            <button
              onClick={() => onDelete(e.id)}
              className="text-red-500 hover:scale-110 transition"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        );
      })}

      {/* ===== SUMMARY ===== */}
      {finalDebts.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-2xl border">
          <div className="font-semibold mb-2 text-gray-700">
            💸 Tổng kết
          </div>

          {finalDebts.map((t, i) => {
            const from = getUser(t.from);
            const to = getUser(t.to);

            return (
              <div
                key={i}
                className="flex justify-between items-center text-sm bg-white p-2 rounded-lg mb-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: from?.color }}
                  >
                    {from?.avatar}
                  </div>

                  <span>→</span>

                  <div
                    className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: to?.color }}
                  >
                    {to?.avatar}
                  </div>
                </div>

                <div className="text-gray-600">
                  {t.from} trả {t.to}
                </div>

                <div className="font-bold text-red-500">
                  {formatVND(t.amount)} đ
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}