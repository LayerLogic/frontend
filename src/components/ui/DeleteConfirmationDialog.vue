<template>
  <UiDialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="max-w-[400px]">
      <DialogHeader>
        <DialogTitle class="text-base">
          Confirm deletion of trial
          <code class="ml-1 text-sm"> "{{ itemName }}" ?</code>
        </DialogTitle>
      </DialogHeader>

      <div class="py-4">
        <p class="text-sm text-foreground">
          Are you sure you want to delete the selected trial?
          <br />
          This action cannot be undone.
        </p>
      </div>

      <DialogFooter class="gap-2 sm:gap-2">
        <UiButton variant="outline" @click="$emit('update:modelValue', false)"> Cancel </UiButton>
        <UiButton variant="destructive" @click="$emit('confirm')"> Delete </UiButton>
      </DialogFooter>
    </DialogContent>
  </UiDialog>
</template>

<script>
import {
  Dialog as UiDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button as UiButton } from '@/components/ui/button'

export default {
  name: 'DeleteConfirmationDialog',
  components: {
    UiDialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    UiButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    itemName: {
      type: String,
      default: 'this item',
    },
  },
  emits: ['update:modelValue', 'confirm'],
}
</script>
