<template>
  <div
    class="flex flex-col border border-border rounded-md overflow-hidden transition-all duration-200 focus-within:border-primary"
  >
    <div
      ref="editor"
      class="flex-1 min-h-[200px] p-4 outline-none text-sm leading-relaxed overflow-y-auto empty:before:content-[attr(placeholder)] empty:before:text-gray-500 empty:before:opacity-60 empty:before:cursor-text [&_p]:m-0 [&_p]:mb-2"
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
