import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAllGroups,
  deleteGroup,
  deleteExpenseByGroupId,
} from "../services/api";

export default function ParticipantSetup({ onDone }) {
  const [mode, setMode] = useState("create");

  const [groupName, setGroupName] = useState("");
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const usedColorsRef = useRef(new Set());

  const colors = [
    "#6366f1",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#a855f7",
    "#22c55e",
  ];

  // ================= COLORS =================
  const getColor = () => {
    const used = usedColorsRef.current;
    const available = colors.filter(c => !used.has(c));

    const color =
      available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : colors[Math.floor(Math.random() * colors.length)];

    used.add(color);
    return color;
  };

  const resetColors = () => {
    usedColorsRef.current = new Set();
  };

  // ================= LOAD GROUPS =================
  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await getAllGroups();
      setGroups(res.data || []);
    } catch {
      toast.error("Load nhóm lỗi ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "list") loadGroups();
  }, [mode]);

  useEffect(() => {
    return () => resetColors();
  }, []);

  // ================= USERS =================
  const addUser = () => {
    const name = input.trim();
    if (!name) return;

    if (users.some(u => u.name === name)) {
      return toast.warning("Tên bị trùng 😑");
    }

    setUsers(prev => [
      ...prev,
      {
        name,
        avatar: name[0].toUpperCase(),
        color: getColor(),
      },
    ]);

    setInput("");
  };

  const removeUser = (index) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  // ================= CREATE GROUP =================
  const handleCreate = () => {
    if (!groupName.trim()) return toast.warning("Nhập tên nhóm");
    if (users.length < 2) return toast.warning("Ít nhất 2 người");

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const payload = {
      id: code,
      name: groupName,
      users,
      createdAt: new Date().toISOString(),
    };

    console.log("📦 CREATE:", payload);

    onDone(payload);
    toast.success(`Group code: ${code}`);
  };

  // ================= DELETE GROUP =================
  const handleDelete = async (id) => {
    const { value: password } = await Swal.fire({
      title: "Nhập mật khẩu xoá",
      input: "password",
      inputPlaceholder: "matkhau123",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      background: "#0b1220",
      color: "#fff",
    });

    if (!password) return;

    if (password !== "matkhau123") {
      return toast.error("Sai mật khẩu ❌");
    }

    const confirm = await Swal.fire({
      title: "Xác nhận xoá?",
      text: "Không thể hoàn tác",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      background: "#0b1220",
      color: "#fff",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteExpenseByGroupId(id);
      await deleteGroup(id);

      setGroups(prev => prev.filter(g => g.id !== id));

      toast.success("Đã xoá 🗑️");
    } catch {
      toast.error("Xoá lỗi ❌");
    }
  };

  // ================= TAB =================
  const Tab = ({ id, label }) => (
    <button
      onClick={() => setMode(id)}
      className={`px-4 py-2 rounded-full text-sm transition ${
        mode === id
          ? "bg-cyan-500 text-black font-bold"
          : "bg-white/10 text-gray-300"
      }`}
    >
      {label}
    </button>
  );

  // ================= ANIMATION FIX =================
  const pageVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white p-4">
      <motion.div className="w-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-5">

        <h2 className="text-center text-xl font-bold">👥 Group Setup</h2>

        {/* TAB */}
        <div className="flex gap-2 justify-center">
          <Tab id="create" label="Tạo" />
          <Tab id="list" label="DS" />
        </div>

        {/* ANIMATION FIX */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >

            {/* CREATE */}
            {mode === "create" && (
              <>
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Tên nhóm..."
                  className="w-full bg-white/10 px-4 py-3 rounded-2xl outline-none"
                />

                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addUser()}
                    placeholder="Nhập tên..."
                    className="flex-1 bg-white/10 px-4 py-3 rounded-2xl outline-none"
                  />
                  <button
                    onClick={addUser}
                    className="bg-cyan-500 text-black px-4 rounded-2xl font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {users.map((u, i) => (
                    <div
                      key={i}
                      className="px-3 py-1 rounded-full flex items-center gap-2"
                      style={{ background: u.color }}
                    >
                      {u.avatar} {u.name}
                      <button onClick={() => removeUser(i)}>✕</button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold"
                >
                  🚀 Tạo group
                </button>
              </>
            )}

            {/* LIST */}
            {mode === "list" && (
              <div className="space-y-3 max-h-[260px] overflow-y-auto">
                {loading && <div>Loading...</div>}

                {groups.map(g => (
                  <div
                    key={g.id}
                    className="bg-white/10 p-3 rounded-2xl flex justify-between"
                  >
                    <div>
                      <div className="font-semibold">{g.name}</div>
                      <div className="text-xs text-gray-400">
                        CODE: {g.id}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(g.id)}
                      className="bg-red-500 px-3 py-1 rounded-xl"
                    >
                      Xoá
                    </button>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}