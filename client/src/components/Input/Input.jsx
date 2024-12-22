import { useEffect, useState } from 'react';
import styles from './Input.module.scss';

const Input = ({ value, placeholder, onChangeValue, variant, isDisabled }) => {
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [type, setType] = useState('');

  useEffect(() => {
    setType(variant);
  }, []);

  const handleResetError = () => {
    setError('');
  };

  const handleBlur = () => {
    setIsFocused(true);

    if (value.length == 0) {
      setError(placeholder + ' không được để trống.');
    }
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
    type == 'password' ? setType('text') : setType('password');
  };

  document.querySelectorAll('input[type="password"]').forEach((input) => {
    input.removeAttribute('data-bs-toggle');
  });

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          className={`${error.length == 0 ? '' : styles.redBorder}`}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          onChange={onChangeValue}
          onBlur={handleBlur}
          onFocus={handleResetError}
        />
        {variant == 'password' && (
          <div className={styles.togglePassword} onClick={handleTogglePassword}>
            {isPasswordVisible ? (
              <i className="bi bi-eye-slash"></i>
            ) : (
              <i className="bi bi-eye"></i>
            )}
          </div>
        )}
      </div>
      <p className={styles.error}>{error}</p>
    </div>
  );
};

export default Input;
