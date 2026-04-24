import { motion } from "framer-motion";
import { formatVND } from "../utils/format";

export default function ExpenseList({ expenses }) {
  return (
    <div className="space-y-2">
      {expenses.map((e) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-3 rounded-xl shadow flex justify-between"
        >
          <div>
            {/* TIỀN */}
            <div className="font-bold">
              {formatVND(e.amount)} đ
            </div>

            {/* NOTE 👇 thêm dòng này */}
            <div className="text-sm text-gray-700">
              🧾 {e.note || "Không rõ"}
            </div>

            {/* NGƯỜI */}
            <div className="text-sm text-gray-500">
              {e.payer} • {e.participants.join(", ")}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}