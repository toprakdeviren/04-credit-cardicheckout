function setupInputEffects(elements) {
  document.querySelectorAll('input[type="text"], input[type="number"], input[inputmode="numeric"]')
    .forEach(input => {
      input.addEventListener("focus", () => {
        if (input.getAttribute("aria-invalid") !== "true") {
          input.classList.add("ring-2", "ring-indigo-500");
        }
      });
      input.addEventListener("blur", () => {
        input.classList.remove("ring-indigo-500");
        if (input.getAttribute("aria-invalid") !== "true") {
          input.classList.remove("ring-2");
        }
      });
    });
}

function handleFormSubmit(e, elements, cardUI, validation) {
  e.preventDefault();
  elements.ui.successMsg.classList.add("hidden");
}

export function initializeEventHandlers($, elements, formatters, cardUI, validation, debouncedValidation) {
  const { name, number, expiry, cvc } = elements.inputs;

  const inputHandlers = {
    number: (e) => {
      const formatted = formatters.cardNumber(e.target.value);
      e.target.value = formatted;
      cardUI.updateNumberPreview(formatted);
      cardUI.updateCardBrand(formatted);
      debouncedValidation.number(number);
    },
    name: (e) => {
      const value = e.target.value.toUpperCase();
      e.target.value = value;
      elements.preview.name.textContent = value || "NAME SURNAME";
      debouncedValidation.name(name);
    },
    expiry: (e) => {
      const formatted = formatters.expiryDate(e.target.value);
      e.target.value = formatted;
      elements.preview.expiry.textContent = formatted || "MM/YY";
      debouncedValidation.expiry(expiry);
    },
    cvc: (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
      elements.preview.cvc.textContent = e.target.value.replace(/./g, "•") || "•••";
      debouncedValidation.cvc(cvc);
    }
  };

  number.addEventListener("input", inputHandlers.number);
  name.addEventListener("input", inputHandlers.name);
  expiry.addEventListener("input", inputHandlers.expiry);
  cvc.addEventListener("input", inputHandlers.cvc);

  cvc.addEventListener("focus", () => elements.ui.cardElement.classList.add("rotate-y-180"));
  cvc.addEventListener("blur", () => elements.ui.cardElement.classList.remove("rotate-y-180"));

  elements.form.addEventListener("submit", (e) => handleFormSubmit(e, elements, cardUI, validation));
  
  setupInputEffects(elements);
}
