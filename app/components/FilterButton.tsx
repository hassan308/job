import React from 'react';

interface FilterButtonProps {
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Filtrera resultat
    </button>
  );
};

export default FilterButton;