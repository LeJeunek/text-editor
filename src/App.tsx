import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTap from "./TipTap";
import "./App.css";

function App() {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
    onUpdate({ editor }) {
      const json = JSON.stringify(editor.getJSON());

      setUndoStack((prev) => {
        // avoid saving identical consecutive snapshots
        if (prev[prev.length - 1] === json) return prev;
        return [...prev, json];
      });

      // new change invalidates redo
      setRedoStack([]);
    },
  });

  // Initialize undo stack AFTER editor is ready
  useEffect(() => {
    if (!editor) return;

    const initial = JSON.stringify(editor.getJSON());
    setUndoStack([initial]);
  }, [editor]);

  // Make each character its own undo level
  useEffect(() => {
    if (!editor) return;
    editor.view.someProp("handleTextInput", () => false);
  }, [editor]);

  const handleUndo = () => {
    if (undoStack.length <= 1) return;

    setUndoStack((prev) => {
      const copy = [...prev];
      const current = copy.pop(); // remove current version
      const previous = copy[copy.length - 1]; // restore previous

      setRedoStack((r) => [...r, current!]); // save current into redo

      editor.commands.setContent(JSON.parse(previous));

      return copy;
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    setRedoStack((prev) => {
      const copy = [...prev];
      const next = copy.pop()!;

      setUndoStack((u) => [...u, JSON.stringify(editor.getJSON())]);

      editor.commands.setContent(JSON.parse(next));

      return copy;
    });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h1>Text Editor</h1>

      <TipTap editor={editor} />

      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleUndo} disabled={undoStack.length <= 1}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

export default App;
