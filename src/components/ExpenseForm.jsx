import { useState } from "react";
import { addExpense } from "../services/api";
import { motion } from "framer-motion";
import { formatVND } from "../utils/format";

export default function ExpenseForm({ users, reload }) {
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);
  const [note, setNote] = useState("");

  const toggleUser = (user) => {
    setParticipants((prev) =>
      prev.includes(user)
        ? prev.filter((p) => p !== user)
        : [...prev, user]
    );
  };

  const handleAdd = async () => {
    if (!amount || !payer || participants.length === 0) {
      alert("❗ Nhập đầy đủ thông tin");
      return;
    }

    const finalParticipants = participants.includes(payer)
      ? participants
      : [...participants, payer];

    await addExpense({
      amount: Number(amount),
      payer,
      participants: finalParticipants,
      note,
      date: new Date().toISOString(),
    });

    // reset form
    setAmount("");
    setPayer("");
    setParticipants([]);
    setNote("");

    reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-2xl shadow space-y-3"
    >
      {/* NOTE */}
      <input
        value={note}
        placeholder="📝 Chi cho cái gì (ăn uống, khách sạn...)"
        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setNote(e.target.value)}
      />

      {/* AMOUNT */}
      <input
        value={amount}
        placeholder="💰 Nhập số tiền"
        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setAmount(value);
        }}
      />

      {/* FORMAT PREVIEW */}
      {amount && (
        <div className="text-green-600 text-sm">
          = {formatVND(amount)} đ
        </div>
      )}

      {/* PAYER */}
      <select
        value={payer}
        className="w-full border p-2 rounded-lg focus:outline-none"
        onChange={(e) => setPayer(e.target.value)}
      >
        <option value="">👤 Người trả</option>
        {users.map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>

      {/* PARTICIPANTS */}
      <div className="flex gap-2 flex-wrap">
        {users.map((u) => (
          <button
            key={u}
            onClick={() => toggleUser(u)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              participants.includes(u)
                ? "bg-blue-500 text-white scale-105"
                : "bg-gray-200"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:scale-105 active:scale-95 transition"
      >
        ➕ Thêm khoản chi
      </button>
    </motion.div>
  );
}