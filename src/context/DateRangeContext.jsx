import { createContext,  useEffect,  useState } from "react";
import { DATE_RANGE } from "../utils/constantsLocalSorage";


export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    
    const storedDateRange = JSON.parse(localStorage.getItem(DATE_RANGE)) || [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ];

    const [dateRange, setDateRange] = useState(storedDateRange);


    useEffect(() => {
        localStorage.setItem(DATE_RANGE, JSON.stringify(dateRange));
    }, [dateRange]);

    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};

