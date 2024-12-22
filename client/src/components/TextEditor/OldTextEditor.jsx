import styles from './TextEditor.module.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        <i className="bi bi-type-bold"></i> {/* Bootstrap Bold Icon */}
      </button>
      <button className="ql-italic" aria-label="In nghiêng">
        <i className="bi bi-type-italic"></i> {/* Bootstrap Italic Icon */}
      </button>
      <button className="ql-underline" aria-label="Gạch chân">
        <i className="bi bi-type-underline"></i>{' '}
        {/* Bootstrap Underline Icon */}
      </button>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Danh sách có thứ tự"
      >
        <i className="bi bi-list-ol"></i> {/* Bootstrap Ordered List Icon */}
      </button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Danh sách không thứ tự"
      >
        <i className="bi bi-list-ul"></i> {/* Bootstrap Unordered List Icon */}
      </button>
      <button className="ql-image" aria-label="Chèn ảnh">
        <i className="bi bi-image"></i> {/* Bootstrap Image Icon */}
      </button>
      <button className="ql-clean" aria-label="Xóa định dạng">
        <i className="bi bi-x-circle"></i> {/* Bootstrap Eraser/Clear Icon */}
      </button>
    </div>
  );

  const modules = {
    toolbar: {
      container: '.custom-toolbar', // Attach to custom toolbar
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
