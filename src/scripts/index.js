import { $, debounce, luhnCheck, detectCard } from './helpers.js';
import { generateValidationSystems } from './validation.js';
import { generateCardUIManager } from './cardUIManager.js';
import { initializeEventHandlers } from './eventManager.js';

export function generatePayNow() {
  const submitBtn = $("#submitBtn");
  const loadingIndicator = $("#loadingIndicator");
  const successMsg = $("#formSuccess");
  
  if (!submitBtn) {
    console.error("Submit button not found in the DOM");
    return null;
  }

  return {
    onClick: (callback) => {
      submitBtn.addEventListener("click", (e) => {
        if (!e.detail || e.detail.programmatic !== true) return;
        callback(e.detail.error || null);
      });
    },
    showLoading: () => {
      loadingIndicator.classList.remove("opacity-0");
      submitBtn.disabled = true;
    },
    hideLoading: () => {
      loadingIndicator.classList.add("opacity-0");
      submitBtn.disabled = false;
    },
    showSuccess: (message = "Payment successful, thank you! 🎉") => {
      successMsg.textContent = message;
      successMsg.classList.remove("hidden");
    }
  };
}

export function initializeApp(callback) {
  const elements = {
    form: $("#paymentForm"),
    inputs: {
      name: $("#cardName"),
      number: $("#cardNumber"),
      expiry: $("#expiryDate"),
      cvc: $("#cvcCode")
    },
    preview: {
      icon: $("#previewIcon"),
      brand: $("#previewBrand"),
      number: $("#previewNumber"),
      name: $("#previewName"),
      expiry: $("#previewExp"),
      cvc: $("#previewCVC")
    },
    ui: {
      dynIcon: $("#dynamicCardIcon"),
      successMsg: $("#formSuccess"),
      submitBtn: $("#submitBtn"),
      loadingIndicator: $("#loadingIndicator"),
      cardElement: $("#cardElement"),
      statusAnnouncer: $("#statusAnnouncer")
    }
  };

  const { formatters, cardUI } = generateCardUIManager(elements, detectCard);
  const { validation, debouncedValidation } = generateValidationSystems($, elements, luhnCheck, debounce);

  cardUI.initNumberPreview();
  initializeEventHandlers($, elements, formatters, cardUI, validation, debouncedValidation);

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validation.validateAll();
    
    elements.ui.submitBtn.dispatchEvent(new CustomEvent("click", {
      detail: {
        programmatic: true,
        error: isValid ? null : new Error("Validation failed")
      }
    }));
    
    return false;
  });

  const inputFields = ['name', 'number', 'expiry', 'cvc'];
  inputFields.forEach(field => {
    elements.inputs[field].addEventListener('validationUpdated', (event) => {
      console.log(`[API Demo] Validation status for ${field === 'name' ? 'Card Name' : 
                 field === 'number' ? 'Card Number' : 
                 field === 'expiry' ? 'Expiry Date' : 'CVC'}:`,
                 event.detail.isValid, 'Message:', event.detail.message);
    });
  });
  
  if (typeof callback === 'function') {
    callback();
  }
  
  return {
    payNow: generatePayNow()
  };
}