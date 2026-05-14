/* ============================================================
   validation.js — Validação de Formulários
   Atende o critério H4a-SI-G: validar os campos de formulário
   utilizando regras de negócio e lógica de programação.
   ============================================================ */

/**
 * Regras de validação reutilizáveis
 * Cada regra recebe o valor do campo e retorna:
 *   - true se válido
 *   - string com a mensagem de erro se inválido
 */
const Rules = {
  required(value) {
    if (!value || value.trim() === "") {
      return "Este campo é obrigatório.";
    }
    return true;
  },

  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return "Informe um e-mail válido.";
    }
    return true;
  },

  minLength(min) {
    return (value) => {
      if (value.length < min) {
        return `Deve ter pelo menos ${min} caracteres.`;
      }
      return true;
    };
  },

  maxLength(max) {
    return (value) => {
      if (value.length > max) {
        return `Deve ter no máximo ${max} caracteres.`;
      }
      return true;
    };
  },

  number(value) {
    if (isNaN(Number(value))) {
      return "Informe um número válido.";
    }
    return true;
  },

  positive(value) {
    if (Number(value) <= 0) {
      return "O valor deve ser positivo.";
    }
    return true;
  },

  range(min, max) {
    return (value) => {
      const n = Number(value);
      if (n < min || n > max) {
        return `O valor deve estar entre ${min} e ${max}.`;
      }
      return true;
    };
  },

  phone(value) {
    // Aceita formatos: (11) 99999-9999, 11999999999, etc.
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      return "Informe um telefone válido.";
    }
    return true;
  },

  date(value) {
    if (!value) return "Informe uma data válida.";
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return "Informe uma data válida.";
    }
    return true;
  },

  password(value) {
    if (value.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return true;
  },

  match(otherFieldId, otherFieldName = "campo") {
    return (value) => {
      const other = document.getElementById(otherFieldId);
      if (!other || value !== other.value) {
        return `Os valores do ${otherFieldName} não coincidem.`;
      }
      return true;
    };
  },
};

/**
 * Valida um campo aplicando uma lista de regras
 * @param {HTMLElement} field — input/select/textarea
 * @param {Array<Function>} rules — lista de funções de validação
 * @returns {boolean} — true se válido
 */
function validateField(field, rules) {
  const value = field.value;
  const group = field.closest(".input-group");
  let errorEl = group?.querySelector(".error-message");

  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      showError(field, group, errorEl, result);
      return false;
    }
  }

  clearError(field, group, errorEl);
  return true;
}

function showError(field, group, errorEl, message) {
  field.classList.add("is-invalid");
  if (group) group.classList.add("has-error");
  if (errorEl) errorEl.textContent = message;
}

function clearError(field, group, errorEl) {
  field.classList.remove("is-invalid");
  if (group) group.classList.remove("has-error");
  if (errorEl) errorEl.textContent = "";
}

/**
 * Valida um formulário completo com base em um schema
 * @param {HTMLFormElement} form
 * @param {Object} schema — { fieldId: [rules] }
 * @returns {boolean} — true se todos os campos válidos
 */
function validateForm(form, schema) {
  let allValid = true;

  for (const [fieldId, rules] of Object.entries(schema)) {
    const field = form.querySelector(`#${fieldId}`);
    if (!field) continue;

    const isValid = validateField(field, rules);
    if (!isValid) allValid = false;
  }

  return allValid;
}

/**
 * Aplica validação em tempo real (on blur) e na submissão
 * @param {string} formId
 * @param {Object} schema
 * @param {Function} onSubmit — callback chamado se o form for válido
 */
function setupFormValidation(formId, schema, onSubmit) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Validação on-blur para cada campo
  for (const [fieldId, rules] of Object.entries(schema)) {
    const field = form.querySelector(`#${fieldId}`);
    if (!field) continue;

    field.addEventListener("blur", () => validateField(field, rules));

    // Limpa erro ao digitar
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field, rules);
      }
    });
  }

  // Validação no submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm(form, schema)) {
      if (typeof onSubmit === "function") {
        onSubmit(form);
      }
    }
  });
}

// Expõe globalmente
window.Rules = Rules;
window.validateField = validateField;
window.validateForm = validateForm;
window.setupFormValidation = setupFormValidation;
