import styles from './Dropdown.module.scss';
import { useState, useEffect, useRef } from 'react';

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChildClick = (child) => {
    child.onClick();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.trigger} onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <ul className={styles.children}>
          {children.map((child, index) => (
            <li
              key={index}
              className={styles.child}
              onClick={() => handleChildClick(child)}
            >
              {child.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
