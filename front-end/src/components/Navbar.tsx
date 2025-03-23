import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { id: "https://github.com/jamesyoung-15/Bluebikes-Availability-Predictor/blob/main/notebook/ml-bike-predictor.ipynb", text: "Jupyter Notebook", target: true},
    { id: "https://github.com/jamesyoung-15/Bluebikes-Availability-Predictor/", text: "Source Code", target: true},
  ];

  return (
    <nav className="flex items-center justify-between p-5 z-50 shadow-xl">
      <div className="flex items-center">
        <a href="#">
          <h3 className="text-lg font-bold mr-1 text-blue-600 hover:text-indigo-600">
            James' Bluebikes Station Forecast
          </h3>
        </a>
        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1"></div>
      </div>
      <div className="hidden md:flex space-x-4">
        {navLinks.map((link) => (
          <a
            key={`${link.id}`}
            href={`${link.id}`}
            className="hover:text-[#7359f8]"
            target={link.target ? "_blank" : ""}
          >
            <h3 className="text-lg">{link.text}</h3>
          </a>
        ))}
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-2xl">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-22 right-0 w-full bg-[#f2e9e1] md:hidden">
          <div className="flex flex-col space-y-4 p-5">
            {navLinks.map((link) => (
              <a
                key={`${link.id}`}
                href={`${link.id}`}
                className="hover:text-[#7359f8]"
                target={link.target ? "_blank" : ""}
              >
                <h3>{link.text}</h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;