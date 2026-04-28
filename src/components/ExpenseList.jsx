import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatVND } from "../utils/format";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { simplifyDebts } from "../utils/calc";

export default function ExpenseList({
  expenses = [],
  onDelete,
  users = [],
}) {
  const [showAll, setShowAll] = useState(false);

  const finalDebts = simplifyDebts(expenses);

  const getUser = (name) => users.find((u) => u.name === name);

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        😴 Chưa có giao dịch nào
      </div>
    );
  }

  const visibleExpenses = showAll
    ? expenses
    : expenses.slice(0, 3);

  return (
    <div className="space-y-5">

      {/* ================= EXPENSE LIST ================= */}
      <div className="space-y-3">

        <AnimatePresence mode="popLayout">
          {visibleExpenses.map((e, index) => {
            const participants = e.participants || [];

            return (
              <motion.div
                key={e.id || index}   // 👈 FIX AN TOÀN
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="group relative bg-white/10 backdrop-blur-xl
                border border-white/10 rounded-3xl p-4"
              >

                <div className="grid grid-cols-[1fr_auto] gap-4 items-center">

                  {/* LEFT */}
                  <div className="min-w-0">

                    <div className="text-emerald-400 font-bold text-lg">
                      {formatVND(e.amount)} đ
                    </div>

                    <div className="text-sm text-gray-300 truncate">
                      {e.note || "Không có mô tả"}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {e.date
                        ? new Date(e.date).toLocaleString("vi-VN")
                        : ""}
                    </div>

                    <div className="flex items-center mt-3">
                      <div className="flex -space-x-2">
                        {participants.slice(0, 4).map((p, i) => {
                          const user = getUser(p);

                          return (
                            <div
                              key={p + i}
                              className="w-7 h-7 rounded-full text-white text-xs
                              flex items-center justify-center border-2 border-[#0b1220]"
                              style={{
                                backgroundColor: user?.color || "#6b7280",
                              }}
                            >
                              {user?.avatar || "?"}
                            </div>
                          );
                        })}
                      </div>

                      <div className="ml-3 text-xs text-gray-400 truncate">
                        {e.payer} trả • {participants.length} người
                      </div>
                    </div>

                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => onDelete(e.id)}
                    className="opacity-0 group-hover:opacity-100
                    transition text-red-400 hover:text-red-300
                    hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <div className="absolute left-0 top-0 bottom-0 w-[3px]
                bg-gradient-to-b from-cyan-500/60 to-transparent rounded-l-3xl" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ================= SHOW MORE ================= */}
      {expenses.length > 3 && (
        <motion.button
          layout
          onClick={() => setShowAll((p) => !p)}
          className="w-full flex items-center justify-center gap-2
          text-sm text-gray-300 bg-white/5 hover:bg-white/10
          py-2 rounded-2xl transition"
          whileTap={{ scale: 0.98 }}
        >
          {showAll ? (
            <>
              Thu gọn <ChevronUp size={16} />
            </>
          ) : (
            <>
              Xem thêm ({expenses.length - 3}) <ChevronDown size={16} />
            </>
          )}
        </motion.button>
      )}

      {/* ================= SUMMARY ================= */}
      {finalDebts.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl
        border border-white/10 rounded-3xl p-4 space-y-3">

          <div className="text-sm text-gray-300 font-semibold">
            💸 Settlement Summary
          </div>

          {finalDebts.map((t, i) => {
            const from = getUser(t.from);
            const to = getUser(t.to);

            return (
              <div
                key={i}
                className="grid grid-cols-[80px_1fr_120px]
                items-center gap-2 bg-white/5 p-3 rounded-2xl"
              >

                <div className="flex items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
                    style={{ backgroundColor: from?.color }}
                  >
                    {from?.avatar}
                  </div>

                  <span className="text-gray-400">→</span>

                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
                    style={{ backgroundColor: to?.color }}
                  >
                    {to?.avatar}
                  </div>
                </div>

                <div className="text-sm text-gray-300 truncate">
                  {t.from} → {t.to}
                </div>

                <div className="text-red-400 font-bold text-right whitespace-nowrap">
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