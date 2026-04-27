import { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ParticipantSetup({ onDone }) {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  const colors = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const addUser = () => {
    const name = input.trim();
    if (!name) return;

    if (users.find((u) => u.name === name)) {
      toast.warning("Tên đã tồn tại ⚠️");
      return;
    }

    const newUser = {
      name,
      color: getRandomColor(),
      avatar: name.charAt(0).toUpperCase(),
    };

    setUsers([...users, newUser]);
    setInput("");
  };

  const removeUser = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (users.length < 2) {
      toast.warning("Nhập ít nhất 2 người nha 😅");
      return;
    }

    localStorage.setItem("users", JSON.stringify(users));
    onDone(users);
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-[340px] space-y-5 border border-gray-200">
      
      <h2 className="text-xl font-bold text-center">
        Tạo nhóm
      </h2>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập tên..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUser()}
          className="flex-1 px-3 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />

        <button
          onClick={addUser}
          className="px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:scale-105 active:scale-95 transition"
        >
          +
        </button>
      </div>

      {/* LIST */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {users.map((u, i) => (
            <motion.div
              key={u.name}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white shadow-md"
              style={{ backgroundColor: u.color }}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                {u.avatar}
              </div>

              {u.name}

              <button
                onClick={() => removeUser(i)}
                className="ml-1 hover:scale-110 transition"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
      >
        Bắt đầu 
      </motion.button>
    </div>
  );
}