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
import Summary from "./components/Summary";
import Transactions from "./components/Transactions";
import Total from "./components/Total";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [mode, setMode] = useState("home");

  // ===== LOAD GROUP FROM URL =====
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(
      "groupId"
    );
    if (id) handleJoinGroup(id);
  }, []);

  // ===== LOAD DATA =====
  const loadData = async (id) => {
    const res = await getExpenses();
    const filtered = res.data.filter(
      (e) => String(e.groupId) === String(id)
    );

    setExpenses(filtered);
    setBalances(calculateBalances(filtered));
  };

  // ===== CREATE =====
  const handleCreateGroup = async (list) => {
    const res = await createGroup({ users: list });

    const id = res.data.id;

    setUsers(list);
    setGroupId(id);
    setIsSetup(true);

    window.history.pushState({}, "", `?groupId=${id}`);
    loadData(id);
  };

  // ===== JOIN =====
  const handleJoinGroup = async (id) => {
    try {
      const res = await getGroup(id);

      setUsers(res.data.users);
      setGroupId(id);
      setIsSetup(true);

      window.history.pushState({}, "", `?groupId=${id}`);
      loadData(id);
    } catch {
      toast.error("Không tìm thấy nhóm ❌");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    await deleteExpense(id);
    const newData = expenses.filter((e) => e.id !== id);
    setExpenses(newData);
    setBalances(calculateBalances(newData));
  };

  // ===== RESET =====
  const reset = () => {
    setUsers([]);
    setExpenses([]);
    setIsSetup(false);
    setGroupId(null);
    setMode("home");
    window.history.pushState({}, "", "/");
  };

  // ===== BEFORE SETUP =====
  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {mode === "home" && (
          <div className="bg-white p-6 rounded-2xl shadow w-[300px] space-y-3 text-center">
            <button
              onClick={() => setMode("create")}
              className="w-full bg-indigo-500 text-white py-2 rounded"
            >
              Tạo nhóm
            </button>

            <button
              onClick={() => setMode("join")}
              className="w-full bg-gray-200 py-2 rounded"
            >
              Join nhóm
            </button>
          </div>
        )}

        {mode !== "home" && (
          <ParticipantSetup
            onDone={handleCreateGroup}
            onJoin={handleJoinGroup}
          />
        )}
      </div>
    );
  }

  // ===== MAIN UI =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Header groupId={groupId} onResetUsers={reset} />

        <ExpenseForm
          users={users}
          groupId={groupId}
          reload={() => loadData(groupId)}
        />

        <Transactions expenses={expenses} />

        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          users={users} // 🔥 FIX QUAN TRỌNG
        />

        <Summary balances={balances} />

        <Total expenses={expenses} />

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
}

export default App;