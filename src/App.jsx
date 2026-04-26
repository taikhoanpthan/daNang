import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "./services/api";
import {
  calculateBalances,
  calculateTransactionsByExpense,
} from "./utils/calc";
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
  const [transactions, setTransactions] = useState([]);

  const users = ["Mỹ", "An", "Khương", "Đạt", "Dương"];

  const loadData = async () => {
    const res = await getExpenses();
    updateAll(res.data);
  };

  const updateAll = (data) => {
    setExpenses(data);

    const balance = calculateBalances(data);
    setBalances(balance);

    const grouped = calculateTransactionsByExpense(data);
    setTransactions(grouped);
  };

  const handleDelete = async (id) => {
    const newExpenses = expenses.filter((e) => e.id !== id);

    // update UI trước (optimistic UI)
    updateAll(newExpenses);

    try {
      await deleteExpense(id);
      toast.success("Đã xoá 🗑️");
    } catch (err) {
      toast.error("Xoá thất bại ❌");

      // rollback nếu fail
      loadData();
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
          <Transactions groups={transactions} />
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

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}

export default App;
