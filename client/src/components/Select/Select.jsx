import styles from './Select.module.scss';
import { useState } from 'react';

const Select = ({ icon, label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(label);

  const handleClickItem = (item) => {
    item.onClick();
    setNewLabel(item.label);
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.left}>
          {icon && <i className={`bi bi-${icon}`}></i>}
          <span>{newLabel}</span>
        </div>
        <div className={styles.right}>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
      {isOpen && (
        <>
          {items && (
            <div className={styles.items}>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={styles.item}
                  onClick={() => handleClickItem(item)}
                >
                  {item.label}
                </li>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Select;
