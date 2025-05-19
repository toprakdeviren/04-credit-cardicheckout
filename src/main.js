import { initializeApp, generatePayNow } from './scripts/index.js';

export const payNow = generatePayNow();

const app = initializeApp(() => {
  console.log('App initialized successfully');
});

app.payNow.onClick((err) => {
  if (!err) {
    app.payNow.showLoading();
    
    setTimeout(() => {
      app.payNow.hideLoading();
      app.payNow.showSuccess("Payment successful! Thank you for your purchase.");
      
      document.getElementById("paymentForm").reset();
      
      const container = document.querySelector("section");
      if (container) {
        container.classList.add("scale-[1.01]");
        setTimeout(() => container.classList.remove("scale-[1.01]"), 300);
      }
    }, 1500);
  } else {
    console.error("Payment validation failed:", err);
  }
});

export { initializeApp };
