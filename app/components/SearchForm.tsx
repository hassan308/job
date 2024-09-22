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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
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
  )
}