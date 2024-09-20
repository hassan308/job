import React from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FilterMenuProps {
  filters: {
    employmentType: string[];
    requiresExperience: boolean;
    requiresLicense: boolean;
    requiresCar: boolean;
    municipalities: string[];
  };
  onFilterChange: (newFilters: FilterMenuProps['filters']) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (category: keyof FilterMenuProps['filters'], value: string | boolean) => {
    const newFilters = { ...filters };
    if (typeof value === 'boolean') {
      (newFilters[category] as boolean) = value;
    } else {
      const categoryArray = newFilters[category] as string[];
      if (categoryArray.includes(value)) {
        (newFilters[category] as string[]) = categoryArray.filter((item: string) => item !== value);
      } else {
        (newFilters[category] as string[]) = [...categoryArray, value];
      }
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
      <h3 className="text-xl font-semibold mb-6 text-indigo-800">Filtrera resultat</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-indigo-700">Anställningstyp</h4>
        {['Heltid', 'Deltid', 'Visstid', 'Tillsvidare'].map((type) => (
          <div key={type} className="flex items-center mb-2">
            <Checkbox
              id={`employment-${type}`}
              checked={filters.employmentType.includes(type)}
              onCheckedChange={() => handleCheckboxChange('employmentType', type)}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor={`employment-${type}`} className="ml-2 text-gray-700">{type}</Label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-indigo-700">Krav</h4>
        {[ 
          { id: 'requires-experience', label: 'Kräver erfarenhet', key: 'requiresExperience' },
          { id: 'requires-license', label: 'Kräver körkort', key: 'requiresLicense' },
          { id: 'requires-car', label: 'Kräver bil', key: 'requiresCar' }
        ].map(({ id, label, key }) => (
          <div key={id} className="flex items-center mb-2">
            <Checkbox
              id={id}
              checked={filters[key as keyof typeof filters] as boolean}
              onCheckedChange={(checked) => handleCheckboxChange(key as keyof typeof filters, checked as boolean)}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor={id} className="ml-2 text-gray-700">{label}</Label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-indigo-700">Kommun</h4>
        {filters.municipalities.map((municipality) => (
          <div key={municipality} className="flex items-center mb-2">
            <Checkbox
              id={`municipality-${municipality}`}
              checked={filters.municipalities.includes(municipality)}
              onCheckedChange={() => handleCheckboxChange('municipalities', municipality)}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor={`municipality-${municipality}`} className="ml-2 text-gray-700">{municipality}</Label>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => onFilterChange(filters)} 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Tillämpa filter
      </Button>
    </div>
  );
};

export default FilterMenu;