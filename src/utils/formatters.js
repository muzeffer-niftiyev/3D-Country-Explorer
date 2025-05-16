export const formatPopulation = (population) => {
  if (population >= 1000000000) {
    return (population / 1000000000).toFixed(2) + " Billion";
  } else if (population >= 1000000) {
    return (population / 1000000).toFixed(2) + " Million";
  }
  return population;
};

export const formatArea = (area) => {
  if (area >= 1000000) {
    return (area / 1000000).toFixed(2) + " Million km²";
  }
  return area + " km²";
};

export const formatCurrency = (currency) => {
  const currencyEntry = Object.entries(currency);
  const formatted = currencyEntry.map(([code, { symbol }]) => ({
    code,
    symbol,
  }));

  return formatted;
};
