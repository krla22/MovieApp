import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    AsyncStorage.getItem('@recentSearches').then((value) => {
      if (value) {
        setRecentSearches(JSON.parse(value))
      }
    })
  }, [])

  useEffect(() => {
    AsyncStorage.setItem('@recentSearches', JSON.stringify(recentSearches))
  }, [recentSearches])

  function addSearchTerm(term: string) {
    setRecentSearches((previous) => {
      const newList = [term, ...previous.filter((t) => t !== term)]
      return newList.slice(0, 5)
    })
  }

  return { recentSearches, addSearchTerm }
}
