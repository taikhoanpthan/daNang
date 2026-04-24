export const calculateBalances = (expenses) => {
  const balance = {};

  expenses.forEach((exp) => {
    const share = exp.amount / exp.participants.length;

    // tất cả đều phải trả (kể cả payer)
    exp.participants.forEach((p) => {
      if (!balance[p]) balance[p] = 0;
      balance[p] -= share;
    });

    // người trả được cộng lại toàn bộ tiền đã trả
    if (!balance[exp.payer]) balance[exp.payer] = 0;
    balance[exp.payer] += exp.amount;
  });

  return balance;
};

export const simplifyDebts = (balances) => {
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([name, amount]) => {
    if (amount < 0) debtors.push({ name, amount });
    if (amount > 0) creditors.push({ name, amount });
  });

  const result = [];

  while (debtors.length && creditors.length) {
    let debtor = debtors[0];
    let creditor = creditors[0];

    const pay = Math.min(-debtor.amount, creditor.amount);

    result.push({
      from: debtor.name,
      to: creditor.name,
      amount: pay,
    });

    debtor.amount += pay;
    creditor.amount -= pay;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return result;
};