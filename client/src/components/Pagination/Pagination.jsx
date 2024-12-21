import styles from './Pagination.module.scss';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const renderPagesNumber = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            className={`${styles.page} ${i === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(i)}
            key={i}
          >
            <p>{i}</p>
          </button>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(
            <button
              className={`${styles.page} ${i === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(i)}
              key={i}
            >
              <p>{i}</p>
            </button>
          );
        }
        pageNumbers.push(
          <button className={styles.page}>
            <p>...</p>
          </button>
        );
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          <button className={styles.page}>
            <p>...</p>
          </button>
        );
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(
            <button
              className={`${styles.page} ${i === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(i)}
              key={i}
            >
              <p>{i}</p>
            </button>
          );
        }
      } else {
        pageNumbers.push(
          <button className={styles.page}>
            <p>...</p>
          </button>
        );
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(
            <button
              className={`${styles.page} ${i === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(i)}
              key={i}
            >
              <p>{i}</p>
            </button>
          );
        }
        pageNumbers.push(
          <button className={styles.page}>
            <p>...</p>
          </button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.prev} ${currentPage == 1 ? styles.disabled : ''}`}
        disabled={currentPage == 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      <div className={styles.pages}>{renderPagesNumber()}</div>
      <button
        className={`${styles.next} ${currentPage == totalPages ? styles.disabled : ''}`}
        disabled={currentPage == totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
