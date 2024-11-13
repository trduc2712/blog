import styles from './Pagination.module.scss';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const renderPagesNumber = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button 
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
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
        className={`${styles.prevButton} ${currentPage == 1 ? styles.disabled : ''}`}
        disabled={currentPage == 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1877f2" className="bi bi-chevron-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
        </svg>
      </button>
      <div className={styles.pageButtons}>
        {renderPagesNumber()}
      </div>
      <button 
        className={`${styles.nextButton} ${currentPage == totalPages ? styles.disabled : ''}`} 
        disabled={currentPage == totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1877f2" className="bi bi-chevron-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
        </svg>
      </button>
    </div>
  )
}

export default Pagination;