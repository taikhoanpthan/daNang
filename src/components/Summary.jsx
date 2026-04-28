import { formatShortVND } from "../utils/format";

const roundVND = (value) => {
  const abs = Math.abs(value);
  const base = Math.floor(abs / 1000) * 1000;
  const remainder = abs % 1000;
  const rounded = remainder >= 500 ? base + 1000 : base;
  return value < 0 ? -rounded : rounded;
};

export default function Summary({ balances }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="font-bold mb-2">📊 Tổng kết</h3>

      {Object.entries(balances).map(([name, money]) => {
        const rounded = roundVND(money);

        return (
          <div key={name} className="flex justify-between py-1">
            <span>{name}</span>

            <span
              className={`font-semibold ${
                rounded > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {rounded > 0 ? "+" : ""}
              {formatShortVND(rounded)}
            </span>
          </div>
        );
      })}
    </div>
  );
}