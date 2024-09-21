import { useState, useEffect, useCallback } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Job } from '../types'
import { X } from 'lucide-react'

interface FilterMenuProps {
  jobs: Job[];
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

interface FilterState {
  employmentTypes: string[];
  municipalities: string[];
  requiresExperience: boolean;
  requiresLicense: boolean;
  requiresCar: boolean;
}

export default function FilterMenu({ jobs, onFilterChange, onClose }: FilterMenuProps) {
  const [filters, setFilters] = useState<FilterState>({
    employmentTypes: [],
    municipalities: [],
    requiresExperience: false,
    requiresLicense: false,
    requiresCar: false,
  });

  const uniqueEmploymentTypes = Array.from(new Set(jobs.map(job => job.employment_type)));
  const uniqueMunicipalities = Array.from(new Set(jobs.map(job => job.municipality)));

  const handleCheckboxChange = useCallback((category: keyof FilterState, value: string | boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (typeof value === 'boolean') {
        newFilters[category] = value as any;
      } else {
        if (Array.isArray(newFilters[category])) {
          const array = newFilters[category] as string[];
          if (array.includes(value)) {
            newFilters[category] = array.filter(item => item !== value) as any;
          } else {
            newFilters[category] = [...array, value] as any;
          }
        }
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Filtrera jobb</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Anställningstyp</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueEmploymentTypes.map(type => (
              <div key={type} className="flex items-center">
                <Checkbox
                  id={`employment-${type}`}
                  checked={filters.employmentTypes.includes(type)}
                  onCheckedChange={() => handleCheckboxChange('employmentTypes', type)}
                />
                <Label htmlFor={`employment-${type}`} className="ml-2 text-sm text-gray-600">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Kommun</h3>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {uniqueMunicipalities.map(municipality => (
              <div key={municipality} className="flex items-center">
                <Checkbox
                  id={`municipality-${municipality}`}
                  checked={filters.municipalities.includes(municipality)}
                  onCheckedChange={() => handleCheckboxChange('municipalities', municipality)}
                />
                <Label htmlFor={`municipality-${municipality}`} className="ml-2 text-sm text-gray-600">
                  {municipality}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Krav</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="requires-experience"
                checked={filters.requiresExperience}
                onCheckedChange={(checked) => handleCheckboxChange('requiresExperience', checked as boolean)}
              />
              <Label htmlFor="requires-experience" className="ml-2 text-sm text-gray-600">
                Kräver erfarenhet
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="requires-license"
                checked={filters.requiresLicense}
                onCheckedChange={(checked) => handleCheckboxChange('requiresLicense', checked as boolean)}
              />
              <Label htmlFor="requires-license" className="ml-2 text-sm text-gray-600">
                Kräver körkort
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="requires-car"
                checked={filters.requiresCar}
                onCheckedChange={(checked) => handleCheckboxChange('requiresCar', checked as boolean)}
              />
              <Label htmlFor="requires-car" className="ml-2 text-sm text-gray-600">
                Kräver bil
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}