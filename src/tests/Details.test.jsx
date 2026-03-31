import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Details from '../Pages/Details/Details'

vi.mock('../Api/Tmdb', () => ({
  fetchMovieDetails: vi.fn(),
  fetchMovieCredits: vi.fn(),
}))

import { fetchMovieDetails, fetchMovieCredits } from '../Api/Tmdb'

const mockMovie = {
  id: 550,
  title: 'Fight Club',
  release_date: '1999-10-15',
  vote_average: 8.4,
  overview: 'An insomniac office worker forms an underground fight club.',
}

const mockCredits = {
  cast: [
    { cast_id: 1, name: 'Brad Pitt', character: 'Tyler Durden' },
    { cast_id: 2, name: 'Edward Norton', character: 'The Narrator' },
  ],
}

beforeEach(() => {
  fetchMovieDetails.mockResolvedValue(mockMovie)
  fetchMovieCredits.mockResolvedValue(mockCredits)
})

function renderDetails(id = '550') {
  return render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<Details />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Details page', () => {
  it('shows a loading state before data arrives', () => {
    // Return a promise that never resolves to keep loading state
    fetchMovieDetails.mockReturnValue(new Promise(() => {}))
    fetchMovieCredits.mockReturnValue(new Promise(() => {}))
    renderDetails()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders the movie title after loading', async () => {
    renderDetails()
    await waitFor(() =>
      expect(screen.getByText('Fight Club')).toBeInTheDocument()
    )
  })

  it('renders the release year after loading', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText(/1999/)).toBeInTheDocument())
  })

  it('renders the rating after loading', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText(/8\.4/)).toBeInTheDocument())
  })

  it('renders the movie overview after loading', async () => {
    renderDetails()
    await waitFor(() =>
      expect(screen.getByText(/insomniac office worker/i)).toBeInTheDocument()
    )
  })

  it('renders cast members after loading', async () => {
    renderDetails()
    await waitFor(() =>
      expect(screen.getByText(/Brad Pitt/)).toBeInTheDocument()
    )
    expect(screen.getByText(/Tyler Durden/)).toBeInTheDocument()
  })

  it('calls fetchMovieDetails with the correct id', async () => {
    renderDetails('550')
    await waitFor(() => expect(fetchMovieDetails).toHaveBeenCalledWith('550'))
  })

  it('calls fetchMovieCredits with the correct id', async () => {
    renderDetails('550')
    await waitFor(() => expect(fetchMovieCredits).toHaveBeenCalledWith('550'))
  })
})
