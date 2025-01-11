import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'; 
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Video } from 'expo-av'; 
import { fetchMovieDetails } from '@/scripts/omdbApi'; 
import { useFavoritesContext } from '@/hooks/useFavorites'; 
import { useTheme } from '@/hooks/useTheme';

export default function MovieDetails() {
  const { imdbID } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesContext();
  const { theme } = useTheme();

  useEffect(() => {
    if (!imdbID) return;
    loadDetails(imdbID as string);
  }, [imdbID]);

  async function loadDetails(id: string) {
    setLoading(true);
    try {
      const data = await fetchMovieDetails(id);
      setMovie(data);
    } catch {
      console.warn('Error fetching movie details');
    } finally {
      setLoading(false);
    }
  }

  function handleToggleFavorite() {
    if (!movie) return;
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme === 'dark' ? '#111' : '#fff' }]}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!movie || movie.Response === 'False') {
    return (
      <View style={[styles.center, { backgroundColor: theme === 'dark' ? '#111' : '#fff' }]}>
        <Text style={[styles.errorText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
          Movie not found.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: '#333', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavorite(movie.imdbID);
  const bgColor = theme === 'dark' ? '#111' : '#fff';
  const cardColor = theme === 'dark' ? '#222' : '#f9f9f9';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: bgColor }]}>
      <View style={[styles.bannerContainer, { backgroundColor: cardColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
          <Ionicons name="arrow-back" size={28} color="red" />
        </TouchableOpacity>
        <Image
          source={{
            uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300',
          }}
          style={styles.poster}
        />
        <TouchableOpacity onPress={() => setShowVideo(true)} style={styles.playIconContainer}>
          <Ionicons name="play-circle" size={64} color="white" />
        </TouchableOpacity>
      </View>
      <View style={[styles.infoContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{movie.Title}</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          {movie.Year} | {movie.Rated} | {movie.Runtime}
        </Text>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[styles.favoriteButton, isFav && { backgroundColor: 'gray' }]}
        >
          <Text style={styles.favoriteButtonText}>
            {isFav ? 'Remove Favorite' : 'Add Favorite'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: textColor }]}>Plot Summary</Text>
        <Text style={[styles.plot, { color: textColor }]}>{movie.Plot}</Text>

        <Text style={[styles.sectionHeader, { color: textColor }]}>Cast Overview</Text>
        <CastCarousel actors={movie.Actors} theme={theme} />

        <Text style={[styles.sectionHeader, { color: textColor }]}>User Reviews (IMDB)</Text>
        <Text style={[styles.ratings, { color: textColor }]}>{movie.imdbRating} / 10</Text>

        {movie?.Ratings?.map((rating: any) => (
          <Text key={rating.Source} style={[styles.ratingItem, { color: textColor }]}>
            {rating.Source}: {rating.Value}
          </Text>
        ))}
      </View>

      <Modal visible={showVideo} transparent={true} animationType="slide">
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: 'https://videos.pexels.com/video-files/18394332/18394332-hd_1920_1080_30fps.mp4' }}
            style={styles.video}
            useNativeControls
            resizeMode='contain'
          />
          <TouchableOpacity onPress={() => setShowVideo(false)} style={styles.closeButton}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

function CastCarousel({ actors, theme }: { actors: string; theme: string }) {
  const arr = actors.split(',').map((s) => s.trim());
  return (
    <ScrollView horizontal style={styles.castScroll}>
      {arr.map((actor) => (
        <View
          key={actor}
          style={[
            styles.castCard,
            { backgroundColor: theme === 'dark' ? '#222' : '#eee' },
          ]}
        >
          <Ionicons name="person-circle" size={40} color="gray" style={{ marginBottom: 5 }} />
          <Text style={[styles.castName, { color: theme === 'dark' ? '#ccc' : '#333' }]}>
            {actor}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    marginBottom: 10 
  },
  bannerContainer: { 
    position: 'relative' 
  },
  backButtonAbsolute: { 
    position: 'absolute', 
    left: 16, 
    top: 40, 
    zIndex: 2 
  },
  poster: { 
    width: '100%', 
    height: 300, 
    resizeMode: 'cover' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  playIconContainer: { 
    position: 'absolute', 
    left: '50%', 
    top: '50%', 
    transform: [{ translateX: -32 }, { translateY: -32 }] 
  },
  infoContainer: { 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  subtitle: { 
    fontSize: 14, 
    marginBottom: 10 
  },
  favoriteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  plot: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  castScroll: {
    marginBottom: 16,
  },
  castCard: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  castName: {
    fontSize: 12,
    textAlign: 'center',
  },
  ratings: {
    fontSize: 14,
    marginBottom: 6,
  },
  ratingItem: {
    fontSize: 14,
    marginLeft: 6,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '90%',
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  backButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },  
});
