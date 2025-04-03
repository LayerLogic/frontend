<template>
  <div class="form-input-container" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <div class="input-wrapper" :class="{ 'is-focused': isFocused }">
      <div v-if="$slots.prefix || prefixIcon" class="input-prefix">
        <slot name="prefix">
          <span v-if="prefixIcon" class="prefix-icon">
            <svg
              v-if="prefixIcon === 'search'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <svg
              v-else-if="prefixIcon === 'mail'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <svg
              v-else-if="prefixIcon === 'user'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <svg
              v-else-if="prefixIcon === 'lock'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
        </slot>
      </div>

      <input
        :id="id"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        :pattern="pattern"
        class="form-input"
        :class="{
          'with-prefix': $slots.prefix || prefixIcon,
          'with-suffix': $slots.suffix || suffixIcon,
          'is-disabled': disabled,
        }"
        @input="updateValue"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />

      <div v-if="clearable && modelValue" class="input-clear" @click="clearInput">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>

      <div v-else-if="$slots.suffix || suffixIcon" class="input-suffix">
        <slot name="suffix">
          <span v-if="suffixIcon" class="suffix-icon">
            <svg
              v-if="suffixIcon === 'calendar'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <svg
              v-else-if="suffixIcon === 'chevron-down'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </slot>
      </div>
    </div>

    <div v-if="error || helperText" class="input-footer">
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-else-if="helperText" class="helper-text">{{ helperText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) =>
        [
          'text',
          'password',
          'email',
          'number',
          'tel',
          'url',
          'search',
          'date',
          'time',
          'datetime-local',
          'month',
          'week',
          'color',
        ].includes(value),
    },
    placeholder: {
      type: String,
      default: '',
    },
    helperText: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    min: {
      type: [Number, String],
      default: null,
    },
    max: {
      type: [Number, String],
      default: null,
    },
    step: {
      type: [Number, String],
      default: null,
    },
    maxlength: {
      type: [Number, String],
      default: null,
    },
    pattern: {
      type: String,
      default: null,
    },
    prefixIcon: {
      type: String,
      default: '',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'focus', 'blur', 'clear', 'input'],
  data() {
    return {
      isFocused: false,
    }
  },
  methods: {
    updateValue(event) {
      let value = event.target.value

      // For number type, convert string to number
      if (this.type === 'number' && value !== '') {
        value = this.min !== null ? Math.max(Number(this.min), Number(value)) : Number(value)
        if (this.max !== null) {
          value = Math.min(Number(this.max), value)
        }
      }

      this.$emit('update:modelValue', value)
      this.$emit('input', event)
    },

    handleFocus(event) {
      this.isFocused = true
      this.$emit('focus', event)
    },

    handleBlur(event) {
      this.isFocused = false
      this.$emit('blur', event)
    },

    clearInput() {
      this.$emit('update:modelValue', '')
      this.$emit('clear')

      // Focus back on input after clearing
      this.$nextTick(() => {
        const input = document.getElementById(this.id)
        if (input) {
          input.focus()
        }
      })
    },
  },
}
</script>

<style>
.form-input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color 0.3s;
}

.required-indicator {
  color: var(--color-warning);
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.input-wrapper.is-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 25, 246, 0.1);
}

.has-error .input-wrapper {
  border-color: var(--color-warning);
}

.has-error .input-label {
  color: var(--color-warning);
}

.form-input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  width: 100%;
}

.form-input.with-prefix {
  padding-left: 8px;
}

.form-input.with-suffix {
  padding-right: 8px;
}

.form-input::placeholder {
  color: var(--color-text-muted, var(--vt-c-text-light-2));
  opacity: 0.7;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input.is-disabled {
  background-color: var(--color-background-mute);
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  color: var(--color-text-muted, var(--vt-c-text-light-2));
}

.input-prefix {
  padding-left: 12px;
}

.input-suffix {
  padding-right: 12px;
}

.prefix-icon,
.suffix-icon {
  display: flex;
  align-items: center;
}

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  color: var(--color-text-muted, var(--vt-c-text-light-2));
  opacity: 0.6;
  transition: opacity 0.2s;
}

.input-clear:hover {
  opacity: 1;
}

.input-footer {
  min-height: 20px;
  margin-top: 4px;
}

.error-message {
  color: var(--color-warning, #dc8b5a);
  font-size: 12px;
  margin: 0;
}

.helper-text {
  color: var(--color-text-muted, var(--vt-c-text-light-2));
  font-size: 12px;
  margin: 0;
}

/* Handle specific input types */
.form-input[type='color'] {
  padding: 2px 4px;
  cursor: pointer;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .input-wrapper {
    background-color: var(--color-background);
  }
}
</style>
