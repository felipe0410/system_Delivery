export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const formatNumber = (num: number) => {
  return num.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    style: "currency",
    currency: "COP",
  });
};
