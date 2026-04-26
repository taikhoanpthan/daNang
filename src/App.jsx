import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "./services/api";
import { calculateBalances } from "./utils/calc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const users = ["Mỹ", "An", "Khương", "Đạt", "Dương"];

  // LOAD DATA
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

  // DELETE (optimistic UI)
  const handleDelete = async (id) => {
    const newExpenses = expenses.filter((e) => e.id !== id);

    updateAll(newExpenses);

    try {
      await deleteExpense(id);
      toast.success("Đã xoá 🗑️");
    } catch (err) {
      toast.error("Xoá thất bại ❌");
      loadData(); // rollback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <FadeIn>
          <Header />
        </FadeIn>

        <FadeIn delay={0.1}>
          <ExpenseForm users={users} reload={loadData} />
        </FadeIn>

        <FadeIn delay={0.4}>
          <Transactions expenses={expenses} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        </FadeIn>

        <FadeIn delay={0.3}>
          <Summary balances={balances} />
        </FadeIn>

        <FadeIn delay={0.5}>
          <Total expenses={expenses} />
        </FadeIn>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          limit={2}
        />
      </div>
    </div>
  );
}

export default App;