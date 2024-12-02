import styles from './Select.module.scss';
import { useState } from 'react';

const Select = ({ icon, label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.left}>
          <i className={`bi bi-${icon}`}></i>
          <p>{label}</p>
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
                <li key={index} className={styles.item} onClick={item.onClick}>
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
