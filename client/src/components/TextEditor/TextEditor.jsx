import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './TextEditor.module.scss';

const TextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      Underline,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const addImageFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const isButtonActive = (type) =>
    editor?.isActive(type) ? styles.active : '';

  return (
    <div className={styles.container}>
      {editor && (
        <>
          <div className="toolbar">
            <button
              className={isButtonActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <i className="bi bi-type-bold"></i>
            </button>
            <button
              className={isButtonActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i className="bi bi-type-italic"></i>
            </button>
            <button
              className={isButtonActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <i className="bi bi-type-underline"></i>
            </button>
            <button
              className={isButtonActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <i className="bi bi-list-ul"></i>
            </button>
            <button
              className={isButtonActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <i className="bi bi-list-ol"></i>
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={addImageFromFile}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <i className="bi bi-image" style={{ cursor: 'pointer' }}></i>
            </label>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
              <i className="bi bi-x"></i>
            </button>
          </div>
          <div className="content" spellCheck={false}>
            <EditorContent editor={editor} />
          </div>
        </>
      )}
    </div>
  );
};

export default TextEditor;
