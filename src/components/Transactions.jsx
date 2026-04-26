import { motion } from "framer-motion";
import { formatShortVND } from "../utils/format";
import { simplifyDebts } from "../utils/calc";

export default function Transactions({ expenses = [] }) {
  const transactions = simplifyDebts(expenses);

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm">
        Không cần thanh toán 👍
      </div>
    );
  }

  // group theo người nhận
  const grouped = {};

  transactions.forEach((t) => {
    if (!grouped[t.to]) grouped[t.to] = [];
    grouped[t.to].push(t);
  });

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([receiver, list]) => {
        const total = list.reduce((sum, i) => sum + i.amount, 0);

        return (
          <motion.div
            key={receiver}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow p-3"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-green-600">
                💰 {receiver} nhận
              </span>
              <span className="font-bold text-green-600">
                {formatShortVND(total)}
              </span>
            </div>

            {/* LIST */}
            <div className="space-y-1 text-sm">
              {list.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-600"
                >
                  <span>• {t.from}</span>
                  <span>{formatShortVND(t.amount)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}