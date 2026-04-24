import axios from "axios";

const API = "https://69eb800f97482ad5c527c8ad.mockapi.io/danang";

export const getExpenses = () => axios.get(API);
export const addExpense = (data) => axios.post(API, data);
export const deleteExpense = (id) => axios.delete(`${API}/${id}`); // 👈 thêm dòng này