import { motion } from "framer-motion";
import { formatVND } from "../utils/format";
import { Trash2, Wallet, Users } from "lucide-react";

export default function ExpenseList({ expenses = [], onDelete }) {
  return (
    <div className="space-y-2">
      {expenses.length === 0 && (
        <div className="text-center text-gray-400 text-sm">
          Chưa có khoản chi nào
        </div>
      )}

      {expenses.map((e) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
        >
          <div>
            <div className="font-bold text-green-600">
              {formatVND(e.amount)} đ
            </div>

            <div className="text-sm text-gray-700">{e.note || "Không rõ"}</div>

            <div className="text-xs text-gray-400">
              {new Date(e.date).toLocaleString("vi-VN")}
            </div>

            <div className="text-sm text-gray-500">
              {e.payer} • {e.participants.join(", ")}
            </div>
          </div>

          {/* delete */}
          <button
            onClick={() => onDelete(e.id)}
            className="text-red-500 hover:scale-110 transition"
          >
            <Trash2 size={18} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
