import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const popularKeywords = ['Sjuksköterska', 'Ingenjör', 'Systemutvecklare', 'Lärare', 'Ekonom'];

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

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(keyword)
    onSearch(keyword)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="mb-6">
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
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Populära sökningar:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {popularKeywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => handleKeywordClick(keyword)}
              className="px-3 py-1 bg-white hover:bg-gray-100 text-blue-600 text-sm font-medium rounded-full border border-blue-300 shadow-sm transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}