import { motion } from "framer-motion";
import { formatVND } from "../utils/format";
import { Trash2 } from "lucide-react";
import { simplifyDebts } from "../utils/calc";

export default function ExpenseList({ expenses = [], onDelete, users = [] }) {
  const finalDebts = simplifyDebts(expenses);

  // 👉 helper tìm user
  const getUser = (name) => users.find((u) => u.name === name);

  return (
    <div className="space-y-3">
      {/* EMPTY */}
      {expenses.length === 0 && (
        <div className="text-center text-gray-400 text-sm">
          Chưa có khoản chi nào
        </div>
      )}

      {/* ===== LIST ===== */}
      {expenses.map((e) => {
        const participants = Array.isArray(e.participants)
          ? e.participants
          : [];

        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
          >
            {/* AVATAR */}
            <div className="flex items-center gap-2">
              {participants.map((p) => {
                const user = getUser(p);

                return (
                  <div
                    key={p}
                    title={user?.name}
                    className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                    style={{
                      backgroundColor: user?.color || "#9ca3af",
                    }}
                  >
                    {user?.avatar || "?"}
                  </div>
                );
              })}
            </div>

            {/* INFO */}
            <div className="flex-1 ml-3">
              <div className="font-bold text-green-600">
                {formatVND(e.amount)} đ
              </div>

              <div className="text-sm text-gray-700">
                {e.note || "Không rõ"}
              </div>

              <div className="text-xs text-gray-400">
                {e.date
                  ? new Date(e.date).toLocaleString("vi-VN")
                  : "Không có thời gian"}
              </div>

              <div className="text-sm text-gray-500">
                {e.payer || "?"} • {participants.join(", ")}
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
        <div className="bg-gray-50 p-3 rounded-xl shadow">
          <div className="font-bold text-gray-700 mb-2">
            💸 Tổng kết thanh toán
          </div>

          <div className="space-y-2">
            {finalDebts.map((t, index) => {
              const fromUser = getUser(t.from);
              const toUser = getUser(t.to);

              return (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm bg-white p-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {/* FROM */}
                    <div
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                      style={{
                        backgroundColor:
                          fromUser?.color || "#9ca3af",
                      }}
                    >
                      {fromUser?.avatar || "?"}
                    </div>

                    <span className="text-gray-600">→</span>

                    {/* TO */}
                    <div
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                      style={{
                        backgroundColor:
                          toUser?.color || "#9ca3af",
                      }}
                    >
                      {toUser?.avatar || "?"}
                    </div>
                  </div>

                  <div className="text-gray-700">
                    {t.from} trả {t.to}
                  </div>

                  <div className="font-bold text-red-500">
                    {formatVND(t.amount)} đ
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}