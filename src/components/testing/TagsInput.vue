<template>
  <div class="w-full space-y-2">
    <div
      :class="[
        'flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-md border border-dashed border-input bg-background min-h-[40px] transition-colors',
        isFocused && 'border-foreground',
      ]"
    >
      <Badge v-for="(tag, index) in tags" :key="index" variant="default" class="gap-1 pl-3 pr-2">
        <span class="text-xs font-semibold">{{ tag }}</span>
        <button
          type="button"
          class="inline-flex items-center justify-center hover:bg-background/20 rounded-full p-0.5 transition-colors"
          @click="removeTag(index)"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>

      <input
        ref="inputField"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        class="flex-1 min-w-[120px] border-0 outline-none bg-transparent text-sm px-1 py-1 placeholder:text-muted-foreground placeholder:font-medium"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
        @keydown.tab.prevent="handleTab"
        @paste="handlePaste"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>

    <p v-if="error" class="text-xs text-destructive">
      {{ error }}
    </p>

    <p v-if="showHint && !error" class="text-xs text-muted-foreground">Press Enter to add a tag</p>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-vue-next'

export default {
  name: 'TagsInput',
  components: {
    Badge,
    X,
  },
  props: {
    initialTags: {
      type: Array,
      default: () => [],
    },
    maxTags: {
      type: Number,
      default: null,
    },
    minLength: {
      type: Number,
      default: 1,
    },
    maxLength: {
      type: Number,
      default: 50,
    },
    placeholder: {
      type: String,
      default: 'Add tags...',
    },
    allowDuplicates: {
      type: Boolean,
      default: false,
    },
    validator: {
      type: Function,
      default: null,
    },
    separator: {
      type: String,
      default: ',',
    },
    addSeparatorAsTags: {
      type: Boolean,
      default: true,
    },
    showHint: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:tags', 'tag-added', 'tag-removed', 'tags-cleared'],
  setup(props, { emit }) {
    const tags = ref([...props.initialTags])
    const inputValue = ref('')
    const error = ref('')
    const isFocused = ref(false)
    const inputField = ref(null)

    watch(
      () => props.initialTags,
      (newTags) => {
        tags.value = [...newTags]
      },
    )

    const addTag = () => {
      if (!inputValue.value.trim()) {
        return
      }

      const value = inputValue.value.trim()

      // Check for max tags
      if (props.maxTags !== null && tags.value.length >= props.maxTags) {
        error.value = `Maximum of ${props.maxTags} tags allowed`
        return
      }

      // Check for min and max length
      if (value.length < props.minLength) {
        error.value = `Tag must be at least ${props.minLength} characters`
        return
      }

      if (value.length > props.maxLength) {
        error.value = `Tag must be less than ${props.maxLength} characters`
        return
      }

      // Check for duplicates
      if (!props.allowDuplicates && tags.value.includes(value)) {
        error.value = 'Duplicate tags are not allowed'
        return
      }

      // Custom validation
      if (props.validator && !props.validator(value)) {
        error.value = 'Invalid tag format'
        return
      }

      // Add the tag
      tags.value.push(value)
      inputValue.value = ''
      error.value = ''

      // Emit the updated tags array
      emit('update:tags', [...tags.value])
      emit('tag-added', value, tags.value)

      // Focus back on the input
      setTimeout(() => {
        inputField.value?.focus()
      }, 0)
    }

    const removeTag = (index) => {
      const removedTag = tags.value[index]
      tags.value.splice(index, 1)
      error.value = ''

      emit('update:tags', [...tags.value])
      emit('tag-removed', removedTag, tags.value)

      // Focus the input after removing a tag
      setTimeout(() => {
        inputField.value?.focus()
      }, 0)
    }

    const handleBackspace = () => {
      // If input is empty and there are tags, remove the last tag on backspace
      if (!inputValue.value && tags.value.length > 0) {
        removeTag(tags.value.length - 1)
      }
    }

    const handleTab = (event) => {
      // Add tag on tab press also
      if (inputValue.value.trim()) {
        addTag()
      } else {
        // Allow normal tab behavior if input is empty
        event.preventDefault = false
      }
    }

    const handlePaste = (event) => {
      // Get pasted text
      const clipboardData = event.clipboardData || window.clipboardData
      const pastedText = clipboardData.getData('text')

      // Check if we should process it as multiple tags
      if (props.addSeparatorAsTags && pastedText.includes(props.separator)) {
        event.preventDefault()

        // Split by separator and add each as a tag
        const items = pastedText.split(props.separator)

        items.forEach((item) => {
          const trimmedItem = item.trim()
          if (trimmedItem) {
            inputValue.value = trimmedItem
            addTag()
          }
        })
      }
    }

    const clearTags = () => {
      tags.value = []
      error.value = ''
      emit('update:tags', [])
      emit('tags-cleared')
    }

    const focus = () => {
      inputField.value?.focus()
    }

    return {
      tags,
      inputValue,
      error,
      isFocused,
      inputField,
      addTag,
      removeTag,
      handleBackspace,
      handleTab,
      handlePaste,
      clearTags,
      focus,
    }
  },
}
</script>
