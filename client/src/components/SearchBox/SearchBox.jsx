import { useState, useEffect } from 'react';
import styles from './SearchBox.module.scss';

const SearchBox = ({ placeholder, onSearch }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setValue(urlParams.get('keyword'));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={styles.search} onClick={() => onSearch(value)}>
          <i className="bi bi-search"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
