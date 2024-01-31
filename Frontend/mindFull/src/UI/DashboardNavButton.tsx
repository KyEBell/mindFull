import styles from '../styles/Navbar.module.css';

interface DashboardNavButtonProps {
  onClick: () => void;
}
const DashboardNavButton: React.FC<DashboardNavButtonProps> = ({ onClick }) => {
  return (
    <span className={styles.navItem}>
      <button onClick={onClick}>return to dashboard</button>
    </span>
  );
};

export default DashboardNavButton;
