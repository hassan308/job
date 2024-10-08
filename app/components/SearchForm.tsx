import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const popularSearches = [
  'Lärare',
  'Systemutvecklare',
  'Sjuksköterska',
  'Ingenjör',
  'Kock',
  'Ekonom',
  'Elektriker',
];

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      console.log('Sökning initierad med:', searchTerm);
      onSearch(searchTerm)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    onSearch(suggestion)
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Sök jobb, företag eller plats"
              value={searchTerm}
              onChange={handleInputChange}
              className="pl-10 pr-4 py-2 sm:py-3 w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm text-base sm:text-lg"
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg transition duration-300 ease-in-out text-base sm:text-lg font-semibold shadow-md hover:shadow-lg w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Sök'}
          </Button>
        </div>
      </form>
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Populära sökningar:</p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition duration-300 ease-in-out"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}