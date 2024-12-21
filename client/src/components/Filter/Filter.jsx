import styles from './Filter.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

const Filter = ({ filters }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const addFilter = (type, value) => {
    const url = new URL(window.location.href);

    if (url.pathname === '/' || url.pathname.startsWith('/profile/')) {
      const params = url.searchParams;

      if (params.get(type) === value) {
        params.delete(type);
      } else {
        params.set(type, value);
      }

      navigate(url.pathname + '?' + params.toString());
    }
  };

  const isChecked = (paramName, paramValue) => {
    const params = new URLSearchParams(location.search);
    return params.get(paramName) === paramValue;
  };

  return (
    <div className={styles.container}>
      {filters.map((filter, index) => (
        <div className={styles.filterGroup} key={index}>
          <p className={styles.title}>{filter.title}</p>
          {filter.options.map((option, index) => (
            <div key={index}>
              <div
                className={styles.optionContainer}
                onClick={() => addFilter(filter.type, option.value)}
              >
                <label className={styles.checkBox}>
                  <input
                    type="checkbox"
                    onChange={() => addFilter(filter.type, option.value)}
                  />
                  <span
                    className={`${styles.checkMark} ${isChecked(filter.type, option.value) && styles.checked}`}
                  >
                    {isChecked(filter.type, option.value) && (
                      <i className="bi bi-check"></i>
                    )}
                  </span>
                </label>
                <p className={styles.option}>{option.label}</p>
              </div>
            </div>
          ))}
          {index + 1 < filters.length && <div className={styles.divider} />}
        </div>
      ))}
    </div>
  );
};

export default Filter;
