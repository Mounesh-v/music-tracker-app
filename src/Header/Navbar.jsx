import React from "react";

function Navbar() {
  return (
    <header className="bg-gray-900 text-gray-100 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-5">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.5 1.75C3.43 1.75 1.75 3.43 1.75 5.5v13c0 2.07 1.68 3.75 3.75 3.75h13c2.07 0 3.75-1.68 3.75-3.75v-13C22.25 3.43 20.57 1.75 18.5 1.75h-13ZM12.77 6.03c.45-.11.92.11 1.12.53.28.53.66 1.21 1.09 1.77.28.39.56.7.84.9.27.22.43.25.5.25.55 0 1 .45 1 1s-.45 1-1 1c-.7 0-1.3-.35-1.73-.69V14.5c0 1.93-1.57 3.5-3.5 3.5S7 16.43 7 14.5 8.57 11 10.5 11c.54 0 1.05.12 1.5.34V7c0-.46.32-.86.77-.97Z"
              fill="#2c83ed"
            />
          </svg>
          <span className="text-2xl font-bold tracking-wide text-white">Music App</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
