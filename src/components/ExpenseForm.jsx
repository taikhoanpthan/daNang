import { useState } from "react";
import { addExpense } from "../services/api";
import { motion } from "framer-motion";
import { Wallet, User, FileText } from "lucide-react";
import { toast } from "react-toastify";

export default function ExpenseForm({ users = [], reload }) {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);
  const [note, setNote] = useState("");

  // 👉 FIX: dùng name thay vì object
  const toggleUser = (name) => {
    setParticipants((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

  const handleAdd = async () => {
    if (!amount || !payer || participants.length === 0) {
      toast.error("❗ Nhập đầy đủ thông tin");
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

    toast.success("✅ Đã thêm!");

    setAmount("");
    setDisplayAmount("");
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
      <div className="flex items-center border p-2 rounded-lg">
        <FileText size={18} className="mr-2 text-gray-500" />
        <input
          value={note}
          placeholder="Chi cho cái gì..."
          className="w-full outline-none"
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div className="flex items-center border p-2 rounded-lg">
        <Wallet size={18} className="mr-2 text-green-500" />
        <input
          value={displayAmount}
          placeholder="Nhập số tiền"
          className="w-full outline-none"
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            setAmount(raw);

            const formatted = raw
              ? Number(raw).toLocaleString("vi-VN")
              : "";
            setDisplayAmount(formatted);
          }}
        />
      </div>

      {/* 🔥 PAYER (FIX KEY + VALUE) */}
      <div className="flex items-center border p-2 rounded-lg">
        <User size={18} className="mr-2 text-blue-500" />
        <select
          value={payer}
          className="w-full outline-none"
          onChange={(e) => setPayer(e.target.value)}
        >
          <option value="">Người trả</option>
          {users.map((u) => (
            <option key={u.name} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 PARTICIPANTS (có avatar + màu) */}
      <div className="flex gap-2 flex-wrap">
        {users.map((u) => {
          const active = participants.includes(u.name);

          return (
            <button
              key={u.name}
              onClick={() => toggleUser(u.name)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition
                ${active ? "text-white scale-105" : "bg-gray-200"}
              `}
              style={{
                backgroundColor: active ? u.color : undefined,
              }}
            >
              {/* avatar */}
              <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                {u.avatar}
              </div>

              {u.name}
            </button>
          );
        })}
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