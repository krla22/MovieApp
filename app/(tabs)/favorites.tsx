import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFavoritesContext } from '@/hooks/useFavorites'
import { useTheme } from '@/hooks/useTheme'

export default function FavoritesScreen() {
  const { favorites } = useFavoritesContext()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const backgroundColor = theme === 'dark' ? '#222' : '#fff'
  const textColor = theme === 'dark' ? '#fff' : '#000'
  const containerStyle = [styles.container, { backgroundColor }]

  function handlePress(movie: any) {
    router.push(`/details/${movie.imdbID}`)
  }

  if (favorites.length === 0) {
    return (
      <View style={containerStyle}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: textColor }]}>My Favorites</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
            <Ionicons
              name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
              size={26}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#999' : '#666' }]}>
            No favorites yet.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={containerStyle}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: textColor }]}>My Favorites</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Ionicons
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={26}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              { backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9' }
            ]}
            onPress={() => handlePress(item)}
          >
            <Image
              source={{
                uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/150'
              }}
              style={styles.poster}
            />
            <View style={styles.infoContainer}>
              <Text style={[styles.movieTitle, { color: textColor }]}>{item.Title}</Text>
              <Text style={[styles.movieYear, { color: textColor }]}>{item.Year}</Text>
            </View>
          </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden'
  },
  poster: {
    width: 100,
    height: 150,
    backgroundColor: '#eee'
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  movieTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  movieYear: {
    fontSize: 14
  }
})
