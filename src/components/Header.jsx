import { Wallet, Users, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Header({ onResetUsers, groupId }) {
  const handleCopy = () => {
    const link = `${window.location.origin}?groupId=${groupId}`;
    navigator.clipboard.writeText(link);
    toast.success("Đã copy link nhóm 📋");
  };

  const handleConfirmReset = async () => {
    const result = await Swal.fire({
      title: "Đổi nhóm?",
      text: "Bạn sẽ rời nhóm hiện tại",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      onResetUsers(); // 👈 gọi từ App
      Swal.fire({
        icon: "success",
        title: "Đã thoát nhóm",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl shadow-lg p-4 text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Wallet size={20} />
              Chi tiêu nhóm - Đà Nẵng
            </div>
            <p className="text-xs opacity-80">
              Quản lý tiền – Mỹ đẹp trai
            </p>
          </div>

          <div className="bg-white/20 p-2 rounded-xl">
            <Users size={18} />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="opacity-80">Mã nhóm:</span>
            <span className="font-bold">{groupId}</span>

            <button
              onClick={handleCopy}
              className="bg-white/20 p-1 rounded hover:bg-white/30 transition"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* 👇 FIX: dùng Swal */}
          <button
            onClick={handleConfirmReset}
            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
          >
            Đổi nhóm
          </button>
        </div>
      </div>
    </motion.div>
  );
}