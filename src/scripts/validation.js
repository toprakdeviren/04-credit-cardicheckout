export function generateValidationSystems($, elements, luhnCheck, debounce) {
  const validation = {
    validateInput(input, condition, message, errorElementId) {
      const isValid = condition();
      const errorElement = $(`#${errorElementId}`);
      const isEmpty = input.value.trim() === "";

      if (!isValid && !isEmpty) {
        input.setAttribute("aria-invalid", "true");
        input.classList.add("ring-red-500", "ring-2", "animate-shake");
        errorElement.textContent = message;
        errorElement.classList.remove("invisible");
        elements.ui.statusAnnouncer.textContent = `${input.getAttribute("aria-label")}: ${message}`;
        setTimeout(() => input.classList.remove("animate-shake"), 300);
      } else {
        input.removeAttribute("aria-invalid");
        input.classList.remove("ring-red-500", "ring-2");
        errorElement.classList.add("invisible");
      }

      input.dispatchEvent(new CustomEvent('validationUpdated', {
        detail: { isValid, message: isValid ? '' : message, inputId: input.id },
        bubbles: true
      }));

      return isValid;
    },

    validateName(input) {
      const value = input.value.trim();
      return this.validateInput(
        input,
        () => value.length >= 3 && /^[a-zA-Z\s.'-]+$/i.test(value),
        "Please enter a valid name (at least 3 letters).",
        "cardNameError"
      );
    },

    validateCardNumber(input) {
      const digitsOnly = input.value.replace(/\s/g, "");
      return this.validateInput(
        input,
        () => digitsOnly.length >= 13 && digitsOnly.length <= 19 && luhnCheck(digitsOnly),
        "Please enter a valid card number.",
        "cardNumberError"
      );
    },

    validateExpiry(input) {
      return this.validateInput(
        input,
        () => {
          if (input.value.length !== 5) return false;
          const [mmStr, yyStr] = input.value.split("/");
          const month = parseInt(mmStr, 10);
          const year = parseInt(yyStr, 10) + 2000;
          
          if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const expiryDate = new Date(year, month - 1, new Date(year, month, 0).getDate());
          return expiryDate >= today && year < today.getFullYear() + 20;
        },
        "Invalid or past date.",
        "expiryDateError"
      );
    },

    validateCVC(input) {
      return this.validateInput(
        input,
        () => input.value.length >= 3 && input.value.length <= 4,
        "CVC must be 3 or 4 digits.",
        "cvcCodeError"
      );
    },

    validateAll() {
      const { name, number, expiry, cvc } = elements.inputs;
      const isNameValid = this.validateName(name);
      const isCardNumValid = this.validateCardNumber(number);
      const isExpValid = this.validateExpiry(expiry);
      const isCvcValid = this.validateCVC(cvc);
      
      if (!isNameValid || !isCardNumValid || !isExpValid || !isCvcValid) {
        elements.ui.statusAnnouncer.textContent = "Please fill out the form correctly.";
        const firstInvalidInput = [name, number, expiry, cvc].find(
          input => input.getAttribute("aria-invalid") === "true"
        );
        if (firstInvalidInput) firstInvalidInput.focus();
        return false;
      }
      return true;
    },

    clearValidation() {
      Object.values(elements.inputs).forEach(input => {
        input.removeAttribute("aria-invalid");
        input.classList.remove("ring-red-500", "ring-2");
        const errorElement = $(`#${input.id}Error`);
        if (errorElement) errorElement.classList.add("invisible");
      });
    }
  };

  const debouncedValidation = {
    name: debounce((input) => validation.validateName(input), 300),
    number: debounce((input) => validation.validateCardNumber(input), 300),
    expiry: debounce((input) => validation.validateExpiry(input), 300),
    cvc: debounce((input) => validation.validateCVC(input), 300)
  };

  return { validation, debouncedValidation };
}
