import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-gray-200 dark:bg-gray-900 shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-2 md:p-3">
          <a
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="flex items-center text-lg md:text-3xl font-bold tracking-wide text-blue-600 dark:text-white">
              <span
                role="img"
                aria-label="airplane"
                className="text-4xl md:text-3xl mr-2"
              >
                ✈️
              </span>
              VAC
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}
