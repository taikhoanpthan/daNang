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
  const groupAvatar = (name) => {
    if (!name) return "💸";
    const icons = ["🏝️", "🍻", "💼", "✈️", "🎒", "🏠", "💰", "🚀"];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return icons[sum % icons.length];
  };

  const handleCopy = () => {
    const link = `${window.location.origin}?groupId=${groupId}`;
    navigator.clipboard.writeText(link);
    toast.success("Đã copy link nhóm 📎");
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Rời nhóm?",
      text: "Bạn sẽ cần join lại nếu muốn quay lại",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      onResetUsers();
      Swal.fire({
        icon: "success",
        title: "Đã rời nhóm",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-5 text-white shadow-2xl border border-white/10"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient" />
      <div className="absolute inset-0 bg-black/25 backdrop-blur-xl" />

      <div className="relative z-10 space-y-5">

        {/* TOP */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-2xl bg-white/20 shadow-lg ring-2 ring-white/30">
              {groupAvatar(groupName)}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xl font-bold">
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

          {/* INFO BADGES */}
          <div className="flex items-center gap-2 flex-wrap">

            <div className="px-3 py-1 rounded-full bg-white/15">
              ID: <span className="font-bold">{groupId}</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/15">
              👥 {users.length} người
            </div>

            <button
              onClick={handleCopy}
              className="bg-white/15 p-1.5 rounded-full hover:scale-110 transition"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* ACTION */}
          <button
            onClick={handleReset}
            className="bg-red-500/90 hover:bg-red-600 px-4 py-1.5 rounded-xl font-semibold transition"
          >
            Rời nhóm
          </button>

        </div>
      </div>

      {/* gradient animation */}
      <style>
        {`
          .animate-gradient {
            background-size: 300% 300%;
            animation: gradientMove 8s ease infinite;
          }

          @keyframes gradientMove {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
    </motion.div>
  );
}