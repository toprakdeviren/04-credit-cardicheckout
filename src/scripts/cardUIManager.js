export function generateCardUIManager(elements, detectCard) {
  const formatters = {
    cardNumber: v => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19),
    expiryDate: v => {
      const digits = v.replace(/\D/g, "").slice(0, 4);
      return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
  };

  const cardUI = {
    previousNumLength: 0,
    
    initNumberPreview() {
      elements.preview.number.innerHTML = [...("•••• •••• •••• ••••")]
        .map(char => `<span class="card-char">${char}</span>`)
        .join("");
      this.previousNumLength = 0;
    },
    
    updateNumberPreview(formattedValue) {
      const maxLength = 19;
      const chars = Array(maxLength).fill().map((_, i) => {
        const isSpace = (i + 1) % 5 === 0 && i < 15;
        const char = i >= formattedValue.length ? (isSpace ? " " : "•") : formattedValue[i];
        return `<span class="card-char">${char}</span>`;
      });
      
      elements.preview.number.innerHTML = chars.join("");
      
      if (formattedValue.length > this.previousNumLength && formattedValue.length <= maxLength) {
        const charSpans = elements.preview.number.children;
        const lastCharIndex = formattedValue.length - 1;
        
        if (charSpans[lastCharIndex]) {
          charSpans[lastCharIndex].classList.add("pulse");
          setTimeout(() => charSpans[lastCharIndex]?.classList.remove("pulse"), 300);
        }
      }
      
      this.previousNumLength = formattedValue.length;
    },
    
    updateCardBrand(number) {
      const digitsOnly = number.replace(/\s/g, "");
      const { prefix, icon, brand } = detectCard(digitsOnly);
      const visibility = digitsOnly ? "opacity-100" : "opacity-0";
      
      elements.ui.dynIcon.className = `text-2xl transition-opacity duration-300 ${visibility} text-indigo-400 ${prefix} ${icon}`;
      elements.preview.icon.className = `${prefix} ${icon} text-2xl`;
      elements.preview.brand.textContent = brand;
    },
    
    resetUI() {
      this.initNumberPreview();
      elements.preview.name.textContent = "NAME SURNAME";
      elements.preview.expiry.textContent = "MM/YY";
      elements.preview.cvc.textContent = "•••";
      
      const defaultCard = "fa-regular fa-credit-card";
      elements.ui.dynIcon.className = `text-2xl opacity-0 transition-all duration-300 ${defaultCard}`;
      elements.preview.icon.className = `${defaultCard} text-2xl`;
      elements.preview.brand.textContent = "CARD";
    }
  };

  return { formatters, cardUI };
}
