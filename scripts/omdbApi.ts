const API_KEY = 'b9bd48a6'
const BASE_URL = 'https://www.omdbapi.com/'

export async function fetchMoviesBySearch(searchTerm: string, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export async function fetchMovieDetails(imdbID: string) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
  const response = await fetch(url)
  const data = await response.json()
  return data
}
