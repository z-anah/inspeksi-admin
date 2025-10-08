<script setup>
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import {
  EditorContent,
  useEditor,
} from '@tiptap/vue-3'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref()

// Header options for dropdown
const headerOptions = [
  { title: 'Paragraph', value: 'paragraph', icon: 'tabler-typography' },
  { title: 'Heading 1', value: 'h1', icon: 'tabler-h-1' },
  { title: 'Heading 2', value: 'h2', icon: 'tabler-h-2' },
  { title: 'Heading 3', value: 'h3', icon: 'tabler-h-3' },
]

// List options for dropdown
const listOptions = [
  { title: 'Bullet List', value: 'bulletList', icon: 'tabler-list' },
  { title: 'Numbered List', value: 'orderedList', icon: 'tabler-list-numbers' },
]

// Text alignment options for dropdown
const alignmentOptions = [
  { title: 'Align Left', value: 'left', icon: 'tabler-align-left' },
  { title: 'Align Center', value: 'center', icon: 'tabler-align-center' },
  { title: 'Align Right', value: 'right', icon: 'tabler-align-right' },
  { title: 'Justify', value: 'justify', icon: 'tabler-align-justified' },
]

// Get current active header type
const getCurrentHeaderType = () => {
  if (!editor.value) return 'paragraph'
  if (editor.value.isActive('heading', { level: 1 })) return 'h1'
  if (editor.value.isActive('heading', { level: 2 })) return 'h2'
  if (editor.value.isActive('heading', { level: 3 })) return 'h3'
  return 'paragraph'
}

// Get current active list type
const getCurrentListType = () => {
  if (!editor.value) return null
  if (editor.value.isActive('bulletList')) return 'bulletList'
  if (editor.value.isActive('orderedList')) return 'orderedList'
  return null
}

// Get current text alignment
const getCurrentAlignment = () => {
  if (!editor.value) return 'left'
  if (editor.value.isActive({ textAlign: 'center' })) return 'center'
  if (editor.value.isActive({ textAlign: 'right' })) return 'right'
  if (editor.value.isActive({ textAlign: 'justify' })) return 'justify'
  return 'left'
}

const selectedHeaderType = ref('paragraph')
const selectedListType = ref(null)
const selectedAlignment = ref('left')

// Apply header format
const applyHeaderFormat = (type) => {
  if (!editor.value) return

  switch (type) {
    case 'h1':
      editor.value.chain().focus().toggleHeading({ level: 1 }).run()
      break
    case 'h2':
      editor.value.chain().focus().toggleHeading({ level: 2 }).run()
      break
    case 'h3':
      editor.value.chain().focus().toggleHeading({ level: 3 }).run()
      break
    default:
      editor.value.chain().focus().setParagraph().run()
  }
  selectedHeaderType.value = type
}

// Apply list format
const applyListFormat = (type) => {
  if (!editor.value) return

  switch (type) {
    case 'bulletList':
      editor.value.chain().focus().toggleBulletList().run()
      break
    case 'orderedList':
      editor.value.chain().focus().toggleOrderedList().run()
      break
  }
  selectedListType.value = getCurrentListType()
}

// Apply text alignment
const applyAlignment = (alignment) => {
  if (!editor.value) return
  editor.value.chain().focus().setTextAlign(alignment).run()
  selectedAlignment.value = alignment
}

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: [
        'heading',
        'paragraph',
      ],
    }),
    Placeholder.configure({ placeholder: props.placeholder ?? 'Write something here...' }),
    Underline,
  ],
  onUpdate() {
    if (!editor.value)
      return
    emit('update:modelValue', editor.value.getHTML())
    selectedHeaderType.value = getCurrentHeaderType()
    selectedListType.value = getCurrentListType()
    selectedAlignment.value = getCurrentAlignment()
  },
  onSelectionUpdate() {
    selectedHeaderType.value = getCurrentHeaderType()
    selectedListType.value = getCurrentListType()
    selectedAlignment.value = getCurrentAlignment()
  },
})

watch(() => props.modelValue, () => {
  const isSame = editor.value?.getHTML() === props.modelValue
  if (isSame)
    return
  editor.value?.commands.setContent(props.modelValue)
})
</script>

<template>
  <div class="pa-6 productDescriptionEditor">
    <!-- buttons -->
    <div v-if="editor" class="d-flex gap-1 flex-wrap align-center">
      <!-- Header Dropdown -->
      <VTooltip text="Text formatting (Paragraph, Headings)">
        <template #activator="{ props: tooltipProps }">
          <VMenu>
            <template #activator="{ props: menuProps }">
              <VBtn v-bind="{ ...menuProps, ...tooltipProps }" size="small" variant="outlined" class="text-none">
                <VIcon :icon="headerOptions.find(opt => opt.value === selectedHeaderType)?.icon || 'tabler-typography'"
                  start />
                <VIcon icon="tabler-chevron-down" end size="16" />
              </VBtn>
            </template>
            <VList>
              <VListItem v-for="option in headerOptions" :key="option.value"
                :active="selectedHeaderType === option.value" @click="applyHeaderFormat(option.value)">
                <template #prepend>
                  <VIcon :icon="option.icon" />
                </template>
                <VListItemTitle>{{ option.title }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </template>
      </VTooltip>

      <VDivider vertical class="mx-2" />

      <!-- Text formatting buttons -->
      <VTooltip text="Bold (Ctrl+B)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded :variant="editor.isActive('bold') ? 'tonal' : 'text'"
            :color="editor.isActive('bold') ? 'primary' : 'default'" @click="editor.chain().focus().toggleBold().run()">
            <VIcon icon="tabler-bold" class="font-weight-medium" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Italic (Ctrl+I)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded :variant="editor.isActive('italic') ? 'tonal' : 'text'"
            :color="editor.isActive('italic') ? 'primary' : 'default'"
            @click="editor.chain().focus().toggleItalic().run()">
            <VIcon icon="tabler-italic" class="font-weight-medium" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Underline (Ctrl+U)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded
            :variant="editor.isActive('underline') ? 'tonal' : 'text'"
            :color="editor.isActive('underline') ? 'primary' : 'default'" @click="editor.commands.toggleUnderline()">
            <VIcon icon="tabler-underline" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Strikethrough">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded :variant="editor.isActive('strike') ? 'tonal' : 'text'"
            :color="editor.isActive('strike') ? 'primary' : 'default'"
            @click="editor.chain().focus().toggleStrike().run()">
            <VIcon icon="tabler-strikethrough" size="20" />
          </VBtn>
        </template>
      </VTooltip>

      <VDivider vertical class="mx-2" />

      <!-- List formatting dropdown -->
      <VTooltip text="Lists (Bullet, Numbered)">
        <template #activator="{ props: tooltipProps }">
          <VMenu>
            <template #activator="{ props: menuProps }">
              <VBtn v-bind="{ ...menuProps, ...tooltipProps }" size="small" variant="outlined" class="text-none">
                <VIcon
                  :icon="selectedListType ? listOptions.find(opt => opt.value === selectedListType)?.icon : 'tabler-list'"
                  start />
                <VIcon icon="tabler-chevron-down" end size="16" />
              </VBtn>
            </template>
            <VList>
              <VListItem v-for="option in listOptions" :key="option.value" :active="selectedListType === option.value"
                @click="applyListFormat(option.value)">
                <template #prepend>
                  <VIcon :icon="option.icon" />
                </template>
                <VListItemTitle>{{ option.title }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </template>
      </VTooltip>

      <VDivider vertical class="mx-2" />

      <!-- Special formatting -->
      <VTooltip text="Quote block">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded
            :variant="editor.isActive('blockquote') ? 'tonal' : 'text'"
            :color="editor.isActive('blockquote') ? 'primary' : 'default'"
            @click="editor.chain().focus().toggleBlockquote().run()">
            <VIcon icon="tabler-quote" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Inline code">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded :variant="editor.isActive('code') ? 'tonal' : 'text'"
            :color="editor.isActive('code') ? 'primary' : 'default'" @click="editor.chain().focus().toggleCode().run()">
            <VIcon icon="tabler-code" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Code block">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded
            :variant="editor.isActive('codeBlock') ? 'tonal' : 'text'"
            :color="editor.isActive('codeBlock') ? 'primary' : 'default'"
            @click="editor.chain().focus().toggleCodeBlock().run()">
            <VIcon icon="tabler-code-dots" />
          </VBtn>
        </template>
      </VTooltip>

      <VDivider vertical class="mx-2" />

      <!-- Text alignment dropdown -->
      <VTooltip text="Text alignment">
        <template #activator="{ props: tooltipProps }">
          <VMenu>
            <template #activator="{ props: menuProps }">
              <VBtn v-bind="{ ...menuProps, ...tooltipProps }" size="small" variant="outlined" class="text-none">
                <VIcon
                  :icon="alignmentOptions.find(opt => opt.value === selectedAlignment)?.icon || 'tabler-align-left'"
                  start />
                <VIcon icon="tabler-chevron-down" end size="16" />
              </VBtn>
            </template>
            <VList>
              <VListItem v-for="option in alignmentOptions" :key="option.value"
                :active="selectedAlignment === option.value" @click="applyAlignment(option.value)">
                <template #prepend>
                  <VIcon :icon="option.icon" />
                </template>
                <VListItemTitle>{{ option.title }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </template>
      </VTooltip>

      <VDivider vertical class="mx-2" />

      <!-- Additional formatting -->
      <VTooltip text="Horizontal line">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded
            @click="editor.chain().focus().setHorizontalRule().run()">
            <VIcon icon="tabler-separator-horizontal" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Line break (Shift+Enter)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded @click="editor.chain().focus().setHardBreak().run()">
            <VIcon icon="tabler-corner-down-left" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Undo (Ctrl+Z)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()">
            <VIcon icon="tabler-arrow-back-up" />
          </VBtn>
        </template>
      </VTooltip>

      <VTooltip text="Redo (Ctrl+Y)">
        <template #activator="{ props: tooltipProps }">
          <VBtn v-bind="tooltipProps" size="small" icon rounded @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()">
            <VIcon icon="tabler-arrow-forward-up" />
          </VBtn>
        </template>
      </VTooltip>
    </div>

    <VDivider class="my-4" />

    <EditorContent ref="editorRef" :editor="editor" />
  </div>
</template>

<style lang="scss">
.productDescriptionEditor {
  .ProseMirror {
    padding: 0 !important;
    min-block-size: 12vh;

    p {
      margin-block-end: 0;
    }

    p.is-editor-empty:first-child::before {
      block-size: 0;
      color: #adb5bd;
      content: attr(data-placeholder);
      float: inline-start;
      pointer-events: none;
    }

    &-focused {
      outline: none;
    }

    // Style for lists
    ul,
    ol {
      padding-left: 1.5rem;
      margin: 1rem 0;
    }

    // Style for blockquotes
    blockquote {
      border-left: 4px solid rgba(var(--v-theme-primary));
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    }

    // Style for code
    code {
      background-color: rgba(var(--v-theme-on-surface), 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }

    // Style for code blocks
    pre {
      background-color: rgba(var(--v-theme-on-surface), 0.05);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
        font-family: 'JetBrains Mono', 'Monaco', 'Consolas', monospace;
      }
    }

    // Style for horizontal rule
    hr {
      border: none;
      border-top: 2px solid rgba(var(--v-theme-on-surface), 0.1);
      margin: 2rem 0;
    }

    // Style for headings
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 1.5rem 0 1rem 0;
      font-weight: 600;
      line-height: 1.3;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }
  }
}
</style>
