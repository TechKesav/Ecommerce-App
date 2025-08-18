import { Link } from "react-router-dom";
import { FaUsers, FaChartLine } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-3 px-4 flex justify-between items-center">
      <span className="text-sm">&copy; 2025 MyApp</span>

      <Link to="/users" className="flex items-center space-x-2 hover:text-blue-400">
        <FaUsers />
        <span>User Details</span>
      </Link>
      <Link to="/admin-dashboard" className="flex flex-col items-center hover:text-blue-400">
        <FaChartLine size={24} />
        <span className="text-xs">Analytics</span>
      </Link>
    </footer>
  );
};

export default Footer;
