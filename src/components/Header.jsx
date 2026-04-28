import { Wallet, Users, Copy, Sparkles, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Header({
  onResetUsers,
  groupId,
  groupName,
  users = [],
}) {
  // ================= ICON =================
  const groupAvatar = (name) => {
    if (!name) return "💸";
    const icons = ["🏝️", "🍻", "💼", "✈️", "🎒", "🏠", "💰", "🚀"];

    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }

    return icons[sum % icons.length];
  };

  // ================= COPY =================
  const handleCopy = async () => {
    try {
      const link = `${window.location.origin}?groupId=${groupId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Đã copy link 📎");
    } catch {
      toast.error("Copy thất bại ❌");
    }
  };

  // ================= RESET =================
  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Rời nhóm?",
      text: "Bạn có chắc muốn rời nhóm này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Rời",
      cancelButtonText: "Huỷ",
      background: "#0b1220",
      color: "#fff",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    onResetUsers();
    toast.success("Đã rời nhóm 👋");
  };

  // ================= UI =================
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-5 text-white border border-white/10 shadow-xl"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      <div className="relative z-10 space-y-5">

        {/* TOP */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-2xl bg-white/20 shadow-lg">
              {groupAvatar(groupName)}
            </div>

            <div>
              <div className="flex items-center gap-2 text-lg font-bold">
                <Wallet size={18} />
                {groupName || "Chi tiêu nhóm"}
              </div>

              <div className="text-xs opacity-80 flex items-center gap-1">
                <Sparkles size={12} />
                Quản lý chi tiêu thông minh
              </div>
            </div>
          </div>

          {/* RIGHT ICON */}
          <div className="bg-white/20 p-2 rounded-xl">
            <Users size={18} />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">

          {/* INFO */}
          <div className="flex items-center gap-2 flex-wrap">

            <div className="px-3 py-1 rounded-full bg-white/15">
              ID: <span className="font-bold">{groupId}</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/15">
              👥 {users.length} người
            </div>

            <button
              onClick={handleCopy}
              className="bg-white/15 p-2 rounded-full hover:bg-white/25 active:scale-95 transition"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* ACTION BUTTON (FIX UI) */}
          <button
            onClick={handleReset}
            className="
              flex items-center gap-2
              bg-gradient-to-r from-red-500 to-pink-600
              hover:from-red-600 hover:to-pink-700
              active:scale-95
              px-4 py-2
              rounded-xl
              font-semibold
              shadow-lg
              transition
            "
          >
            <LogOut size={14} />
            Rời nhóm
          </button>

        </div>
      </div>
    </motion.div>
  );
}