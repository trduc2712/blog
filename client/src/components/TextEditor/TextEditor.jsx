import styles from './TextEditor.module.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from 'react';

const TextEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);

  const customToolbar = (
    <div className="custom-toolbar">
      <select className="ql-header">
        <option value="1">Tiêu đề 1</option>
        <option value="2">Tiêu đề 2</option>
        <option value="3">Tiêu đề 3</option>
        <option value="">Văn bản</option>
      </select>
      <button className="ql-bold" aria-label="In đậm">
        <i className="bi bi-type-bold"></i>
      </button>
      <button className="ql-italic" aria-label="In nghiêng">
        <i className="bi bi-type-italic"></i>
      </button>
      <button className="ql-underline" aria-label="Gạch chân">
        <i className="bi bi-type-underline"></i>
      </button>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Danh sách có thứ tự"
      >
        <i className="bi bi-list-ol"></i>
      </button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Danh sách không thứ tự"
      >
        <i className="bi bi-list-ul"></i>
      </button>
      <button className="ql-image" aria-label="Chèn ảnh">
        <i className="bi bi-image"></i>
      </button>
      <button className="ql-clean" aria-label="Xóa định dạng"></button>
    </div>
  );

  const modules = {
    toolbar: {
      container: '.custom-toolbar',
    },
  };

  const handleChangeContent = (value) => {
    setContent(value);
  };

  return (
    <div className={styles.container} spellCheck="false">
      {customToolbar}
      <ReactQuill
        ref={quillRef}
        value={content}
        modules={modules}
        onChange={handleChangeContent}
        placeholder=""
        spellCheck={false}
      />
    </div>
  );
};

export default TextEditor;
