export const cx = (...classNames) => classNames.filter(Boolean).join(' ');

export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export function generateUrlSafeTitle(title) {
  // Convert the title to lowercase and replace spaces with dashes
  let urlSafeTitle = title.toLowerCase().replace(/\s+/g, '-');

  // Remove special characters and non-alphanumeric characters
  urlSafeTitle = urlSafeTitle.replace(/[^\w-]+/g, '');

  return urlSafeTitle;
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+\d{2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
  return phoneRegex.test(phone);
};

export const sortBlogs = (blogs) => {
  return blogs.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    // Compare dates in descending order
    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    } else {
      return 0;
    }
  });
};

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

export function cstDateTime() {
  // Create a Date object from the given string
  const date = new Date();
  // Adjust to CST (Central Standard Time) - UTC-6
  const cstDate = new Date(date.getTime() + 6 * 60 * 60 * 1000);
  // Log the dates in a specific format

  return cstDate;
}

export function cstDateTimeClient() {
  // Create a Date object from the given string
  const date = new Date();

  return date;
}
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
  const formattedTime = cstDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City', // Specify the time zone (CST)
  });

  return formattedTime;
}

export function getTotalFromItems(orderItems) {
  // Use reduce to sum up the 'total' field
  const totalAmount = orderItems?.reduce(
    (acc, orderItem) => acc + orderItem.quantity * orderItem.price,
    0
  );

  return totalAmount;
}

export function getQuantitiesFromItems(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
}

export function getOrderItemsQuantities(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems?.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
}

export const getCookiesName = () => {
  let cookieName = '';

  if (process.env.NODE_ENV === 'development') {
    cookieName = 'next-auth.csrf-token';
  }

  if (process.env.NODE_ENV === 'production') {
    cookieName = '__Host-next-auth.csrf-token';
  }

  return cookieName;
};

export const getSessionCookiesName = () => {
  let cookieName = '';

  if (process.env.NODE_ENV === 'development') {
    cookieName = 'next-auth.session-token';
  }

  if (process.env.NODE_ENV === 'production') {
    cookieName = '__Secure-next-auth.session-token';
  }

  return cookieName;
};

function getRandomChar(charset) {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset.charAt(randomIndex);
}

export function generateRandomPassword(length) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '!@#$%&*-_=+';

  let password = '';

  // Ensure at least one character from each category
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Fill the remaining length with random characters
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() *
        (lowercaseChars.length +
          uppercaseChars.length +
          numberChars.length +
          specialChars.length)
    );
    const randomChar =
      randomIndex < lowercaseChars.length
        ? lowercaseChars.charAt(randomIndex)
        : randomIndex < lowercaseChars.length + uppercaseChars.length
        ? uppercaseChars.charAt(randomIndex - lowercaseChars.length)
        : randomIndex <
          lowercaseChars.length + uppercaseChars.length + numberChars.length
        ? numberChars.charAt(
            randomIndex - lowercaseChars.length - uppercaseChars.length
          )
        : specialChars.charAt(
            randomIndex -
              lowercaseChars.length -
              uppercaseChars.length -
              numberChars.length
          );
    password += randomChar;
  }

  // Shuffle the password to make the order random
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
