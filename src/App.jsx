import { useEffect, useMemo, useState, useCallback } from "react";

import {
  getExpenses,
  deleteExpense,
  getGroup,
  createGroup,
} from "./services/api";

import { calculateBalances } from "./utils/calc";
import { ToastContainer, toast } from "react-toastify";

import ParticipantSetup from "./components/ParticipantSetup";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Intro from "./components/Intro";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 intro control
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("seenIntro");
  });

  // ================= INIT =================
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("groupId");
    if (id) handleJoinGroup(id);
  }, []);

  // ================= LOAD =================
  const loadData = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await getExpenses();

      const filtered = (res.data || []).filter(
        (e) => String(e.groupId) === String(id)
      );

      setExpenses(filtered);
    } catch {
      toast.error("Không tải được dữ liệu ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= CREATE =================
  const handleCreateGroup = async (data) => {
    try {
      const res = await createGroup(data);
      const id = res.data.id;

      setUsers(data.users);
      setGroupName(data.name);
      setGroupId(id);
      setIsSetup(true);

      window.history.pushState({}, "", `?groupId=${id}`);
      loadData(id);

      toast.success("Tạo nhóm thành công 🎉");
    } catch {
      toast.error("Tạo nhóm thất bại ❌");
    }
  };

  // ================= JOIN =================
  const handleJoinGroup = useCallback(
    async (group) => {
      try {
        const id = typeof group === "string" ? group : group.id;

        const res = await getGroup(id);
        const data = res.data;

        setUsers(data.users || []);
        setGroupName(data.name || "");
        setGroupId(id);
        setIsSetup(true);

        window.history.pushState({}, "", `?groupId=${id}`);
        loadData(id);
      } catch {
        toast.error("Không tìm thấy nhóm ❌");
      }
    },
    [loadData]
  );

  // ================= DELETE =================
  const handleDelete = useCallback(
    async (id) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));

      try {
        await deleteExpense(id);
        toast.success("Đã xoá 🗑️");
      } catch {
        toast.error("Xoá thất bại ❌");
        loadData(groupId);
      }
    },
    [groupId, loadData]
  );

  // ================= RESET =================
  const reset = useCallback(() => {
    setUsers([]);
    setExpenses([]);
    setGroupId(null);
    setGroupName("");
    setIsSetup(false);
    window.history.pushState({}, "", "/");
  }, []);

  // ================= BALANCE =================
  const balances = useMemo(() => {
    return calculateBalances(expenses);
  }, [expenses]);

  // ================= INTRO =================
  if (showIntro) {
    return <Intro onFinish={() => setShowIntro(false)} />;
  }

  // ================= SETUP =================
  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#111827]">
        <ParticipantSetup
          onCreate={handleCreateGroup}
          onJoin={handleJoinGroup}
        />
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black" />

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Header
            groupId={groupId}
            groupName={groupName}
            onResetUsers={reset}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ExpenseForm
              users={users}
              groupId={groupId}
              reload={() => loadData(groupId)}
            />

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                <ExpenseList
                  expenses={expenses}
                  onDelete={handleDelete}
                  users={users}
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                {Object.entries(balances).map(([name, value]) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span
                      className={
                        value > 0 ? "text-green-400" : "text-red-400"
                      }
                    >
                      {value.toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;