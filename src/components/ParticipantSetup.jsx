import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAllGroups,
  deleteGroup,
  deleteExpenseByGroupId,
} from "../services/api";

export default function ParticipantSetup({ onCreate, onJoin }) {
  const [mode, setMode] = useState("create");

  const [groupName, setGroupName] = useState("");
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const PASSWORD = "matkhau123";

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

  // ================= COLOR =================
  const getColor = () => {
    const used = usedColorsRef.current;
    const available = colors.filter((c) => !used.has(c));

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

    if (users.some((u) => u.name === name)) {
      return toast.warning("Tên bị trùng 😑");
    }

    setUsers((prev) => [
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
    setUsers((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= CREATE GROUP =================
  const handleCreate = () => {
    if (!groupName.trim()) return toast.warning("Nhập tên nhóm");
    if (users.length < 2) return toast.warning("Ít nhất 2 người");

    const payload = {
      name: groupName,
      users,
      createdAt: new Date().toISOString(),
    };

    if (onCreate) onCreate(payload);

    toast.success("Tạo nhóm thành công 🚀");

    setGroupName("");
    setUsers([]);
    setInput("");
  };

  // ================= DELETE GROUP =================
  const handleDelete = async (id) => {
    const { value: password } = await Swal.fire({
      title: "🔒 Nhập mật khẩu xoá",
      input: "password",
      inputPlaceholder: "Nhập mật khẩu",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#ef4444",
      background: "#0b1220",
      color: "#fff",
    });

    if (!password) return;

    if (password !== PASSWORD) {
      return toast.error("Sai mật khẩu ❌");
    }

    const confirm = await Swal.fire({
      title: "Xác nhận xoá?",
      text: "Dữ liệu sẽ bị xoá vĩnh viễn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#ef4444",
      background: "#0b1220",
      color: "#fff",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteExpenseByGroupId(id);
      await deleteGroup(id);

      setGroups((prev) => prev.filter((g) => g.id !== id));

      Swal.fire({
        title: "Đã xoá!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        background: "#0b1220",
        color: "#fff",
      });
    } catch {
      toast.error("Xoá lỗi ❌");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white p-4">
      <motion.div className="w-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-5">

        <h2 className="text-center text-xl font-bold">👥 Group Setup</h2>

        {/* TAB */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setMode("create")}
            className={`px-4 py-2 rounded-full ${
              mode === "create" ? "bg-cyan-500 text-black" : "bg-white/10"
            }`}
          >
            Tạo
          </button>

          <button
            onClick={() => setMode("list")}
            className={`px-4 py-2 rounded-full ${
              mode === "list" ? "bg-cyan-500 text-black" : "bg-white/10"
            }`}
          >
            Danh sách
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} className="space-y-4">

            {/* CREATE */}
            {mode === "create" && (
              <>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Nhập tên nhóm..."
                  className="w-full bg-white/10 px-4 py-3 rounded-2xl outline-none"
                />

                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addUser()}
                    placeholder="Thêm thành viên..."
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
                  🚀 Tạo nhóm
                </button>
              </>
            )}

            {/* LIST */}
            {mode === "list" && (
              <div className="space-y-3 max-h-[260px] overflow-y-auto">
                {loading && <div>Loading...</div>}

                {groups.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white/10 p-3 rounded-2xl flex justify-between items-center"
                  >
                    {/* INFO */}
                    <div>
                      <div className="font-semibold">{g.name}</div>
                      <div className="text-xs text-gray-400">
                        {g.users?.length || 0} thành viên
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (onJoin) {
                            onJoin(g); // 👈 FIX CHÍNH: không lỗi object nữa
                          } else {
                            console.log("JOIN GROUP:", g);
                          }
                        }}
                        className="bg-cyan-500 text-black px-3 py-1 rounded-xl font-medium"
                      >
                        Vào
                      </button>

                      <button
                        onClick={() => handleDelete(g.id)}
                        className="bg-red-500 px-3 py-1 rounded-xl"
                      >
                        Xoá
                      </button>
                    </div>
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