import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListPage from '../routes/listPage/listPage';

// Mock apiRequest module
jest.mock('../lib/apiRequest', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { _id: '1', city: 'Paris', address: 'Rue 1', price: 1500, propertyType: 'apartment', type: 'rent', bedroom: 2 },
    { _id: '2', city: 'London', address: 'Street 2', price: 2500, propertyType: 'house', type: 'buy', bedroom: 3 }
  ] }))
}));

describe('ListPage', () => {
  test('parses URL query params and filters results', async () => {
    render(
      <MemoryRouter initialEntries={["/list?city=paris&minPrice=1000"]}>
        <Routes>
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </MemoryRouter>
    );

    // wait for the posts to load and the filtered results to appear
    await waitFor(() => {
      expect(screen.getByText(/Rue 1/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
