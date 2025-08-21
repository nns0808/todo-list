import styles from './Calculation.module.css';

function Calculation({ result, title = 'Does nothing' }) {
  return (
    <li className={styles.item}>
      <h2>{title}</h2>
      <p>{result}</p>
    </li>
  );
}

export default Calculation;
