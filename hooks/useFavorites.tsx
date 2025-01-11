import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Movie {
  imdbID: string;
  Title: string;
  Year?: string;
  Poster?: string;
  [key: string]: any;
}

interface FavoritesContextValue {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (imdbID: string) => void;
  isFavorite: (imdbID: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('Error');
  }
  return ctx;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('@favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.warn('Error loading favorites', error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@favorites', JSON.stringify(favorites)).catch((err) => {
      console.warn('Error saving favorites', err);
    });
  }, [favorites]);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      if (prev.find((m) => m.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFavorite = (imdbID: string) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((m) => m.imdbID === imdbID);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
