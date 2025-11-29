import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./App.css"; // Make sure this exists

function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
  });

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h1>Text Editor</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          minHeight: "200px",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default App;
