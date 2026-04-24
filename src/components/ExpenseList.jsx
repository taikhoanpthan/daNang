import { motion } from "framer-motion";
import { formatVND } from "../utils/format";
import { Trash2 } from "lucide-react";
import { usersMeta } from "../utils/user";

export default function ExpenseList({ expenses = [], onDelete }) {
  return (
    <div className="space-y-2">
      {expenses.length === 0 && (
        <div className="text-center text-gray-400 text-sm">
          Chưa có khoản chi nào
        </div>
      )}

      {expenses.map((e) => {
        const participants = Array.isArray(e.participants)
          ? e.participants
          : [];

        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
          >
            {/* avatars */}
            <div className="flex items-center gap-2">
              {participants.map((p) => (
                <div
                  key={p}
                  className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${
                    usersMeta[p]?.color || "bg-gray-400"
                  }`}
                >
                  {usersMeta[p]?.short || "?"}
                </div>
              ))}
            </div>

            {/* info */}
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

            {/* delete */}
            <button
              onClick={() => onDelete(e.id)}
              className="text-red-500 hover:scale-110 transition"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}