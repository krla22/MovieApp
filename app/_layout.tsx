import React from 'react'
import { Stack } from 'expo-router'
import { FavoritesProvider } from '@/hooks/useFavorites'
import { ThemeProvider } from '@/hooks/useTheme'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: 'red'
          }}
        />
      </FavoritesProvider>
    </ThemeProvider>
  )
}
