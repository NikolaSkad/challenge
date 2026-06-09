import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async (signal, page = 1, q = '') => {
    const params = new URLSearchParams({ page, limit: 10, ...(q && { q }) });
    const res = await fetch(`/api/items?${params}`, { signal });
    const json = await res.json();
    setItems(json.data);
    setTotal(json.total);
  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);