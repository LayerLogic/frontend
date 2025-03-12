<template>
  <div class="trail-layout">
    <header class="header">
      <h1>Create a new trail</h1>
      <h2>
        Here you can create a new trail. You can add multiple tests to the trail and save it to the
        database.
      </h2>
    </header>
    <form @submit.prevent="handleCreateTrail" class="content">
      <InputField
        id="name"
        type="text"
        v-model="name"
        label="Name"
        :required="true"
        :clearable="true"
        @input="handleNameUpdate($event)"
      />
      <div class="input-group">
        <label for="tags">Tags</label>
        <TagsInput @update:tags="handleTagsUpdate" />
      </div>
      <div class="input-group">
        <label for="description">Procedure</label>
        <RichTextInput placeholder="Procedure when producing the chip..." v-model="procedure" />
      </div>
      <div class="input-group">
        <label for="description">Notes</label>
        <RichTextInput placeholder="What was dropped and settings etc..." v-model="notes" />
      </div>
      <div class="button-container">
        <button class="btn btn-primary">Create trail</button>
      </div>
    </form>
  </div>
</template>

<script>
import RichTextInput from '@/components/testing/RichTextInput.vue'
import TagsInput from '@/components/testing/TagsInput.vue'
import InputField from '@/components/ui/InputField.vue'

export default {
  name: 'CreateTrailView',
  data() {
    return {
      name: '',
      tags: [],
      procedure: '',
      notes: '',
    }
  },
  components: {
    TagsInput,
    RichTextInput,
    InputField,
  },
  methods: {
    handleNameUpdate(event) {
      this.name = event.target.value
    },
    handleTagsUpdate(newTags) {
      this.tags = newTags
    },
    handleCreateTrail() {
      if (this.name === '') {
        console.log('Name is required')
        return
      }
      console.log('data', {
        name: this.name,
        tags: this.tags,
        procedure: this.procedure,
        notes: this.notes,
      })
    },
  },
}
</script>

<style scoped>
.trail-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 0px;
}

h1 {
  font-size: 24px;
  line-height: normal;
  color: var(--color-text);
}
h2 {
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: var(--color-text-muted);
}
.content {
  margin-top: 32px;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 32px;
}
label {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: var(--color-text-muted);
}
.name-input {
  width: 50%;
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 4px;
  color: var(--color-text);
}
.name-input:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 25, 246, 0.1);
}
.button-container {
  display: flex;
}
</style>
