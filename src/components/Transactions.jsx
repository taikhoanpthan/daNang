import { motion } from "framer-motion";
import { formatShortVND } from "../utils/format";
import { Receipt, ArrowRight } from "lucide-react";

export default function Transactions({ groups = [] }) {
  return (
    <div className="space-y-3">
      {groups.length === 0 && (
        <div className="text-center text-gray-400 text-sm">
          Chưa có giao dịch
        </div>
      )}

      {groups.map((g) => (
        <motion.div
          key={g.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow p-3"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-semibold">
              <Receipt size={16} />
              {g.note}
            </div>

            <div className="text-sm text-gray-500">
              {formatShortVND(g.total)}
            </div>
          </div>

          {/* INFO */}
          <div className="text-xs text-gray-400 mb-2">
            {g.date
              ? new Date(g.date).toLocaleString("vi-VN")
              : ""}
          </div>

          {/* LIST */}
          <div className="space-y-1">
            {g.transactions.map((t, i) => (
              <div
                key={i}
                className="flex justify-between text-sm"
              >
                <span className="flex items-center gap-1">
                  {t.from}
                  <ArrowRight size={14} />
                  {t.to}
                </span>

                <span className="text-red-500 font-medium">
                  {formatShortVND(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}