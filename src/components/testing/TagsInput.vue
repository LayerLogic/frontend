<template>
  <div class="tag-input-container">
    <div class="tag-input-wrapper">
      <div class="tags-list">
        <div v-for="(tag, index) in tags" :key="index" class="tag">
          <span class="tag-text">{{ tag }}</span>
          <button type="button" class="tag-remove" @click="removeTag(index)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <input
        ref="inputField"
        type="text"
        v-model="inputValue"
        :placeholder="placeholder"
        class="tag-input"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
        @keydown.tab.prevent="handleTab"
        @paste="handlePaste"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="showHint" class="hint-text">Press Enter to add a tag</div>
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  props: {
    // Initial tags if any
    initialTags: {
      type: Array,
      default: () => [],
    },
    // Maximum number of tags allowed
    maxTags: {
      type: Number,
      default: null,
    },
    // Minimum tag length
    minLength: {
      type: Number,
      default: 1,
    },
    // Maximum tag length
    maxLength: {
      type: Number,
      default: 50,
    },
    // Placeholder text for the input
    placeholder: {
      type: String,
      default: 'Add tags...',
    },
    // Allow duplicate tags
    allowDuplicates: {
      type: Boolean,
      default: false,
    },
    // Custom validation function
    validator: {
      type: Function,
      default: null,
    },
    // Separator to use when pasting multiple tags
    separator: {
      type: String,
      default: ',',
    },
    // Add separator as tag
    addSeparatorAsTags: {
      type: Boolean,
      default: true,
    },
    // Show hint text
    showHint: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tags: [...this.initialTags],
      inputValue: '',
      error: '',
      isFocused: false,
    }
  },
  watch: {
    initialTags(newTags) {
      this.tags = [...newTags]
    },
  },
  methods: {
    addTag() {
      if (!this.inputValue.trim()) {
        return
      }

      const value = this.inputValue.trim()

      // Check for max tags
      if (this.maxTags !== null && this.tags.length >= this.maxTags) {
        this.error = `Maximum of ${this.maxTags} tags allowed`
        return
      }

      // Check for min and max length
      if (value.length < this.minLength) {
        this.error = `Tag must be at least ${this.minLength} characters`
        return
      }

      if (value.length > this.maxLength) {
        this.error = `Tag must be less than ${this.maxLength} characters`
        return
      }

      // Check for duplicates
      if (!this.allowDuplicates && this.tags.includes(value)) {
        this.error = 'Duplicate tags are not allowed'
        return
      }

      // Custom validation
      if (this.validator && !this.validator(value)) {
        this.error = 'Invalid tag format'
        return
      }

      // Add the tag
      this.tags.push(value)
      this.inputValue = ''
      this.error = ''

      // Emit the updated tags array
      this.$emit('update:tags', [...this.tags])
      this.$emit('tag-added', value, this.tags)

      // Focus back on the input
      this.$nextTick(() => {
        this.$refs.inputField.focus()
      })
    },

    removeTag(index) {
      const removedTag = this.tags[index]
      this.tags.splice(index, 1)
      this.error = ''

      this.$emit('update:tags', [...this.tags])
      this.$emit('tag-removed', removedTag, this.tags)

      // Focus the input after removing a tag
      this.$nextTick(() => {
        this.$refs.inputField.focus()
      })
    },

    handleBackspace() {
      // If input is empty and there are tags, remove the last tag on backspace
      if (!this.inputValue && this.tags.length > 0) {
        this.removeTag(this.tags.length - 1)
      }
    },

    handleTab(event) {
      // Add tag on tab press also
      if (this.inputValue.trim()) {
        this.addTag()
      } else {
        // Allow normal tab behavior if input is empty
        event.preventDefault = false
      }
    },

    handlePaste(event) {
      // Get pasted text
      const clipboardData = event.clipboardData || window.clipboardData
      const pastedText = clipboardData.getData('text')

      // Check if we should process it as multiple tags
      if (this.addSeparatorAsTags && pastedText.includes(this.separator)) {
        event.preventDefault()

        // Split by separator and add each as a tag
        const items = pastedText.split(this.separator)

        items.forEach((item) => {
          const trimmedItem = item.trim()
          if (trimmedItem) {
            this.inputValue = trimmedItem
            this.addTag()
          }
        })
      }
    },

    // Public method to clear all tags
    clearTags() {
      this.tags = []
      this.error = ''
      this.$emit('update:tags', [])
      this.$emit('tags-cleared')
    },

    // Public method to focus the input
    focus() {
      this.$refs.inputField.focus()
    },
  },
}
</script>

<style>
.tag-input-container {
  width: 100%;
}

.tag-input-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  min-height: 40px;
  transition: border-color 0.2s ease;
}

.tag-input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 25, 246, 0.1);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* on dark change background color */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 14px;
  max-width: 100%;
  background-color: var(--color-primary);
}

.tag-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: beige;
}

.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  color: beige;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 4px;
  color: var(--color-text);
}

.tag-input::placeholder {
  color: var(--color-text-muted);
}

.error-message {
  color: var(--color-warning);
  font-size: 12px;
  margin-top: 4px;
}

.hint-text {
  color: var(--color-text-muted);
  font-size: 12px;
  margin-top: 4px;
}
</style>
