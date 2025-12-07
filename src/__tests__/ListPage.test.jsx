import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListPage from '../routes/listPage/listPage';

// Mock apiRequest module
jest.mock('../lib/apiRequest', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { _id: '1', city: 'Paris', address: 'Rue 1', price: 1500, propertyType: 'apartment', type: 'rent', bedroom: 2, bathroom: 1, title: 'Apartment in Paris', images: [] },
    { _id: '2', city: 'London', address: 'Street 2', price: 2500, propertyType: 'house', type: 'buy', bedroom: 3, bathroom: 2, title: 'House in London', images: [] },
    { _id: '3', city: 'Paris', address: 'Rue 3', price: 3000, propertyType: 'apartment', type: 'buy', bedroom: 1, bathroom: 1, title: 'Luxury Apartment', images: [] },
    { _id: '4', city: 'Berlin', address: 'Street 4', price: 800, propertyType: 'condo', type: 'rent', bedroom: 2, bathroom: 1, title: 'Condo in Berlin', images: [] }
  ] }))
}));

describe('ListPage URL Query Parsing', () => {
  
  test('parses city query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?city=paris"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Rue 3/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('parses minPrice query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?minPrice=2000"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Street 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Rue 3/i)).toBeInTheDocument();
      expect(screen.queryByText(/Street 4/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('parses maxPrice query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?maxPrice=2000"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 4/i)).toBeInTheDocument();
      expect(screen.queryByText(/Street 2/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('parses property type query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?property=apartment"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Luxury Apartment/i)).toBeInTheDocument();
      expect(screen.queryByText(/Street 2/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Street 4/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('parses type (rent/buy) query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?type=rent"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 4/i)).toBeInTheDocument();
      expect(screen.queryByText(/Street 2/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('parses bedroom query param and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?bedroom=2"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 4/i)).toBeInTheDocument();
      expect(screen.queryByText(/Luxury Apartment/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('combines multiple query params: city AND minPrice', async () => {
    render(
      <MemoryRouter initialEntries={["/list?city=paris&minPrice=2500"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 3/i)).toBeInTheDocument();
      expect(screen.queryByText(/Rue 1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Street 2/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('combines multiple query params: property AND type AND minPrice', async () => {
    render(
      <MemoryRouter initialEntries={["/list?property=apartment&type=buy&minPrice=2500"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Luxury Apartment/i)).toBeInTheDocument();
      expect(screen.queryByText(/Rue 1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Street 2/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles empty URL query params gracefully', async () => {
    render(
      <MemoryRouter initialEntries={["/list"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Rue 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Street 4/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles invalid price ranges (minPrice > maxPrice) gracefully', async () => {
    render(
      <MemoryRouter initialEntries={["/list?minPrice=5000&maxPrice=1000"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const noResults = screen.queryByText(/Rue 1|Street 2|Rue 3|Street 4/i);
      expect(noResults).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles non-existent city in query params', async () => {
    render(
      <MemoryRouter initialEntries={["/list?city=Tokyo"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const noResults = screen.queryByText(/Rue 1|Street 2|Rue 3|Street 4/i);
      expect(noResults).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('case-insensitive city filtering', async () => {
    render(
      <MemoryRouter initialEntries={["/list?city=PARIS"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Rue 3/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('updates filters when URL params change (via location.search dependency)', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/list?city=paris"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Re-render with different URL params
    rerender(
      <MemoryRouter initialEntries={["/list?city=london"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Street 2/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
