// components/MovieItem.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useTheme } from '@/hooks/useTheme'

interface MovieItemProps {
  movie: any
  onPress: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function MovieItem({ movie, onPress, isFavorite, onToggleFavorite }: MovieItemProps) {
  const { theme } = useTheme()
  const backgroundColor = theme === 'dark' ? '#333' : '#f9f9f9'
  const textColor = theme === 'dark' ? '#fff' : '#333'

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150' }}
        style={styles.poster}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: textColor }]}>{movie.Title}</Text>
        <Text style={[styles.subTitle, { color: textColor }]}>{movie.Year}</Text>
        <Text style={[styles.subTitle, { color: textColor }]}>
          {movie.Type
            ? movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)
            : ''}
        </Text>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Text style={{ color: '#fff' }}>
            {isFavorite ? 'Remove Favorite' : 'Add to Favorite'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  subTitle: {
    fontSize: 14
  },
  favoriteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start'
  }
})
