import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough } from "lucide-react";

interface TipTapProps {
  editor: Editor | null;
}

export default function TipTap({ editor }: TipTapProps) {
  if (!editor) return null;

  return (
    <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={16} />
      </button>
    </div>
  );
}
