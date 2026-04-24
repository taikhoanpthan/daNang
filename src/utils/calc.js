export const calculateBalances = (expenses) => {
  const balance = {};

  expenses.forEach((exp) => {
    const participants = Array.isArray(exp.participants)
      ? exp.participants
      : [];

    if (!exp.amount || !exp.payer || participants.length === 0) return;

    const share = exp.amount / participants.length;

    // tất cả đều trừ (kể cả người trả)
    participants.forEach((p) => {
      if (!balance[p]) balance[p] = 0;
      balance[p] -= share;
    });

    // người trả được cộng lại
    if (!balance[exp.payer]) balance[exp.payer] = 0;
    balance[exp.payer] += exp.amount;
  });

  return balance;
};

export const calculateTransactions = (expenses) => {
  const transactions = [];

  expenses.forEach((exp) => {
    const participants = Array.isArray(exp.participants)
      ? exp.participants
      : [];

    if (!exp.amount || !exp.payer || participants.length === 0) return;

    const share = exp.amount / participants.length;

    participants.forEach((p) => {
      if (p !== exp.payer) {
        transactions.push({
          from: p,
          to: exp.payer,
          amount: share,
          note: exp.note || "",
          date: exp.date || "",
        });
      }
    });
  });

  return transactions;
};
export const calculateTransactionsByExpense = (expenses) => {
  return expenses.map((exp) => {
    const participants = Array.isArray(exp.participants)
      ? exp.participants
      : [];

    if (!exp.amount || !exp.payer || participants.length === 0) return null;

    const share = exp.amount / participants.length;

    const list = participants
      .filter((p) => p !== exp.payer)
      .map((p) => ({
        from: p,
        to: exp.payer,
        amount: share,
      }));

    return {
      id: exp.id,
      note: exp.note || "Không rõ",
      payer: exp.payer,
      total: exp.amount,
      date: exp.date,
      transactions: list,
    };
  }).filter(Boolean);
};

export const simplifyDebts = (expenses) => {
  const balance = calculateBalances(expenses);

  const creditors = []; // người được nhận tiền
  const debtors = [];   // người phải trả

  // phân loại
  Object.keys(balance).forEach((person) => {
    const amount = parseFloat(balance[person].toFixed(2));

    if (amount > 0) {
      creditors.push({ person, amount });
    } else if (amount < 0) {
      debtors.push({ person, amount: -amount });
    }
  });

  const result = [];

  let i = 0; // debtor
  let j = 0; // creditor

  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];

    const payAmount = Math.min(debt.amount, credit.amount);

    result.push({
      from: debt.person,
      to: credit.person,
      amount: parseFloat(payAmount.toFixed(2)),
    });

    debt.amount -= payAmount;
    credit.amount -= payAmount;

    if (debt.amount === 0) i++;
    if (credit.amount === 0) j++;
  }

  return result;
};