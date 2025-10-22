'use client'
// @ts-ignore
import { useEditor, EditorContent } from '@tiptap/react'
// @ts-ignore
import StarterKit from '@tiptap/starter-kit'
// @ts-ignore
import Placeholder from '@tiptap/extension-placeholder'
// @ts-ignore
import TextAlign from '@tiptap/extension-text-align'
// @ts-ignore
import Underline from '@tiptap/extension-underline'
// @ts-ignore
import Link from '@tiptap/extension-link'
// @ts-ignore
import Image from '@tiptap/extension-image'
import { Button } from '@/components/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Code,
  Eye,
  Edit3,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content = '', onChange, placeholder = 'Start writing your post...' }: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prevent SSR issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        // Disable built-in extensions that we're configuring separately
        link: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
          <div className="text-sm text-gray-600">Loading editor...</div>
        </div>
        <div className="bg-white min-h-[200px] p-4 flex items-center justify-center">
          <div className="text-gray-500">Loading rich text editor...</div>
        </div>
      </div>
    )
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Insert image into editor
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Button
            variant={!isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
        {isPreviewMode && (
          <div className="text-sm text-gray-600">
            Preview Mode
          </div>
        )}
      </div>

      {/* Toolbar */}
      {!isPreviewMode && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-gray-200' : ''}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-200' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          >
            H3
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Images */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerImageUpload}
            disabled={isUploading}
            className="flex items-center gap-1"
          >
            {isUploading ? (
              <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <ImageIcon className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-gray-200' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeLink}
            disabled={!editor.isActive('link')}
          >
            Unlink
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        </div>
      )}

      {/* Editor Content or Preview */}
      <div className="bg-white">
        {isPreviewMode ? (
          <div className="min-h-[200px] p-4">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
}
