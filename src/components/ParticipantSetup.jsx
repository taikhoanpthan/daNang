import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getAllGroups, deleteGroup } from "../services/api";

export default function ParticipantSetup({ onDone, onJoin }) {
  const [mode, setMode] = useState("create");

  const [groupName, setGroupName] = useState(""); // ✅ NEW
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState("");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

  const getColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

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

  // ✅ UPDATED CREATE
  const handleCreate = () => {
    if (!groupName.trim()) {
      toast.warning("Nhập tên nhóm 😑");
      return;
    }

    if (users.length < 2) {
      toast.warning("Ít nhất 2 người 😅");
      return;
    }

    onDone({
      name: groupName,
      users,
    });
  };

  const handleJoin = (id = groupId) => {
    if (!id) return toast.warning("Nhập mã nhóm 😑");
    onJoin(id);
  };

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
    if (mode === "list") loadGroups();
  }, [mode]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhóm này?")) return;
    await deleteGroup(id);
    toast.success("Đã xoá 🗑️");
    loadGroups();
  };

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setMode(id)}
      className={`px-4 py-2 rounded-full text-sm transition
      ${
        mode === id
          ? "bg-cyan-500 text-black font-semibold"
          : "bg-white/10 text-gray-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white p-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-5"
      >

        <div className="text-center">
          <h2 className="text-xl font-bold">👥 Group Setup</h2>
        </div>

        {/* TABS */}
        <div className="flex gap-2 justify-center">
          <Tab id="create" label="Tạo" />
          <Tab id="join" label="Join" />
          <Tab id="list" label="DS" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >

            {/* CREATE */}
            {mode === "create" && (
              <>
                {/* group name */}
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Tên nhóm (VD: Đi Đà Lạt...)"
                  className="w-full bg-white/10 px-4 py-3 rounded-2xl outline-none"
                />

                {/* input user */}
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addUser()}
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

                {/* users */}
                <div className="flex flex-wrap gap-2">
                  {users.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: u.color }}
                    >
                      {u.avatar} {u.name}
                      <button onClick={() => removeUser(i)}>✕</button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
                >
                  🚀 Tạo nhóm
                </button>
              </>
            )}

            {/* JOIN */}
            {mode === "join" && (
              <>
                <input
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Nhập mã nhóm..."
                  className="w-full bg-white/10 px-4 py-3 rounded-2xl outline-none"
                />

                <button
                  onClick={() => handleJoin()}
                  className="w-full py-3 rounded-2xl bg-green-500 text-black font-semibold"
                >
                  Vào nhóm
                </button>
              </>
            )}

            {/* LIST */}
            {mode === "list" && (
              <div className="space-y-3 max-h-[260px] overflow-y-auto">
                {loading && (
                  <div className="text-gray-400">Loading...</div>
                )}

                {groups.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white/10 p-3 rounded-2xl flex justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        {g.name || "No name"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {g.users?.length || 0} members
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleJoin(g.id)}
                        className="bg-blue-500 px-3 py-1 rounded-xl"
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