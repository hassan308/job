// filter.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Job, FilterState } from '../types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap } from 'lucide-react';

interface FilterMenuProps {
  jobs: Job[];
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

// Lägg till en typ för experienceCount
type ExperienceCountType = {
  'Ja': number;
  'Nej': number;
  [key: string]: number;  // Index signature som tillåter string-indexering
};

export default function FilterMenu({ jobs, onFilterChange, onClose }: FilterMenuProps) {
  const [filters, setFilters] = useState<FilterState>({
    employmentTypes: [],
    municipalities: [],
    experienceRequired: [],
  });

  const uniqueEmploymentTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
  const uniqueMunicipalities = Array.from(
    new Set(
      jobs.map(job => job.workplace.municipality).filter(Boolean)
    )
  );

  const handleCheckboxChange = useCallback((category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (Array.isArray(newFilters[category])) {
        const array = newFilters[category] as string[];
        if (array.includes(value)) {
          newFilters[category] = array.filter(item => item !== value);
        } else {
          newFilters[category] = [...array, value];
        }
      }
      return newFilters;
    });
  }, []);

  const handleReset = () => {
    setFilters({
      employmentTypes: [],
      municipalities: [],
      experienceRequired: [],
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const municipalityCount = uniqueMunicipalities.reduce((acc, municipality) => {
    acc[municipality] = jobs.filter(job => job.workplace.municipality === municipality).length;
    return acc;
  }, {} as Record<string, number>);

  const employmentTypeCount = uniqueEmploymentTypes.reduce((acc, type) => {
    acc[type] = jobs.filter(job => job.employmentType === type).length;
    return acc;
  }, {} as Record<string, number>);

  const experienceCount: ExperienceCountType = {
    'Ja': jobs.filter(job => job.requiresExperience).length,
    'Nej': jobs.filter(job => !job.requiresExperience).length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Filtrera jobb
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Anställningstyp */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Anställningstyp</h3>
          </div>
          <div className="space-y-3 pl-2">
            {uniqueEmploymentTypes.map(type => (
              <div key={type} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`employment-${type}`}
                    checked={filters.employmentTypes.includes(type)}
                    onCheckedChange={() => handleCheckboxChange('employmentTypes', type)}
                    className="text-blue-600 rounded-md data-[state=checked]:bg-blue-600"
                  />
                  <Label 
                    htmlFor={`employment-${type}`} 
                    className="text-sm text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    {type}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">
                  {employmentTypeCount[type]} jobb
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kommun */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <MapPin className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Kommun</h3>
          </div>
          <div className="max-h-[280px] overflow-y-auto pr-2 space-y-3 pl-2 custom-scrollbar">
            {uniqueMunicipalities.map(municipality => (
              <div key={municipality} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`municipality-${municipality}`}
                    checked={filters.municipalities.includes(municipality)}
                    onCheckedChange={() => handleCheckboxChange('municipalities', municipality)}
                    className="text-indigo-600 rounded-md data-[state=checked]:bg-indigo-600"
                  />
                  <Label 
                    htmlFor={`municipality-${municipality}`} 
                    className="text-sm text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    {municipality}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">
                  {municipalityCount[municipality]} jobb
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Erfarenhet */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Erfarenhet</h3>
          </div>
          <div className="space-y-3 pl-2">
            {['Ja', 'Nej'].map(option => (
              <div key={option} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`experience-${option}`}
                    checked={filters.experienceRequired.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('experienceRequired', option)}
                    className="text-purple-600 rounded-md data-[state=checked]:bg-purple-600"
                  />
                  <Label 
                    htmlFor={`experience-${option}`} 
                    className="text-sm text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    {option === 'Ja' ? 'Erfarenhet krävs' : 'Ingen erfarenhet krävs'}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">
                  {experienceCount[option]} jobb
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg"
        >
          Återställ filter
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Tillämpa filter
        </button>
      </div>
    </motion.div>
  );
}
