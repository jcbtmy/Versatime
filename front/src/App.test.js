import { render, screen } from '@testing-library/react';
import VersaTime from './VersaTime';

test('renders learn react link', () => {
  render(<VersaTime />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
