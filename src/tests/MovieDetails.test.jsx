import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MovieDetails from '../Components/MovieDetails/MovieDetails'

const mockMovie = {
  id: 550,
  title: 'Fight Club',
  release_date: '1999-10-15',
  vote_average: 8.4,
  overview: 'An insomniac office worker forms an underground fight club.',
}

const mockCast = [
  { cast_id: 1, name: 'Brad Pitt', character: 'Tyler Durden' },
  { cast_id: 2, name: 'Edward Norton', character: 'The Narrator' },
]

describe('MovieDetails', () => {
  it('renders the movie title', () => {
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={() => {}} />)
    expect(screen.getByText('Fight Club')).toBeInTheDocument()
  })

  it('renders the release year', () => {
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={() => {}} />)
    expect(screen.getByText(/1999/)).toBeInTheDocument()
  })

  it('renders the rating', () => {
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={() => {}} />)
    expect(screen.getByText(/8\.4/)).toBeInTheDocument()
  })

  it('renders the movie overview', () => {
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={() => {}} />)
    expect(screen.getByText(/insomniac office worker/i)).toBeInTheDocument()
  })

  it('renders all cast members', () => {
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={() => {}} />)
    expect(screen.getByText(/Brad Pitt/)).toBeInTheDocument()
    expect(screen.getByText(/Tyler Durden/)).toBeInTheDocument()
    expect(screen.getByText(/Edward Norton/)).toBeInTheDocument()
  })

  it('renders empty cast list without crashing', () => {
    render(<MovieDetails movie={mockMovie} cast={[]} onBack={() => {}} />)
    expect(screen.getByText('Fight Club')).toBeInTheDocument()
  })

  it('calls onBack when the Back button is clicked', () => {
    const onBack = vi.fn()
    render(<MovieDetails movie={mockMovie} cast={mockCast} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
