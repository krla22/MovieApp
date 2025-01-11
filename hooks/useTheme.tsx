import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('Error')
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const system = Appearance.getColorScheme()
    if (system) {
      setTheme(system)
    }
  }, [])

  useEffect(() => {
    AsyncStorage.getItem('@userTheme').then((saved) => {
      if (saved) {
        setTheme(saved as 'light' | 'dark')
      }
    })
  }, [])

  useEffect(() => {
    AsyncStorage.setItem('@userTheme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
