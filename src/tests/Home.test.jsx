import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '../Pages/Home/Home'

// Mock the entire TMDB API module
vi.mock('../Api/Tmdb', () => ({
  fetchTopRated: vi.fn(),
  searchMovies: vi.fn(),
  fetchGenres: vi.fn(),
}))

import { fetchTopRated, searchMovies, fetchGenres } from '../Api/Tmdb'

const mockMovies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    release_date: '1994-09-23',
    vote_average: 9.3,
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    genre_ids: [18],
  },
  {
    id: 2,
    title: 'The Godfather',
    release_date: '1972-03-14',
    vote_average: 9.2,
    poster_path: '/3bhkrj58Vtu7enYsLMdL73ygAVM.jpg',
    genre_ids: [18, 80],
  },
]

const mockGenres = [
  { id: 18, name: 'Drama' },
  { id: 80, name: 'Crime' },
]

beforeEach(() => {
  fetchTopRated.mockResolvedValue({ results: mockMovies })
  fetchGenres.mockResolvedValue({ genres: mockGenres })
  searchMovies.mockResolvedValue({ results: [mockMovies[0]] })
})

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  it('renders the page heading', () => {
    renderHome()
    expect(screen.getByText('Movie Portal')).toBeInTheDocument()
  })

  it('renders the search input', () => {
    renderHome()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders the genre dropdown', () => {
    renderHome()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('loads and displays movies on mount', async () => {
    renderHome()
    await waitFor(() =>
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    )
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
  })

  it('loads and displays genre options', async () => {
    renderHome()
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Drama' })).toBeInTheDocument()
    )
    expect(screen.getByRole('option', { name: 'Crime' })).toBeInTheDocument()
  })

  it('calls searchMovies when user types in the search box', async () => {
    renderHome()
    await waitFor(() => expect(fetchTopRated).toHaveBeenCalled())

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'shawshank' },
    })

    await waitFor(() =>
      expect(searchMovies).toHaveBeenCalledWith('shawshank', 1)
    )
  })

  it('filters movies by genre on the client side', async () => {
    fetchTopRated.mockResolvedValue({ results: mockMovies })
    renderHome()
    await waitFor(() =>
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    )

    // Select genre id 80 (Crime) — only The Godfather has genre_id 80
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '80' } })

    await waitFor(() =>
      expect(screen.queryByText('The Shawshank Redemption')).not.toBeInTheDocument()
    )
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
  })

  it('Previous button is disabled on page 1', () => {
    renderHome()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('Next button is enabled on page 1', () => {
    renderHome()
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })

  it('increments page and fetches new results when Next is clicked', async () => {
    renderHome()
    await waitFor(() => expect(fetchTopRated).toHaveBeenCalledWith(1))

    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => expect(fetchTopRated).toHaveBeenCalledWith(2))
    expect(screen.getByText(/page 2/i)).toBeInTheDocument()
  })
})
