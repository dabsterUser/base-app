import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./supabaseClient', () => ({
  __esModule: true,
  supabase: {
    auth: {
      getSession: jest.fn().mockImplementation(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn().mockImplementation(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      signOut: jest.fn(),
    },
  },
}));

test('renders login heading', async () => {
  render(<App />);
  const linkElement = await waitFor(() => screen.getByText(/Login to your account/i), { timeout: 3000 });
  expect(linkElement).toBeInTheDocument();
});
