import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Job } from '../types';
import { X } from 'lucide-react';
import { TextField, Button, Box, Autocomplete } from '@mui/material';

// Lägg till denna array med populära sökförslag
const popularSearches = [
  'Systemutvecklare',
  'Frontend-utvecklare',
  'Backend-utvecklare',
  'Fullstack-utvecklare',
  'DevOps-ingenjör',
  'Data Scientist',
  'UX-designer',
];

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

  const uniqueEmploymentTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
  const uniqueMunicipalities = Array.from(new Set(jobs.map(job => job.workplace?.municipality).filter(Boolean)));

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Autocomplete
        freeSolo
        options={popularSearches}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Sök jobb"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        value={searchTerm}
      />
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">Anställningstyp</h3>
          <div className="grid grid-cols-2 gap-3">
            {uniqueEmploymentTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`employment-${type}`}
                  checked={filters.employmentTypes.includes(type)}
                  onCheckedChange={() => handleCheckboxChange('employmentTypes', type)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor={`employment-${type}`} className="text-sm text-indigo-800 cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">Kommun</h3>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {uniqueMunicipalities.map(municipality => (
              <div key={municipality} className="flex items-center space-x-2">
                <Checkbox
                  id={`municipality-${municipality}`}
                  checked={filters.municipalities.includes(municipality)}
                  onCheckedChange={() => handleCheckboxChange('municipalities', municipality)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor={`municipality-${municipality}`} className="text-sm text-indigo-800 cursor-pointer">
                  {municipality}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">Krav</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires-experience"
                checked={filters.requiresExperience}
                onCheckedChange={(checked) => handleCheckboxChange('requiresExperience', checked as boolean)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="requires-experience" className="text-sm text-indigo-800 cursor-pointer">
                Kräver erfarenhet
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires-license"
                checked={filters.requiresLicense}
                onCheckedChange={(checked) => handleCheckboxChange('requiresLicense', checked as boolean)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="requires-license" className="text-sm text-indigo-800 cursor-pointer">
                Kräver körkort
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires-car"
                checked={filters.requiresCar}
                onCheckedChange={(checked) => handleCheckboxChange('requiresCar', checked as boolean)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="requires-car" className="text-sm text-indigo-800 cursor-pointer">
                Kräver bil
              </Label>
            </div>
          </div>
        </div>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Sök
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Återställ filter
        </Button>
      </Box>
    </Box>
  );
}