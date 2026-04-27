import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "./services/api";
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

function App() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});

  const [users, setUsers] = useState([]);
  const [isSetup, setIsSetup] = useState(false);

  // LOAD USERS (chạy 1 lần)
  useEffect(() => {
    const saved = localStorage.getItem("users");

    if (saved) {
      const parsed = JSON.parse(saved);
      setUsers(parsed);
      setIsSetup(true);
    }
  }, []);

  // LOAD DATA (chỉ khi đã setup)
  useEffect(() => {
    if (isSetup) {
      loadData();
    }
  }, [isSetup]);

  const loadData = async () => {
    try {
      const res = await getExpenses();
      updateAll(res.data);
    } catch (err) {
      toast.error("Không tải được dữ liệu ❌");
    }
  };

  // UPDATE STATE
  const updateAll = (data) => {
    setExpenses(data);
    const balance = calculateBalances(data);
    setBalances(balance);
  };

  // DELETE
  const handleDelete = async (id) => {
    const newExpenses = expenses.filter((e) => e.id !== id);
    updateAll(newExpenses);

    try {
      await deleteExpense(id);
      toast.success("Đã xoá 🗑️");
    } catch (err) {
      toast.error("Xoá thất bại ❌");
      loadData();
    }
  };

  // ❗ CHẶN UI nếu chưa setup
  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ParticipantSetup
          onDone={(list) => {
            setUsers(list);
            setIsSetup(true);
          }}
        />
      </div>
    );
  }
  const handleResetUsers = () => {
    if (window.confirm("Bạn muốn tạo nhóm mới? Dữ liệu hiện tại sẽ mất ⚠️")) {
      localStorage.removeItem("users");
      setUsers([]);
      setIsSetup(false);
    }
  };
  // UI CHÍNH
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <FadeIn>
          <Header onResetUsers={handleResetUsers} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <ExpenseForm users={users} reload={loadData} />
        </FadeIn>

        <FadeIn delay={0.4}>
          <Transactions expenses={expenses} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ExpenseList expenses={expenses} onDelete={handleDelete}  users={users}/>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Summary balances={balances} />
        </FadeIn>

        <FadeIn delay={0.5}>
          <Total expenses={expenses} />
        </FadeIn>

        <ToastContainer position="top-center" autoClose={2000} limit={2} />
      </div>
    </div>
  );
}

export default App;
