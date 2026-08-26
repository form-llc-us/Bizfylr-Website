"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Youtube from "@tiptap/extension-youtube";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { common } from "lowlight";
import { Code2, Heading1, Heading2, ImagePlus, Link2, List, ListOrdered, Minus, PilcrowSquare, Play, Quote, Table2 } from "lucide-react";
import type { JSONContent } from "@tiptap/core";

import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

type SlashCommand = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export function Editor({
  initialContent,
  onChange,
}: {
  initialContent: JSONContent;
  onChange: (value: { json: JSONContent; html: string; plainText: string }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashOpen, setSlashOpen] = useState(false);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/blog/upload", {
      method: "POST",
      headers: { "X-Bizfylr-CSRF": "1" },
      body: formData
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      throw new Error(payload.message || "Unable to upload image.");
    }

    return (await response.json()) as { url: string; alt: string };
  }

  const editor = useEditor({
    immediatelyRender: false,
    content: initialContent,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer"
        }
      }),
      Image.configure({
        inline: false
      }),
      Placeholder.configure({
        placeholder: "Start writing your article. Type / to insert blocks quickly."
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      CharacterCount,
      Youtube.configure({
        nocookie: true,
        width: 640,
        height: 360
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      CodeBlockLowlight.configure({
        lowlight
      })
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert min-h-[520px] max-w-none rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-5 text-foreground outline-none md:px-6"
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file.type.startsWith("image/"));
        if (files.length === 0) {
          return false;
        }

        void uploadFile(files[0]).then((image) => {
          editor?.chain().focus().setImage({ src: image.url, alt: image.alt }).run();
        });

        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((file) => file.type.startsWith("image/"));
        if (files.length === 0) {
          return false;
        }

        void uploadFile(files[0]).then((image) => {
          editor?.chain().focus().setImage({ src: image.url, alt: image.alt }).run();
        });

        return true;
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      const json = currentEditor.getJSON();
      const html = currentEditor.getHTML();
      const plainText = currentEditor.getText();

      const $from = currentEditor.state.selection.$from;
      const currentParagraphText = $from.parent.textContent ?? "";

      if (currentParagraphText.startsWith("/") && !currentParagraphText.includes(" ")) {
        setSlashOpen(true);
        setSlashQuery(currentParagraphText.slice(1).toLowerCase());
      } else {
        setSlashOpen(false);
        setSlashQuery("");
      }

      onChange({ json, html, plainText });
    }
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  function openYoutubePrompt() {
    if (!editor) {
      return;
    }

    const url = window.prompt("Paste the YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }

  function runCommand(commandId: string) {
    if (!editor) {
      return;
    }

    switch (commandId) {
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      case "heading-1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading-2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "bullet-list":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ordered-list":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "code-block":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "table":
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case "youtube":
        openYoutubePrompt();
        break;
      case "image":
        fileInputRef.current?.click();
        break;
      default:
        break;
    }
  }

  const commands = useMemo<SlashCommand[]>(() => {
    if (!editor) {
      return [];
    }

    return [
      {
        id: "paragraph",
        label: "Paragraph",
        icon: <PilcrowSquare className="h-4 w-4" />
      },
      {
        id: "heading-1",
        label: "Heading 1",
        icon: <Heading1 className="h-4 w-4" />
      },
      {
        id: "heading-2",
        label: "Heading 2",
        icon: <Heading2 className="h-4 w-4" />
      },
      {
        id: "bullet-list",
        label: "Bullet list",
        icon: <List className="h-4 w-4" />
      },
      {
        id: "ordered-list",
        label: "Ordered list",
        icon: <ListOrdered className="h-4 w-4" />
      },
      {
        id: "blockquote",
        label: "Quote block",
        icon: <Quote className="h-4 w-4" />
      },
      {
        id: "code-block",
        label: "Code block",
        icon: <Code2 className="h-4 w-4" />
      },
      {
        id: "table",
        label: "Table",
        icon: <Table2 className="h-4 w-4" />
      },
      {
        id: "youtube",
        label: "YouTube embed",
        icon: <Play className="h-4 w-4" />
      },
      {
        id: "image",
        label: "Image",
        icon: <ImagePlus className="h-4 w-4" />
      }
    ];
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-sm text-muted">
        Loading editor...
      </div>
    );
  }

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(slashQuery)
  );

  return (
    <div className="relative grid gap-4">
      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          void uploadFile(file).then((image) => {
            editor.chain().focus().setImage({ src: image.url, alt: image.alt }).run();
          });
        }}
        ref={fileInputRef}
        type="file"
      />

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-3">
        <ToolbarButton active={editor.isActive("heading", { level: 1 })} label="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 2 })} label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} label="Block quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("codeBlock")} label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={false} label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} label="Add link" onClick={() => {
          const url = window.prompt("Paste the link URL");
          if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }
        }}><Link2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("image")} label="Upload image" onClick={() => runCommand("image")}><ImagePlus className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("table")} label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("youtube")} label="Embed YouTube video" onClick={openYoutubePrompt}><Play className="h-4 w-4" /></ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      {slashOpen && filteredCommands.length > 0 ? (
        <div className="absolute left-4 top-[88px] z-20 w-[260px] rounded-[24px] border border-white/10 bg-surface/95 p-3 shadow-glow backdrop-blur-xl">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Slash commands
          </p>
          <div className="grid gap-1">
            {filteredCommands.map((command) => (
              <button
                className="inline-flex items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-primary/10"
                key={command.id}
                onClick={() => {
                  const paragraphText = editor.state.selection.$from.parent.textContent;
                  const start = editor.state.selection.$from.start();
                  editor.chain().focus().deleteRange({ from: start, to: start + paragraphText.length }).run();
                  runCommand(command.id);
                  setSlashOpen(false);
                }}
                type="button"
              >
                {command.icon}
                {command.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  label?: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label ?? "Editor command"}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10",
        active && "border-primary/40 bg-primary/10 text-primary-light"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
