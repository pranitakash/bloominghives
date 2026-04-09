import { Link } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';

export default function FloatingCTA() {
  return (
    <Link to="/contact" className="floating-cta" id="floating-cta" aria-label="Start your project">
      <span>Start Your Project</span>
      <ArrowIcon />
    </Link>
  );
}
