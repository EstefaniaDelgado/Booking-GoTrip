import { useEffect, useState } from "react";


const SelectCountry = ({onGetCountry, initialData}) => {
  console.log("data inicial: ", initialData)
    const [countries, setCountries] = useState([]);
    //console.log("Paises: ", countries)
    const [selected, setSelected] = useState(initialData?.country || '');
    const [showDropdown, setShowDropdown] = useState(false);
  
    useEffect(() => {
      fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
          const sorted = data
            .map((country) => ({
              name: country.name.common,
              flag: country.flags.png,
              code: country.cca2
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setCountries(sorted);
        });
    }, []);

    useEffect(() => {
        if (initialData?.country) {
          setSelected(initialData.country);
        }
      }, [initialData]);
  
    const handleSelect = (country) => {
      setSelected(country);
      onGetCountry(country.name)
      setShowDropdown(false);
    };
  
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full border rounded-lg p-2 flex items-center justify-between bg-white shadow"
          type="button"
        >
          {selected ? (
            <div className="flex items-center gap-2">
              <img src={selected.flag} alt="" className="w-6 h-4 rounded-sm" />
              <span>{selected.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Seleccione un país</span>
          )}
          <svg
            className={`w-4 h-4 transform transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
  
        {showDropdown && (
          <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto border rounded-lg bg-white shadow">
            {countries.map((country) => (
              <li
                key={country.code}
                onClick={() => handleSelect(country)}
                className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              >
                <img src={country.flag} alt="" className="w-6 h-4 rounded-sm" />
                <span>{country.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default SelectCountry
