<template>
  <div class="relative">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <UiButton
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-full justify-between"
        >
          <span v-if="selectedValues.length === 0" class="text-muted-foreground">
            Select tags...
          </span>
          <span v-else class="flex flex-wrap gap-1">
            <Badge v-for="item in selectedValues" :key="item" variant="secondary" class="mr-1">
              {{ item }}
            </Badge>
          </span>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </UiButton>
      </PopoverTrigger>
      <PopoverContent class="w-full p-0" align="start">
        <UiCommand>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="option"
                :value="option"
                @select="toggleOption(option)"
              >
                <Check
                  :class="[
                    'mr-2 h-4 w-4',
                    selectedValues.includes(option) ? 'opacity-100' : 'opacity-0',
                  ]"
                />
                {{ option }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </UiCommand>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Button as UiButton } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command as UiCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

export default {
  name: 'MultiSelect',
  components: {
    UiButton,
    Badge,
    Popover,
    PopoverContent,
    PopoverTrigger,
    UiCommand,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Check,
    ChevronsUpDown,
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const open = ref(false)
    const selectedValues = ref([...props.value])

    watch(
      () => props.value,
      (newValue) => {
        selectedValues.value = [...newValue]
      },
      { deep: true },
    )

    const toggleOption = (option) => {
      const index = selectedValues.value.indexOf(option)
      if (index > -1) {
        selectedValues.value.splice(index, 1)
      } else {
        selectedValues.value.push(option)
      }
      emit('update:value', [...selectedValues.value])
    }

    return {
      open,
      selectedValues,
      toggleOption,
    }
  },
}
</script>
