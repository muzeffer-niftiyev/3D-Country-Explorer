const numberFormat = new Intl.NumberFormat("en-US");
const compactFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const formatLargeNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  if (value >= 1_000_000_000) {
    return compactFormat.format(value / 1_000_000_000) + " Billion";
  }
  if (value >= 1_000_000) {
    return compactFormat.format(value / 1_000_000) + " Million";
  }
  return numberFormat.format(value);
};

export const formatPopulation = (population) =>
  formatLargeNumber(population) ?? "N/A";

export const formatArea = (area) => {
  const formatted = formatLargeNumber(area);
  return formatted ? `${formatted} km²` : "N/A";
};

export const formatCurrency = (currency = {}) =>
  Object.entries(currency).map(([code, { symbol }]) => ({
    code,
    symbol,
  }));
