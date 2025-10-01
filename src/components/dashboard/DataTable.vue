<script setup>
import { useRouter } from 'vue-router'
import { h, ref } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  ArrowUpDown,
  ChevronDown,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Tag,
  Trash2,
  FlaskConical,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

function valueUpdater(updaterOrValue, ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'delete', 'create'])

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags')
      return h(
        'div',
        { class: 'flex gap-1 flex-wrap' },
        tags.map((tag) => h(Badge, { variant: 'outline' }, () => tag)),
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const tags = row.getValue(columnId) || []
      if (!filterValue) return true
      return tags.some((tag) => tag.toLowerCase().includes(filterValue.toLowerCase()))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Created At', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return h('div', {}, formatDate(date))
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Updated At', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'))
      return h('div', {}, formatDate(date))
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(DropdownMenu, {}, () => [
        h(DropdownMenuTrigger, { asChild: true }, () =>
          h(
            Button,
            { variant: 'ghost', class: 'h-8 w-8 p-0', onClick: (e) => e.stopPropagation() },
            () => [
              h('span', { class: 'sr-only' }, 'Open menu'),
              h(MoreHorizontal, { class: 'h-4 w-4' }),
            ],
          ),
        ),
        h(DropdownMenuContent, { align: 'end', class: 'p-0' }, () => [
          h(
            DropdownMenuItem,
            {
              onClick: () => emit('edit', row.original),
              class: 'mx-1 mt-1 cursor-pointer',
            },
            () => [h(Edit, { class: 'mr-0.5 h-4 w-4' }), 'Edit'],
          ),
          h(
            DropdownMenuItem,
            {
              onClick: () => emit('inspect', row.original),
              class: 'mx-1 mt-1 cursor-pointer',
            },
            () => [h(Eye, { class: 'mr-0.5 h-4 w-4' }), 'Inspect'],
          ),
          h(Separator, { class: 'my-1' }, () => null),
          h(
            DropdownMenuItem,
            {
              onClick: () => emit('delete', row.original),
              variant: 'destructive',
              class: 'm-1 cursor-pointer',
            },
            () => [h(Trash2, { class: 'mr-0.5 h-4 w-4' }), 'Delete'],
          ),
        ]),
      ])
    },
  },
]

const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const expanded = ref({})
const filterType = ref('name')
const router = useRouter()
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date))
}

const table = useVueTable({
  get data() {
    return props.data
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),

  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, pagination),

  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get expanded() {
      return expanded.value
    },
    get pagination() {
      return pagination.value
    },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center py-4">
      <div class="flex items-center gap-2">
        <div class="relative max-w-sm">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            class="w-80 pl-8"
            :placeholder="
              filterType === 'name' ? 'Search by trial name..' : 'Search by trial tag..'
            "
            :model-value="
              filterType === 'name'
                ? table.getColumn('name')?.getFilterValue()
                : table.getColumn('tags')?.getFilterValue()
            "
            @update:model-value="
              filterType === 'name'
                ? table.getColumn('name')?.setFilterValue($event)
                : table.getColumn('tags')?.setFilterValue($event)
            "
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <FlaskConical v-if="filterType === 'name'" class="h-4 w-4" />
              <Tag v-else class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              @click="
                () => {
                  filterType = 'name'
                  table.getColumn('tags')?.setFilterValue('')
                }
              "
              class="cursor-pointer"
            >
              <FlaskConical class="mr-0.5 h-4 w-4" />
              By name
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="
                () => {
                  filterType = 'tag'
                  table.getColumn('name')?.setFilterValue('')
                }
              "
              class="cursor-pointer"
            >
              <Tag class="mr-0.5 h-4 w-4" />
              By tag
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto mr-2" size="sm">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
          <Button @click="emit('create')" size="sm"> Create New trial</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="
              (value) => {
                column.toggleVisibility(!!value)
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getPaginationRowModel().rows" :key="row.id">
              <TableRow
                :data-state="row.getIsSelected()"
                @click="router.push({ path: `trial/${row.original._id}` })"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        Showing {{ table.getPaginationRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} filtered row(s)
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
