import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "./services/api";
import { calculateBalances, simplifyDebts } from "./utils/calc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    setTransactions(simplifyDebts(balance));
  };

  // 🔥 DELETE XỊN HƠN
  const handleDelete = async (id) => {
    const newExpenses = expenses.filter((e) => e.id !== id);

    // update UI ngay
    updateAll(newExpenses);

    toast.info("Đang xoá...");

    try {
      await deleteExpense(id);
      toast.success("Đã xoá khoản chi 🗑️");
    } catch (err) {
      toast.error("Xoá thất bại ❌");
      loadData(); // rollback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Header />

        <ExpenseForm users={users} reload={loadData} />

        <ExpenseList expenses={expenses} onDelete={handleDelete} />

        <Summary balances={balances} />

        <Transactions transactions={transactions} />

        <Total expenses={expenses} />

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}

export default App;