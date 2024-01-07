export const calculatePercentage = (oldPrice, price) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - (oldPrice / price) * 100).toFixed(0)
    : 0;
};

export const getPriceQueryParams = (queryParams, key, value) => {
  const hasValueInParam = queryParams.has(key);

  if (value && hasValueInParam) {
    queryParams.set(key, value);
  } else if (value) {
    queryParams.append(key, value);
  } else if (hasValueInParam) {
    queryParams.delete(key);
  }
  return queryParams;
};

export function formatDate(dateTimeString) {
  // Create a Date object from the given string
  const date = new Date(dateTimeString);

  // Adjust to CST (Central Standard Time) - UTC-6
  const cstDate = new Date(date.getTime() - 6 * 60 * 60 * 1000);

  // Format the date in the desired format
  const formattedDate = cstDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the time in the desired format
  const formattedTime = cstDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City', // Specify the time zone (CST)
  });

  return formattedDate;
}

export function formatTime(dateTimeString) {
  // Create a Date object from the given string
  const date = new Date(dateTimeString);

  // Adjust to CST (Central Standard Time) - UTC-6
  const cstDate = new Date(date.getTime() - 6 * 60 * 60 * 1000);

  // Format the time in the desired format
  const formattedTime = cstDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City', // Specify the time zone (CST)
  });

  return formattedTime;
}
