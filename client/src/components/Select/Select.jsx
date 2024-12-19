import styles from './Select.module.scss';
import React, { useEffect, useState, useRef } from 'react';

const Select = ({ isShowCheckIcon, icon, label, items, trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(label);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target))
        setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickItem = (item) => {
    item.onClick();
    setNewLabel(item.label);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.container} ref={selectRef}>
      {trigger ? (
        React.cloneElement(trigger, {
          onClick: handleToggle,
        })
      ) : (
        <div className={styles.trigger} onClick={handleToggle}>
          <div className={styles.left}>
            {icon && <i className={`bi bi-${icon}`}></i>}
            <span>{newLabel}</span>
          </div>
          <div className={styles.right}>
            <i className="bi bi-chevron-expand"></i>
          </div>
        </div>
      )}
      {isOpen && (
        <div className={styles.itemsContainer}>
          {items ? (
            <div className={styles.items}>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={styles.item}
                  onClick={() => handleClickItem(item)}
                >
                  {isShowCheckIcon ? (
                    <>
                      {item.label == newLabel ? (
                        <i className="bi bi-check-lg"></i>
                      ) : (
                        <i className="bi"></i>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                  {item.label}
                </li>
              ))}
            </div>
          ) : (
            <div className={styles.items}>{children}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
