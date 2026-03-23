import { render, screen } from '@testing-library/react';
import App from './App';

test('renders skill tracker title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /skill tracker/i });
  expect(heading).toBeInTheDocument();
});
