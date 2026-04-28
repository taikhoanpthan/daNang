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

function App() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= INIT =================
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("groupId");
    if (id) handleJoinGroup(id);
  }, []);

  // ================= LOAD EXPENSES =================
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

  // ================= CREATE GROUP =================
  const handleCreateGroup = async (data) => {
    try {
      const res = await createGroup({
        name: data.name,
        users: data.users,
      });

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

  // ================= JOIN GROUP =================
  const handleJoinGroup = useCallback(
    async (group) => {
      try {
        // 👇 FIX QUAN TRỌNG: ParticipantSetup gửi object chứ không phải id
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

  // ================= DELETE EXPENSE =================
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

  // ================= SETUP SCREEN =================
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

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black" />
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[120px]" />

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* HEADER */}
          <Header
            groupId={groupId}
            groupName={groupName}
            onResetUsers={reset}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* FORM */}
            <ExpenseForm
              users={users}
              groupId={groupId}
              reload={() => loadData(groupId)}
            />

            {/* LIST + SUMMARY */}
            <div className="lg:col-span-2 space-y-4">

              {/* EXPENSE LIST */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                <div className="flex justify-between mb-3">
                  <h2 className="text-sm text-gray-300">💸 Expenses</h2>
                  <span className="text-xs text-gray-400">
                    {expenses.length} items
                  </span>
                </div>

                <ExpenseList
                  expenses={expenses}
                  onDelete={handleDelete}
                  users={users}
                />

                {loading && (
                  <div className="text-center text-gray-400 text-sm mt-3">
                    Loading...
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                <h2 className="text-sm text-gray-300 mb-3">
                  📊 Summary
                </h2>

                <div className="space-y-2 text-sm">
                  {Object.entries(balances).map(([name, value]) => (
                    <div key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span className={value > 0 ? "text-green-400" : "text-red-400"}>
                        {value.toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>
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