<template>
  <Sheet :open="visible" @update:open="handleOpenChange">
    <SheetContent side="right" class="w-full sm:max-w-[472px] flex flex-col">
      <SheetHeader class="border-b pb-4">
        <SheetTitle class="text-base font-medium">
          {{ title }}
          <code v-if="trial" class="ml-2 text-sm"> "{{ trial.name }}" </code>
        </SheetTitle>
      </SheetHeader>

      <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 overflow-y-auto">
        <div class="flex-1 flex flex-col gap-6 px-5 py-2.5 mb-[80px]">
          <!-- Name Input -->
          <div class="flex flex-col gap-1.5">
            <UiLabel for="name">Name</UiLabel>
            <UiInput
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Enter name..."
            />
          </div>

          <!-- Tags Input -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <UiLabel for="tags">Tags</UiLabel>
              <UiButton
                type="button"
                variant="outline"
                size="sm"
                class="h-8 gap-2"
                @click="dialog = true"
              >
                <AlertCircleIcon class="h-4 w-4" />
                Please read this before you start adding tags
              </UiButton>
            </div>

            <TagsInput :initial-tags="formData.tags" @update:tags="handleTagsUpdate" />

            <div class="">
              <UiLabel class="text-sm text-muted-foreground mb-2 block pt-2">
                Or select from default tags
              </UiLabel>
              <MultiSelect
                :options="tagChoices"
                :value="selectTags"
                @update:value="handleSelectTagsUpdate"
              />
            </div>
          </div>

          <!-- Procedure -->
          <div class="flex flex-col gap-1.5">
            <UiLabel for="procedures">Procedure</UiLabel>
            <UiTextarea
              id="procedures"
              v-model="formData.procedures"
              placeholder="Procedure when producing the chip..."
              class="min-h-[120px]"
            />
          </div>

          <!-- Notes -->
          <div class="flex flex-col gap-1.5">
            <UiLabel for="notes">Notes</UiLabel>
            <UiTextarea
              id="notes"
              v-model="formData.notes"
              placeholder="What was dropped and settings etc..."
              class="min-h-[120px]"
            />
          </div>
        </div>

        <!-- Button Container -->
        <div
          class="absolute bottom-0 left-0 right-0 flex justify-end gap-2 border-t bg-background p-5"
        >
          <UiButton type="button" variant="outline" @click="handleClose"> Cancel </UiButton>
          <UiButton type="submit">Save</UiButton>
        </div>
      </form>
    </SheetContent>
  </Sheet>

  <!-- Dialog -->
  <UiDialog :open="dialog" @update:open="(val) => (dialog = val)">
    <DialogContent class="max-w-[1040px]">
      <DialogHeader>
        <div class="flex items-center gap-2">
          <AlertCircleIcon class="h-5 w-5" />
          <DialogTitle>How do I tag chips?</DialogTitle>
        </div>
      </DialogHeader>
      <div class="py-4 text-sm leading-relaxed">
        <p>
          Here are some examples of tags that should be added when applicable. Always add tags that
          make sense, even if there are many tags. So for example, all customer chips should have
          both "Useful", "Customer", and "Negative" or "Positive".
        </p>
        <br />
        <p>
          <strong>Customer</strong> - For chips that are used for customer testing <br />
          <strong>Listeria</strong> - For chips that we used to test for listeria in the lab <br />
          <strong>Good</strong> - For chips that you think are good enough to use for bacterial
          testing <br />
          <strong>Bad</strong> - For chips that either broke, or for some other reason is not good
          enough to use for bacterial testing. <br />
          <strong>OK</strong> - for chips that you arent satisfied with, but might still be useful.
          <br />
          <strong>KF/Leröy/MF/DC</strong> - If used at Kvalitetsfisk/Leröy/Magnussons
          Fisk/DirektChark <br />
          <strong>Negative</strong> - When the test looks negative after dropping bacteria <br />
          <strong>Positive</strong> - When the test looks positive after dropping bacteria <br />
          <strong>Unclear</strong> - When it is hard to say if the test is positive or negative
          <br />
          <strong>Confirmed P</strong> - Another method has confirmed the test is positive <br />
          <strong>Confirmed N</strong> - Another method has confirmed the test is negative <br />
        </p>
        <br />
        <p>
          If you carry out tests for example to get rid of histeresis in chips, please make a new
          tag that makes sense, so in this example it could be "Histeresis trials". If you do make a
          new tag, tell Mohammed so that he can add the explanation into this text box.
        </p>
      </div>
      <DialogFooter>
        <UiButton @click="dialog = false">Ok</UiButton>
      </DialogFooter>
    </DialogContent>
  </UiDialog>
</template>

<script>
import { ref } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Dialog as UiDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { AlertCircle as AlertCircleIcon } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import TagsInput from '@/components/testing/TagsInput.vue'
import MultiSelect from '@/components/ui/MultiSelect.vue'

export default {
  name: 'FormDrawer',
  components: {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    UiDialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    UiButton,
    UiInput,
    UiLabel,
    UiTextarea,
    AlertCircleIcon,
    TagsInput,
    MultiSelect,
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
        'Customer',
        'Listeria',
        'Good',
        'Bad',
        'OK',
        'KF',
        'Leröy',
        'MF',
        'DC',
        'Negative',
        'Positive',
        'Unclear',
        'Confirmed P',
        'Confirmed N',
      ],
      selectTags: [],
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
    handleOpenChange(value) {
      this.$emit('update:visible', value)
    },
    initializeForm() {
      if (!this.trial) return

      this.formData = {
        name: this.trial.name || '',
        tags: [...(this.trial.tags || [])],
        procedures: this.trial.procedures || '',
        notes: this.trial.notes || '',
      }
      this.selectTags = this.trial.tags.filter((tag) => this.tagChoices.includes(tag))
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
      this.$emit('update:visible', false)
    },
    handleTagsUpdate(tags) {
      this.formData.tags = tags
      // Update selectTags to maintain sync with tags that are in tagChoices
      this.selectTags = tags.filter((tag) => this.tagChoices.includes(tag))
    },
    handleSelectTagsUpdate(tags) {
      let updatedTags = [...this.formData.tags]

      updatedTags = updatedTags.filter(
        (tag) => !this.tagChoices.includes(tag) || tags.includes(tag),
      )

      tags.forEach((tag) => {
        if (!updatedTags.includes(tag)) {
          updatedTags.push(tag)
        }
      })

      this.formData.tags = updatedTags
    },
    handleClose() {
      this.$emit('close')
      this.resetForm()
    },
  },
}
</script>
