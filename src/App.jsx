import { useEffect, useState } from "react";
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
  const [balances, setBalances] = useState({});
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState(""); // ✅ NEW
  const [isSetup, setIsSetup] = useState(false);

  // ================= INIT =================
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("groupId");
    if (id) handleJoinGroup(id);
  }, []);

  // ================= LOAD DATA =================
  const loadData = async (id) => {
    try {
      const res = await getExpenses();

      const filtered = res.data.filter((e) => String(e.groupId) === String(id));

      setExpenses(filtered);
      setBalances(calculateBalances(filtered));
    } catch {
      toast.error("Không tải được dữ liệu ❌");
    }
  };

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
  const handleJoinGroup = async (id) => {
    try {
      const res = await getGroup(id);

      setUsers(res.data.users || []);
      setGroupName(res.data.name || "");
      setGroupId(id);
      setIsSetup(true);

      window.history.pushState({}, "", `?groupId=${id}`);
      loadData(id);
    } catch {
      toast.error("Không tìm thấy nhóm ❌");
    }
  };

  // ================= DELETE EXPENSE =================
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);

      const newData = expenses.filter((e) => e.id !== id);
      setExpenses(newData);
      setBalances(calculateBalances(newData));

      toast.success("Đã xoá 🗑️");
    } catch {
      toast.error("Xoá thất bại ❌");
    }
  };

  // ================= RESET =================
  const reset = () => {
    setUsers([]);
    setExpenses([]);
    setBalances({});
    setGroupId(null);
    setGroupName("");
    setIsSetup(false);

    window.history.pushState({}, "", "/");
  };

  // ================= SETUP SCREEN =================
  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1220]">
        <ParticipantSetup onDone={handleCreateGroup} onJoin={handleJoinGroup} />
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <Header
          groupId={groupId}
          groupName={groupName} // ✅ thêm cái này
          onResetUsers={reset}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            <ExpenseForm
              users={users}
              groupId={groupId}
              reload={() => loadData(groupId)}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-4">
            {/* EXPENSE LIST */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
              <div className="flex justify-between mb-3">
                <h2 className="text-sm text-gray-300">💸 Expenses</h2>
                <span className="text-xs text-gray-500">
                  {expenses.length} items
                </span>
              </div>

              <ExpenseList
                expenses={expenses}
                onDelete={handleDelete}
                users={users}
              />
            </div>

            {/* SUMMARY */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
              <h2 className="text-sm text-gray-300 mb-3">📊 Summary</h2>

              <div className="space-y-2 text-sm">
                {Object.entries(balances).map(([name, value]) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span
                      className={value > 0 ? "text-green-400" : "text-red-400"}
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
