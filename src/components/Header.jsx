import { Wallet, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ onResetUsers }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl shadow-lg p-4 text-white"
    >
      {/* nền gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

      {/* overlay blur nhẹ */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Wallet size={20} />
            Chi tiêu nhóm - Đà Nẵng
          </div>

          <p className="text-xs opacity-80">Quản lý tiền – Mỹ đẹp trai</p>
        </div>

        {/* RIGHT ICON */}
        <div className="bg-white/20 p-2 rounded-xl">
          <Users size={18} />
        </div>
        <button
          onClick={onResetUsers}
          className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
        >
          Đổi nhóm
        </button>
      </div>
    </motion.div>
  );
}
