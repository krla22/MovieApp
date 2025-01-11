import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { fetchMoviesBySearch } from '@/scripts/omdbApi'
import { useFavoritesContext } from '@/hooks/useFavorites'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { useTheme } from '@/hooks/useTheme'
import MovieItem from '@/components/MovieItem'

const DEBOUNCE_DELAY = 500

export default function MoviesListScreen() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('Marvel')
  const [movies, setMovies] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isConnected, setIsConnected] = useState(true)

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesContext()
  const { recentSearches, addSearchTerm } = useRecentSearches()
  const { theme, toggleTheme } = useTheme()

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected === true)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setMovies([])
      setPage(1)
      searchMovies(searchTerm, 1, true)
    }, DEBOUNCE_DELAY)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm])

  async function searchMovies(term: string, pageNumber: number, overwrite = false) {
    if (!term) return
    if (pageNumber === 1) addSearchTerm(term)
    if (!isConnected) return

    setIsLoading(true)
    try {
      const data = await fetchMoviesBySearch(term, pageNumber)
      if (data.Response === 'True') {
        const newMovies = data.Search || []
        setMovies((prev) => (overwrite ? newMovies : [...prev, ...newMovies]))
        setHasMore(newMovies.length > 0)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.warn('Error fetching movies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function loadMore() {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      searchMovies(searchTerm, nextPage)
    }
  }

  function handleMoviePress(movie: any) {
    console.log('About to push route with imdbID:', movie.imdbID);
       router.push(`/details/${movie.imdbID}`);
  }

  function renderFooter() {
    if (!isLoading) return null
    return <ActivityIndicator style={{ margin: 20 }} />
  }

  const backgroundColor = theme === 'dark' ? '#222' : '#fff'
  const textColor = theme === 'dark' ? '#fff' : '#000'
  const containerStyle = [styles.container, { backgroundColor }]
  const titleStyle = [styles.title, { color: textColor }]
  const searchBarStyle = [
    styles.searchBar,
    {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: textColor,
      borderColor: theme === 'dark' ? '#555' : '#ccc'
    }
  ]

  return (
    <View style={containerStyle}>
      {!isConnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}
      <View style={styles.headerRow}>
        <Text style={titleStyle}>Made By Kurt</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Ionicons
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={26}
            color="#fff"
            style={{ marginRight: 16 }}
          />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={searchBarStyle}
        placeholder="Type a movie title..."
        placeholderTextColor={theme === 'dark' ? '#999' : '#888'}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={[styles.recentSearchesTitle, { color: textColor }]}>Recent Searches:</Text>
          <FlatList
            data={recentSearches}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSearchTerm(item)} style={styles.recentSearchButton}>
                <Text style={styles.recentSearchButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onPress={() => handleMoviePress(item)}
            isFavorite={isFavorite(item.imdbID)}
            onToggleFavorite={() => {
              if (isFavorite(item.imdbID)) {
                removeFavorite(item.imdbID)
              } else {
                addFavorite(item)
              }
            }}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16
  },
  offlineContainer: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  toggleButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10
  },
  recentSearchesContainer: {
    marginBottom: 10
  },
  recentSearchesTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  recentSearchButton: {
    backgroundColor: 'red',
    padding: 8,
    marginRight: 5,
    borderRadius: 5
  },
  recentSearchButtonText: {
    color: 'white'
  }
})
