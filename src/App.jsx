import { useEffect, useState } from "react";
import { getExpenses } from "./services/api";
import { calculateBalances } from "./utils/calc";
import { simplifyDebts } from "./utils/calc";

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
    const data = res.data;

    setExpenses(data);

    const balance = calculateBalances(data);
    setBalances(balance);
    setTransactions(simplifyDebts(balance));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Header />

        <ExpenseForm users={users} reload={loadData} />

        <ExpenseList expenses={expenses} />

        <Summary balances={balances} />

        <Transactions transactions={transactions} />
        <Total expenses={expenses} />
      </div>
    </div>
  );
}

export default App;
