export const $ = (s, ctx = document) => ctx.querySelector(s);

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const luhnCheck = (num) => {
  const digits = num.replace(/\s/g, "");
  return [...digits]
    .reverse()
    .reduce((sum, digit, i) => {
      let n = parseInt(digit, 10);
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      return sum + n;
    }, 0) % 10 === 0;
};

export const detectCard = (n) => {
  const sanitized = n.replace(/\s/g, "");
  const cardTypes = [
    { pattern: /^4/, brand: "VISA", icon: "fa-cc-visa", prefix: "fa-brands" },
    { pattern: /^(5[1-5]|2[2-7])/, brand: "MASTERCARD", icon: "fa-cc-mastercard", prefix: "fa-brands" },
    { pattern: /^3[47]/, brand: "AMEX", icon: "fa-cc-amex", prefix: "fa-brands" },
    { pattern: /^6(?:011|5)/, brand: "DISCOVER", icon: "fa-cc-discover", prefix: "fa-brands" }
  ];
  return cardTypes.find(card => card.pattern.test(sanitized)) || 
         { brand: "CARD", icon: "fa-credit-card", prefix: "fa-regular" };
};
