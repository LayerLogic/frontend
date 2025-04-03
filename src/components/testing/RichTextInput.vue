<template>
  <div class="note-editor-container">
    <div
      ref="editor"
      class="note-editor"
      contenteditable="true"
      @input="handleInput"
      @focus="isEditorFocused = true"
      @blur="isEditorFocused = false"
      :placeholder="placeholder"
      v-html="initialContent"
      v-once
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SimpleNoteEditor',
  props: {
    initialContent: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Start writing your note...',
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    editorContent() {
      return this.$refs.editor ? this.$refs.editor.innerHTML : ''
    },
  },
  watch: {
    modelValue(newValue) {
      if (this.$refs.editor && this.$refs.editor.innerHTML !== newValue) {
        this.$refs.editor.innerHTML = newValue
      }
    },
  },
  data() {
    return {
      content: '',
      isEditorFocused: false,
    }
  },
  mounted() {
    if (this.initialContent) {
      this.$refs.editor.innerHTML = this.initialContent
      this.content = this.initialContent
    }
  },
  methods: {
    handleInput() {
      this.content = this.$refs.editor.innerHTML
      this.$emit('update:modelValue', this.content)
    },
  },
}
</script>

<style>
.note-editor-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.note-editor-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 25, 246, 0.1);
}

.note-editor {
  flex: 1;
  min-height: 200px;
  padding: 16px;
  outline: none;
  color: var(--color-text, #333);
  font-size: 16px;
  line-height: 1.6;
  overflow-y: auto;
}

.note-editor:empty:before {
  content: attr(placeholder);
  color: var(--color-text-muted);
  opacity: 0.6;
  cursor: text;
}

.note-editor p {
  margin: 0 0 0.5em 0;
}
</style>
