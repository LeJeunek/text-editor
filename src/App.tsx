import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTap from "./TipTap";
import { Undo, Redo, FileText } from "lucide-react";
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
    <>
      <div className="app-nav">
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={24} />
          Text Editor
        </h1>

        <TipTap editor={editor} />

        <div
          style={{
            marginRight: "4rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <button onClick={handleUndo} disabled={undoStack.length <= 1}>
            <Undo size={16} />
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo size={16} />
          </button>
        </div>
      </div>

      <div className="App">
        <div
          className="editor-container"
          onClick={(e) => {
            if (editor && e.target === e.currentTarget) {
              editor.commands.focus();
              editor.commands.setTextSelection(editor.state.doc.content.size);
            }
          }}
        >
          <EditorContent editor={editor} className="editor-body" />
        </div>
      </div>
    </>
  );
}

export default App;
