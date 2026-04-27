import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getAllGroups, deleteGroup } from "../services/api";

export default function ParticipantSetup({ onDone, onJoin }) {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("create"); // create | join | manager
  const [groupId, setGroupId] = useState("");

  // 🔥 manager
  const [password, setPassword] = useState("");
  const [groups, setGroups] = useState([]);

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

  // ===== USER =====
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

  // ===== CREATE =====
  const handleCreate = () => {
    if (users.length < 2) {
      toast.warning("Nhập ít nhất 2 người 😅");
      return;
    }

    onDone(users);
  };

  // ===== JOIN =====
  const handleJoin = () => {
    if (!groupId.trim()) {
      toast.warning("Nhập mã nhóm đi 😑");
      return;
    }

    if (onJoin) onJoin(groupId);
  };

  // ===== LOAD GROUP LIST =====
  const loadGroups = async () => {
    try {
      const res = await getAllGroups();
      setGroups(res.data);
    } catch {
      toast.error("Không load được group ❌");
    }
  };

  useEffect(() => {
    if (mode === "manager") {
      loadGroups();
    }
  }, [mode]);

  // ===== DELETE GROUP =====
  const handleDeleteGroup = async (id) => {
    if (!window.confirm("Xoá nhóm này?")) return;

    await deleteGroup(id);
    toast.success("Đã xoá 🗑️");
    loadGroups();
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-[340px] space-y-5 border border-gray-200">
      
      <h2 className="text-xl font-bold text-center">
        👥 Quản lý nhóm
      </h2>

      {/* SWITCH MODE */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("create")}
          className={`flex-1 py-2 rounded-xl ${
            mode === "create" ? "bg-indigo-500 text-white" : "bg-gray-200"
          }`}
        >
          Tạo
        </button>

        <button
          onClick={() => setMode("join")}
          className={`flex-1 py-2 rounded-xl ${
            mode === "join" ? "bg-indigo-500 text-white" : "bg-gray-200"
          }`}
        >
          Join
        </button>

        <button
          onClick={() => setMode("manager")}
          className={`flex-1 py-2 rounded-xl ${
            mode === "manager" ? "bg-indigo-500 text-white" : "bg-gray-200"
          }`}
        >
          DS nhóm
        </button>
      </div>

      {/* ===== CREATE ===== */}
      {mode === "create" && (
        <>
          <div className="flex gap-2">
            <input
              placeholder="Nhập tên..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addUser()}
              className="flex-1 px-3 py-2 rounded-xl border"
            />

            <button
              onClick={addUser}
              className="px-4 bg-indigo-500 text-white rounded-xl"
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {users.map((u, i) => (
                <motion.div
                  key={u.name}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: u.color }}
                >
                  <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">
                    {u.avatar}
                  </div>

                  {u.name}

                  <button onClick={() => removeUser(i)}>✕</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-2 bg-indigo-600 text-white rounded-xl"
          >
            Tạo nhóm 🚀
          </button>
        </>
      )}

      {/* ===== JOIN ===== */}
      {mode === "join" && (
        <>
          <input
            placeholder="Nhập mã nhóm..."
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border"
          />

          <button
            onClick={handleJoin}
            className="w-full py-2 bg-green-600 text-white rounded-xl"
          >
            Vào nhóm 🔑
          </button>
        </>
      )}

      {/* ===== MANAGER ===== */}
      {mode === "manager" && (
        <>
          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border"
          />

          <button
            onClick={() => {
              if (password === "matkhau123") {
                loadGroups();
              } else {
                toast.error("Sai mật khẩu ❌");
              }
            }}
            className="w-full py-2 bg-gray-300 rounded-xl"
          >
            Xem danh sách
          </button>

          {/* LIST */}
          {password === "matkhau123" && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="flex justify-between items-center bg-white p-2 rounded-lg text-sm shadow"
                >
                  <div>
                    <div className="font-semibold">Group #{g.id}</div>
                    <div className="text-xs text-gray-400">
                      {g.users?.length || 0} người
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onJoin && onJoin(g.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Vào
                    </button>

                    <button
                      onClick={() => handleDeleteGroup(g.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}