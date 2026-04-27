import axios from "axios";

const EXPENSE_API = "https://69eb800f97482ad5c527c8ad.mockapi.io/danang";
const GROUP_API = "https://69eb800f97482ad5c527c8ad.mockapi.io/group";

// ===== EXPENSE =====
export const getExpenses = () => axios.get(EXPENSE_API);

export const addExpense = (data) =>
  axios.post(EXPENSE_API, data);

export const deleteExpense = (id) =>
  axios.delete(`${EXPENSE_API}/${id}`);

// ===== GROUP =====
export const getGroup = (id) =>
  axios.get(`${GROUP_API}/${id}`);

export const createGroup = (data) =>
  axios.post(GROUP_API, data);

export const getAllGroups = () =>
  axios.get(GROUP_API);

export const deleteGroup = (id) =>
  axios.delete(`${GROUP_API}/${id}`);
export const deleteExpenseByGroupId = async (groupId) => {
  const res = await axios.get(EXPENSE_API);

  const items = res.data.filter(
    (e) => String(e.groupId) === String(groupId)
  );

  return Promise.all(
    items.map((item) =>
      axios.delete(`${EXPENSE_API}/${item.id}`)
    )
  );
};