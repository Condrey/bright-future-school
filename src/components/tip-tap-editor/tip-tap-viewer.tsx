import { Highlight } from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TipTapViewer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [
      Superscript,
      Subscript,
      StarterKit,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    content: content,
    editable: false, // Make it non-editable if you only want to display the content
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);
  return <EditorContent editor={editor} />;
};

export default TipTapViewer;
