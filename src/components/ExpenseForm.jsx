import { useMemo, useState } from "react";
import { addExpense } from "../services/api";
import { motion } from "framer-motion";
import { Wallet, User, FileText, Users } from "lucide-react";
import { toast } from "react-toastify";

export default function ExpenseForm({ users = [], reload, groupId }) {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const userList = useMemo(() => users || [], [users]);

  const toggleUser = (name) => {
    setParticipants((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0)
      return toast.error("Nhập số tiền hợp lệ ❗");

    if (!payer) return toast.error("Chọn người trả ❗");

    if (participants.length === 0)
      return toast.error("Chọn người tham gia ❗");

    const finalParticipants = participants.includes(payer)
      ? participants
      : [...participants, payer];

    try {
      setLoading(true);

      await addExpense({
        amount: Number(amount),
        payer,
        participants: finalParticipants,
        note: note.trim() || "Không rõ",
        date: new Date().toISOString(),
        groupId: String(groupId),
      });

      toast.success("Đã thêm ✨");

      setAmount("");
      setDisplayAmount("");
      setPayer("");
      setParticipants([]);
      setNote("");

      reload();
    } catch {
      toast.error("Thêm thất bại ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/10
      rounded-3xl p-5 shadow-xl space-y-5"
    >
      {/* TITLE */}
      <div>
        <h2 className="text-white font-semibold text-lg">
          💸 Thêm chi tiêu
        </h2>
        <p className="text-xs text-gray-400">
          Nhập thông tin khoản chi mới
        </p>
      </div>

      {/* NOTE */}
      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
        <FileText size={18} className="text-gray-400" />
        <input
          value={note}
          placeholder="Chi cho cái gì..."
          className="w-full outline-none bg-transparent text-white placeholder-gray-500"
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
        <Wallet size={18} className="text-green-400" />
        <input
          value={displayAmount}
          placeholder="Nhập số tiền"
          className="w-full outline-none bg-transparent text-white placeholder-gray-500"
          inputMode="numeric"
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            setAmount(raw);
            setDisplayAmount(
              raw ? Number(raw).toLocaleString("vi-VN") : ""
            );
          }}
        />
      </div>

      {/* PAYER */}
      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
        <User size={18} className="text-blue-400" />
        <select
          value={payer}
          className="w-full outline-none bg-transparent text-white"
          onChange={(e) => setPayer(e.target.value)}
        >
          <option value="" className="text-black">
            Người trả
          </option>
          {userList.map((u) => (
            <option key={u.name} value={u.name} className="text-black">
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= USERS (IMPROVED UX) ================= */}
      <div className="space-y-2">

        {/* 🔥 LABEL + HINT */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-300 flex items-center gap-2">
            <Users size={16} />
            Chọn người tham gia
          </h3>

          <span className="text-[11px] text-gray-400">
            Nhấn để chọn / bỏ chọn
          </span>
        </div>

        {/* HELP TEXT */}
        <p className="text-[11px] text-cyan-300 bg-cyan-500/10 px-3 py-2 rounded-xl border border-cyan-500/20">
          💡 Những người được chọn sẽ cùng chia khoản chi này
        </p>

        {/* USER LIST */}
        {userList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userList.map((u) => {
              const active = participants.includes(u.name);

              return (
                <button
                  key={u.name}
                  onClick={() => toggleUser(u.name)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-200
                  ${
                    active
                      ? "text-white shadow-lg scale-105"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                  style={{
                    backgroundColor: active ? u.color : undefined,
                  }}
                >
                  <span className="mr-1">{u.avatar}</span>
                  {u.name}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic bg-white/5 p-3 rounded-xl border border-white/10">
            ⚠️ Chưa có thành viên trong nhóm → hãy thêm ở bước tạo nhóm
          </div>
        )}
      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        onClick={handleAdd}
        className="w-full py-3 rounded-2xl font-semibold text-white
        bg-gradient-to-r from-cyan-500 to-blue-600
        hover:scale-[1.02] active:scale-95 transition
        shadow-lg shadow-cyan-500/20 disabled:opacity-40"
      >
        {loading ? "Đang thêm..." : "➕ Thêm khoản chi"}
      </button>
    </motion.div>
  );
}