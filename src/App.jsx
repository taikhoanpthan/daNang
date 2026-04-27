import { useEffect, useState } from "react";
import {
  getExpenses,
  deleteExpense,
  getGroup,
  createGroup,
} from "./services/api";

import { calculateBalances } from "./utils/calc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ParticipantSetup from "./components/ParticipantSetup";
import FadeIn from "./components/FadeIn";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import Transactions from "./components/Transactions";
import Total from "./components/Total";
import GroupManager from "./components/GroupManager";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [users, setUsers] = useState([]);
  const [isSetup, setIsSetup] = useState(false);
  const [groupId, setGroupId] = useState(null);

  const [mode, setMode] = useState("home");

  // ===== LẤY groupId từ URL =====
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("groupId");

    if (id) {
      setGroupId(id);
      loadUsers(id);
    }
  }, []);

  // ===== LOAD USERS =====
  const loadUsers = async (id) => {
    try {
      const res = await getGroup(id);
      setUsers(res.data.users || []);
      setIsSetup(true);
    } catch {
      toast.error("Không tìm thấy nhóm ❌");
      setIsSetup(false);
    }
  };

  // ===== LOAD EXPENSE THEO GROUP =====
  const loadData = async () => {
    try {
      const res = await getExpenses();

      const filtered = res.data.filter(
        (e) => String(e.groupId) === String(groupId),
      );

      setExpenses(filtered);
      setBalances(calculateBalances(filtered));
    } catch {
      toast.error("Không tải được dữ liệu ❌");
    }
  };

  useEffect(() => {
    if (isSetup && groupId) {
      loadData();
    }
  }, [isSetup, groupId]);

  // ===== DELETE =====
  const handleDelete = async (id) => {
    const newData = expenses.filter((e) => e.id !== id);
    setExpenses(newData);
    setBalances(calculateBalances(newData));

    try {
      await deleteExpense(id);
      toast.success("Đã xoá 🗑️");
    } catch {
      toast.error("Xoá thất bại ❌");
      loadData();
    }
  };

  // ===== CREATE GROUP =====
  const handleCreateGroup = async (list) => {
    try {
      const res = await createGroup({ users: list });
      const newId = res.data.id;

      setUsers(list);
      setGroupId(newId);
      setIsSetup(true);

      window.history.pushState({}, "", `?groupId=${newId}`);

      toast.success("Tạo nhóm thành công 🎉");
    } catch {
      toast.error("Tạo nhóm thất bại ❌");
    }
  };

  // ===== JOIN GROUP =====
  const handleJoinGroup = async (id) => {
    try {
      const res = await getGroup(id);

      setUsers(res.data.users || []);
      setGroupId(id);
      setIsSetup(true);

      window.history.pushState({}, "", `?groupId=${id}`);
    } catch {
      toast.error("Nhóm không tồn tại ❌");
    }
  };

  // ===== RESET =====
  const handleResetUsers = () => {
    setUsers([]);
    setExpenses([]);
    setBalances({});
    setIsSetup(false);
    setGroupId(null);
    setMode("home");

    window.history.pushState({}, "", `/`);
  };

  // ===== CHƯA SETUP =====
  if (!isSetup || users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {mode === "home" && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4 text-center w-[320px]">
            <h2 className="text-lg font-bold">Chọn chế độ</h2>

            <button
              onClick={() => setMode("create")}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg"
            >
              ➕ Tạo nhóm
            </button>

            <button
              onClick={() => setMode("join")}
              className="w-full bg-gray-200 py-2 rounded-lg"
            >
              🔑 Tham gia nhóm
            </button>
          </div>
        )}

        {mode === "create" && (
          <ParticipantSetup
            onDone={handleCreateGroup}
            onJoin={handleJoinGroup}
          />
        )}
      </div>
    );
  }

  // ===== UI CHÍNH =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Header onResetUsers={handleResetUsers} groupId={groupId} />

        <ExpenseForm
          users={users}
          reload={loadData}
          groupId={groupId} // 🔥 QUAN TRỌNG
        />
        
        <Transactions expenses={expenses} />

        <ExpenseList expenses={expenses} onDelete={handleDelete} />

        <Summary balances={balances} />

        <Total expenses={expenses} />

        <GroupManager />

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}

export default App;

// ===== JOIN GROUP =====
function JoinGroup({ onJoin }) {
  const [id, setId] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4 w-[320px]">
      <h2 className="text-lg font-bold text-center">Nhập mã nhóm</h2>

      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="VD: 3"
        className="w-full border p-2 rounded-lg"
      />

      <button
        onClick={() => onJoin(id)}
        className="w-full bg-indigo-500 text-white py-2 rounded-lg"
      >
        Tham gia
      </button>
    </div>
  );
}
