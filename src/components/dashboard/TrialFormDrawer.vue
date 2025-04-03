<template>
  <v-layout>
    <v-navigation-drawer v-model="isVisible" temporary location="right" width="672" mobile>
      <v-toolbar flat>
        <v-toolbar-title>
          {{ title }}
          <code v-if="trial"> {{ trial.name }} </code>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="input-form">
          <InputField
            id="name"
            type="text"
            v-model="formData.name"
            label="Name"
            required
            clearable
          />

          <div class="input-group">
            <label for="tags">Tags</label>
            <TagsInput @update:tags="handleTagsUpdate" :initial-tags="formData.tags" />
          </div>

          <div class="input-group">
            <label for="description">Procedure</label>
            <RichTextInput
              v-model="formData.procedures"
              :initial-content="formData.procedures"
              placeholder="Procedure when producing the chip..."
            />
          </div>

          <div class="input-group">
            <label for="description">Notes</label>
            <RichTextInput
              v-model="formData.notes"
              :initial-content="formData.notes"
              placeholder="What was dropped and settings etc..."
            />
          </div>
        </div>

        <v-divider></v-divider>

        <div class="button-container">
          <button class="btn btn-outline" @click="handleClose" type="button">Cancel</button>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import RichTextInput from '@/components/testing/RichTextInput.vue'
import TagsInput from '@/components/testing/TagsInput.vue'
import InputField from '@/components/ui/InputField.vue'

export default {
  name: 'TrialFormDrawer',
  components: {
    TagsInput,
    RichTextInput,
    InputField,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    trial: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:visible', 'submit', 'close'],
  data() {
    return {
      formData: {
        name: '',
        tags: [],
        procedures: '',
        notes: '',
      },
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      },
    },
  },
  watch: {
    visible(newVal) {
      if (newVal && this.trial) {
        this.initializeForm()
      } else if (newVal) {
        this.resetForm()
      }
    },
  },
  methods: {
    initializeForm() {
      if (!this.trial) return

      this.formData = {
        name: this.trial.name || '',
        tags: [...(this.trial.tags || [])],
        procedures: this.trial.procedures || '',
        notes: this.trial.notes || '',
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        tags: [],
        procedures: '',
        notes: '',
      }
    },
    handleTagsUpdate(tags) {
      this.formData.tags = tags
    },
    handleSubmit() {
      if (!this.formData.name) {
        console.log('Name is required')
        return
      }

      this.$emit('submit', { ...this.formData })
      this.resetForm()
      this.isVisible = false
    },
    handleClose() {
      this.$emit('close')
      this.resetForm()
    },
  },
}
</script>

<style scoped>
.v-navigation-drawer {
  background-color: var(--color-background) !important;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-form {
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  padding: 6px 10px;
  gap: 8px;
}

label {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: var(--color-text-muted);
}
</style>
