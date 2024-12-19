import styles from './Dropdown.module.scss';
import { useState, useEffect, useRef } from 'react';

const Dropdown = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleTrigger = () => {
    setIsOpen(!isOpen);
  };

  const handleClickItem = (item) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.trigger} onClick={handleToggleTrigger}>
        {trigger}
      </div>
      <ul className={`${styles.items} ${isOpen ? styles.open : ''}`}>
        {items.map((item, index) =>
          item.isDivider ? (
            <div className={styles.divider} />
          ) : (
            <li
              key={index}
              className={styles.item}
              onClick={() => handleClickItem(item)}
            >
              {item.icon ? (
                <i className={`bi bi-${item.icon}`}></i>
              ) : (
                <i className="bi"></i>
              )}
              {item.label}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
