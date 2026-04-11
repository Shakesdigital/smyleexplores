"use client";

import { useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  label: string;
  name: string;
  defaultValue?: string;
};

type ToolbarAction = {
  label: string;
  command?: string;
  value?: string;
  onClick?: () => void;
};

export function RichTextEditor({ label, name, defaultValue = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue);

  useEffect(() => {
    setHtml(defaultValue);
    if (editorRef.current && editorRef.current.innerHTML !== defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function applyCommand(command: string, value?: string) {
    focusEditor();
    document.execCommand(command, false, value);
    setHtml(editorRef.current?.innerHTML ?? "");
  }

  function insertLink() {
    const url = window.prompt("Enter the full URL");
    if (!url) return;
    applyCommand("createLink", url);
  }

  const toolbar: ToolbarAction[] = [
    { label: "Paragraph", command: "formatBlock", value: "p" },
    { label: "H2", command: "formatBlock", value: "h2" },
    { label: "H3", command: "formatBlock", value: "h3" },
    { label: "Bold", command: "bold" },
    { label: "Italic", command: "italic" },
    { label: "Quote", command: "formatBlock", value: "blockquote" },
    { label: "Bullets", command: "insertUnorderedList" },
    { label: "Numbers", command: "insertOrderedList" },
    { label: "Link", onClick: insertLink },
    { label: "Clear", command: "removeFormat" },
  ];

  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <div className="mt-2 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 bg-neutral-50 p-3">
          {toolbar.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                  return;
                }
                if (action.command) {
                  applyCommand(action.command, action.value);
                }
              }}
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
            >
              {action.label}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => setHtml(editorRef.current?.innerHTML ?? "")}
          className="min-h-[360px] w-full px-5 py-4 text-base font-normal leading-8 text-neutral-700 outline-none"
          dangerouslySetInnerHTML={{ __html: defaultValue }}
        />
      </div>
      <input type="hidden" name={name} value={html} />
      <p className="mt-2 text-xs font-normal leading-6 text-neutral-500">
        Use the toolbar for headings, bold text, lists, quotes, and links. Content is saved as formatted HTML.
      </p>
    </label>
  );
}
