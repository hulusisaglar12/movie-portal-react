import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import MovieCard from '../Components/MovieCard/MovieCard'

// Mock useNavigate so we can assert navigation without a real router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockMovie = {
  id: 550,
  title: 'Fight Club',
  release_date: '1999-10-15',
  vote_average: 8.4,
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  genre_ids: [18, 53],
}

function renderCard(movie = mockMovie) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  it('renders the movie title', () => {
    renderCard()
    expect(screen.getByText('Fight Club')).toBeInTheDocument()
  })

  it('renders the release year', () => {
    renderCard()
    expect(screen.getByText('1999')).toBeInTheDocument()
  })

  it('renders the vote average', () => {
    renderCard()
    expect(screen.getByText(/8\.4/)).toBeInTheDocument()
  })

  it('renders a poster image with correct alt text', () => {
    renderCard()
    const img = screen.getByAltText('Fight Club')
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('tmdb.org')
  })

  it('shows a placeholder image when poster_path is null', () => {
    renderCard({ ...mockMovie, poster_path: null })
    const img = screen.getByAltText('Fight Club')
    expect(img.src).toContain('placeholder')
  })

  it('navigates to the movie detail page when clicked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /Fight Club/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/movie/550')
  })

  it('navigates when Enter key is pressed (keyboard accessibility)', () => {
    mockNavigate.mockClear()
    renderCard()
    fireEvent.keyDown(screen.getByRole('button', { name: /Fight Club/i }), {
      key: 'Enter',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/movie/550')
  })

  it('has an accessible aria-label on the card', () => {
    renderCard()
    expect(
      screen.getByRole('button', { name: /view details for fight club/i })
    ).toBeInTheDocument()
  })
})
