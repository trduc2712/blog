import styles from './Pagination.module.scss';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const renderPagesNumber = () => {
    const pageNumbers = [];
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
