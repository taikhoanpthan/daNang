export const formatVND = (number) => {
  const rounded = Math.round(number / 1000) * 1000; // làm tròn 1k
  return new Intl.NumberFormat("vi-VN").format(rounded);
};
export const formatShortVND = (amount) => {
  if (!amount) return "0đ";

  const abs = Math.abs(amount);

  if (abs >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(".0", "") + "tr";
  }

  if (abs >= 1_000) {
    return Math.round(amount / 1000) + "k";
  }

  return amount + "đ";
};