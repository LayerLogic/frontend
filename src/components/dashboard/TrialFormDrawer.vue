<template>
  <v-layout>
    <v-navigation-drawer v-model="isVisible" temporary location="right" width="672" mobile>
      <v-toolbar flat>
        <v-toolbar-title>
          {{ title }}
          <code v-if="trial"> "{{ trial.name }}" </code>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <form @submit.prevent="handleSubmit" class="form" ref="form">
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
            <div class="title-container">
              <label for="tags">Tags</label>
              <div class="alert-container">
                <button class="btn btn-outline alert-btn" type="button" @click="dialog = true">
                  <v-icon>mdi-alert</v-icon>
                  Please read this before you start adding tags
                </button>
              </div>
            </div>
            <div>
              <TagsInput v-model="formData.tags" />
              <v-select
                class="default-tags-select"
                label="Or select from default tags"
                :items="tagChoices"
                multiple
                v-model="formData.tags"
              ></v-select>
            </div>
            <div class="dialog-container">
              <v-dialog v-model="dialog" width="auto">
                <v-card
                  max-width="1040"
                  prepend-icon="mdi-alert-outline"
                  title="How do I tag chips?"
                >
                  <p>
                    Here are some examples of tags that should be added when applicable. Always add
                    tags that make sense, even if there are many tags. So for example, all customer
                    chips should have both "Useful", "Customer", and "Negative" or "Positive".
                    <br />
                    <br />
                    Customer - For chips that are used for customer testing <br />
                    Listeria - For chips that we used to test for listeria in the lab <br />
                    Good - For chips that you think are good enough to use for bacterial testing
                    <br />
                    Bad - For chips that either broke, or for some other reason is not good enough
                    to use for bacterial testing. <br />
                    OK - for chips that you arent satisfied with, but might still be useful. <br />
                    KF/Leröy/MF/DC - If used at Kvalitetsfisk/Leröy/Magnussons Fisk/DirektChark
                    <br />
                    Negative - When the test looks negative after dropping bacteria <br />
                    Positive - When the test looks positive after dropping bacteria <br />
                    Unclear - When it is hard to say if the test is positive or negative <br />
                    Confirmed P - Another method has confirmed the test is positive <br />
                    Confirmed N - Another method has confirmed the test is negative <br />
                    <br />
                    If you carry out tests for example to get rid of histeresis in chips, please
                    make a new tag that makes sense, so in this example it could be "Histeresis
                    trials". If you do make a new tag, tell Mohammed so that he can add the
                    explanation into this text box.
                  </p>
                  <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
                  </template>
                </v-card>
              </v-dialog>
            </div>
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
import { ref } from 'vue'

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
      tagChoices: [
        "Customer","Listeria","Good","Bad","OK","KF","Leröy","MF","DC","Negative","Positive","Unclear","Confirmed P","Confirmed N"
      ],
      formData: {
        name: '',
        tags: [],
        procedures: '',
        notes: '',
      },
    }
  },
  setup() {
    const dialog = ref(false)
    return {
      dialog,
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
  box-shadow: var(--shadow-lg) !important;
  height: 100vh !important;
}

.v-navigation-drawer__scrim {
  background-color: var(--color-background) !important;
  opacity: 0.75 !important;
}

.v-navigation-drawer__content {
  display: flex !important;
}

.v-toolbar {
  background-color: var(--color-background) !important;
  border-bottom: 1px solid var(--color-border);
}

.v-toolbar-title {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
}

.form {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  margin-bottom: 60px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.default-tags-select {
  border-top: 1px solid var(--color-border);
  border-radius: 6px;
}

.default-tags-select:focus-within {
  border-color: var(--color-primary);
}

.dialog-container {
  position: relative;
  display: flex;
  align-items: start;
  gap: 8px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
  padding: 20px;
  gap: 8px;
}

label {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: var(--color-text-muted);
}
</style>
