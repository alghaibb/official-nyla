'use client'

import { createContext, useContext, useState } from 'react'

interface FilterContextProps {
  categoryFilters: string[]
  setCategoryFilters: React.Dispatch<React.SetStateAction<string[]>>
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
}

export const INITIAL_FILTER = {
  categoryFilters: [],
  setCategoryFilters: () => [],
  sort: '',
  setSort: () => {},
}

const FilterContext = createContext<FilterContextProps>(INITIAL_FILTER)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryFilters, setCategoryFilters] = useState([])
  const [sort, setSort] = useState('-createdAt')

  return (
    <FilterContext.Provider
      value={{
        categoryFilters,
        setCategoryFilters,
        sort,
        setSort,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)
