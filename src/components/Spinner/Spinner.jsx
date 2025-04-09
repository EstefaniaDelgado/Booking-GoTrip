import styles from './Spinner.module.css'

const Spinner = () => {
    return (
     
      <div className={styles.spinner}>
      <div className={styles.dot1}></div>
      <div className={styles.dot2}></div>
      <div className={styles.dot3}></div>
      </div>
    );
  };
  
  export default Spinner;
  