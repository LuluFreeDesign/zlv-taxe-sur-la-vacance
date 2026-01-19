import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSelectCommune: (commune: string, isEligible: boolean) => void;
  communes: Array<{ name: string; isEligible: boolean; inseeCode?: string }>;
}

export function SearchBar({ onSelectCommune, communes }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter communes based on search query (by name or INSEE code)
  const filteredCommunes = searchQuery.trim().length >= 2
    ? communes.filter((commune) =>
        commune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (commune.inseeCode && commune.inseeCode.includes(searchQuery.trim()))
      ).slice(0, 10) // Limit to 10 results
    : [];

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredCommunes.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommunes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectCommune(filteredCommunes[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectCommune = (commune: { name: string; isEligible: boolean; inseeCode?: string }) => {
    onSelectCommune(commune.name, commune.isEligible);
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Search for exact match (case insensitive) by name or INSEE code
    const exactMatch = communes.find(
      (commune) => commune.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
        (commune.inseeCode && commune.inseeCode === searchQuery.trim())
    );
    
    if (exactMatch) {
      handleSelectCommune(exactMatch);
    } else {
      // If no exact match, try to find the first partial match by name or INSEE code
      const partialMatch = communes.find((commune) =>
        commune.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (commune.inseeCode && commune.inseeCode.includes(searchQuery.trim()))
      );
      
      if (partialMatch) {
        handleSelectCommune(partialMatch);
      } else {
        // No match found - still trigger the result with isEligible = false
        onSelectCommune(searchQuery.trim(), false);
        setSearchQuery('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <label 
          htmlFor="commune-search" 
          className="block mb-3"
          style={{ 
            color: 'var(--foreground)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          Saisissez la commune dans laquelle se situe votre logement vacant
        </label>
        
        <style>
          {`
            #commune-search::placeholder {
              color: var(--muted-foreground);
              opacity: 0.6;
              font-style: italic;
            }
          `}
        </style>
        
        <div className="relative flex">
          <input
            ref={inputRef}
            id="commune-search"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: La Rochette, Nantes, 73215..."
            className="flex-1 px-4 py-2.5 border-t border-l border-b transition-colors"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              borderRadius: '4px 0 0 0',
              outline: 'none',
              boxShadow: 'inset 0 -2px 0 0 var(--primary)'
            }}
            aria-autocomplete="list"
            aria-controls="commune-suggestions"
            aria-expanded={showSuggestions && filteredCommunes.length > 0}
          />
          
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2.5 border transition-colors flex items-center justify-center"
            style={{
              borderColor: 'var(--primary)',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: '0 4px 0 0',
              minWidth: '3rem',
              cursor: 'pointer'
            }}
            title="Rechercher"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredCommunes.length > 0 && (
          <ul
            id="commune-suggestions"
            role="listbox"
            className="absolute z-50 w-full mt-1 border overflow-hidden"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--popover)',
              borderRadius: '0',
              boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.1), 0 8px 16px -16px rgba(0, 0, 0, 0.32)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {filteredCommunes.map((commune, index) => (
              <li
                key={index}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => handleSelectCommune(commune)}
                className="px-4 py-2.5 cursor-pointer transition-colors border-b last:border-b-0"
                style={{
                  backgroundColor: selectedIndex === index ? 'var(--muted)' : 'transparent',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-base)'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {commune.name}
              </li>
            ))}
          </ul>
        )}

        {/* No results message */}
        {showSuggestions && searchQuery.trim().length >= 2 && filteredCommunes.length === 0 && (
          <div
            className="absolute z-50 w-full mt-1 px-4 py-2.5 border"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--popover)',
              color: 'var(--muted-foreground)',
              borderRadius: '0',
              boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.1), 0 8px 16px -16px rgba(0, 0, 0, 0.32)',
              fontSize: 'var(--text-base)'
            }}
          >
            Aucune commune trouvée
          </div>
        )}
      </div>
    </div>
  );
}