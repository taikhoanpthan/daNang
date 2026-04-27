import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getAllGroups, deleteGroup } from "../services/api";

export default function ParticipantSetup({ onDone, onJoin }) {
  const [mode, setMode] = useState("create");

  // ===== CREATE =====
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  // ===== JOIN =====
  const [groupId, setGroupId] = useState("");

  // ===== GROUP LIST =====
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

  const getColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  // ===== ADD USER =====
  const addUser = () => {
    const name = input.trim();
    if (!name) return;

    if (users.some((u) => u.name === name)) {
      toast.warning("Tên trùng 😑");
      return;
    }

    setUsers([
      ...users,
      {
        name,
        avatar: name[0].toUpperCase(),
        color: getColor(),
      },
    ]);

    setInput("");
  };

  const removeUser = (i) => {
    setUsers(users.filter((_, idx) => idx !== i));
  };

  // ===== CREATE GROUP =====
  const handleCreate = () => {
    if (users.length < 2) {
      toast.warning("Ít nhất 2 người 😅");
      return;
    }
    onDone(users);
  };

  // ===== JOIN =====
  const handleJoin = (id = groupId) => {
    if (!id) {
      toast.warning("Nhập mã nhóm 😑");
      return;
    }
    onJoin(id);
  };

  // ===== LOAD GROUPS =====
  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await getAllGroups();
      setGroups(res.data);
    } catch {
      toast.error("Load nhóm lỗi ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "list") {
      loadGroups();
    }
  }, [mode]);

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhóm này?")) return;

    await deleteGroup(id);
    toast.success("Đã xoá 🗑️");
    loadGroups();
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl w-[350px] space-y-5">
      <h2 className="text-center font-bold text-lg">
        👥 Quản lý nhóm
      </h2>

      {/* ===== TAB ===== */}
      <div className="flex gap-2">
        {[
          { key: "create", label: "Tạo" },
          { key: "join", label: "Join" },
          { key: "list", label: "DS nhóm" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setMode(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm ${
              mode === t.key
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== CREATE ===== */}
        {mode === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && addUser()
                }
                placeholder="Nhập tên..."
                className="flex-1 border px-3 py-2 rounded-xl"
              />

              <button
                onClick={addUser}
                className="bg-indigo-500 text-white px-4 rounded-xl"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {users.map((u, i) => (
                <motion.div
                  key={u.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: u.color }}
                >
                  {u.avatar} {u.name}
                  <button onClick={() => removeUser(i)}>
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl"
            >
              Tạo nhóm 🚀
            </button>
          </motion.div>
        )}

        {/* ===== JOIN ===== */}
        {mode === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <input
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Nhập mã nhóm..."
              className="w-full border px-3 py-2 rounded-xl"
            />

            <button
              onClick={() => handleJoin()}
              className="w-full bg-green-500 text-white py-2 rounded-xl"
            >
              Vào nhóm
            </button>
          </motion.div>
        )}

        {/* ===== LIST ===== */}
        {mode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 max-h-[250px] overflow-y-auto"
          >
            {loading && (
              <div className="text-sm text-gray-400">
                Đang load...
              </div>
            )}

            {groups.map((g) => (
              <div
                key={g.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
              >
                <div>
                  <div className="font-semibold">
                    Group #{g.id}
                  </div>
                  <div className="text-xs text-gray-400">
                    {g.users?.length || 0} người
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoin(g.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Vào
                  </button>

                  <button
                    onClick={() => handleDelete(g.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}