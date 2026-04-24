export const formatVND = (number) => {
  const rounded = Math.round(number / 1000) * 1000; // làm tròn 1k
  return new Intl.NumberFormat("vi-VN").format(rounded);
};