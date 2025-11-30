interface TipTapProps {
  editor: Editor | null;
}

export default function TipTap({ editor }: TipTapProps) {
  if (!editor) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}>
        Strike
      </button>
    </div>
  );
}
