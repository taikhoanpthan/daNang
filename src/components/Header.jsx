import { Wallet, Users, Copy, Sparkles } from "lucide-react";
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
      toast.success("Đã copy link nhóm 📎");
    } catch {
      toast.error("Copy thất bại ❌");
    }
  };

  // ================= MOBILE DETECT =================
  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

  // ================= RESET (FIX LAG) =================
  const handleReset = async () => {
    // 👉 MOBILE: dùng confirm native (nhanh, không lag)
    if (isMobile) {
      const ok = window.confirm("Bạn có muốn rời nhóm không?");
      if (!ok) return;

      onResetUsers();
      toast.success("Đã rời nhóm 👋");
      return;
    }

    // 👉 DESKTOP: SweetAlert2 (giữ đẹp)
    const result = await Swal.fire({
      title: "Rời nhóm?",
      text: "Bạn sẽ cần join lại nếu muốn quay lại",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",

      // 🔥 FIX LAG: tắt animation
      showClass: { popup: "" },
      hideClass: { popup: "" },
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    // 👉 tránh block UI
    requestAnimationFrame(() => {
      onResetUsers();

      Swal.fire({
        icon: "success",
        title: "Đã rời nhóm",
        timer: 900,
        showConfirmButton: false,
        showClass: { popup: "" },
        hideClass: { popup: "" },
      });
    });
  };

  // ================= UI =================
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-5 text-white shadow-2xl border border-white/10"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />

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

          {/* RIGHT */}
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
              className="bg-white/15 p-1.5 rounded-full active:scale-95 transition"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* ACTION */}
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 active:scale-95 px-4 py-1.5 rounded-xl font-semibold transition"
          >
            Rời nhóm
          </button>

        </div>
      </div>
    </motion.div>
  );
}