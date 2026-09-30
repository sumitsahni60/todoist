import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Header } from '../components/layout/Header';

jest.mock('../context', () => ({
  useSelectedProjectValue: jest.fn(() => ({ selectedProject: 1 })),
  useProjectsValue: jest.fn(() => ({ projects: [] })),
}));

beforeEach(cleanup);

describe('<Header />', () => {
  describe('Success', () => {
    it('renders the header component', () => {
      const { queryByTestId } = render(<Header />);
      expect(queryByTestId('header')).toBeTruthy();
    });

    it('renders the header component and activates dark mode using onClick', () => {
      const darkMode = false;
      const setDarkMode = jest.fn(() => !darkMode);

      const { queryByTestId } = render(
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      );
      expect(queryByTestId('header')).toBeTruthy();

      fireEvent.click(queryByTestId('dark-mode-action'));
      expect(setDarkMode).toHaveBeenCalledWith(true);
    });

    it('renders the header component and set quick add task to true using onClick', () => {
      const darkMode = false;

      const { queryByTestId } = render(<Header darkMode={darkMode} />);
      expect(queryByTestId('header')).toBeTruthy();

      fireEvent.click(queryByTestId('quick-add-task-action'));
      expect(queryByTestId('add-task-main')).toBeTruthy();
    });

    it('renders the timezone converter button in the header', () => {
      const { queryByTestId } = render(
        <Header darkMode={false} setDarkMode={jest.fn()} />
      );
      expect(queryByTestId('timezone-converter-action')).toBeTruthy();
    });

    it('opens the timezone converter dialog when the globe button is clicked', () => {
      const { queryByTestId } = render(
        <Header darkMode={false} setDarkMode={jest.fn()} />
      );

      // Dialog should not be visible before clicking
      expect(queryByTestId('timezone-converter')).toBeFalsy();

      fireEvent.click(queryByTestId('timezone-converter-action'));

      expect(queryByTestId('timezone-converter')).toBeTruthy();
    });

    it('closes the timezone converter dialog when the close button is clicked', () => {
      const { queryByTestId } = render(
        <Header darkMode={false} setDarkMode={jest.fn()} />
      );

      fireEvent.click(queryByTestId('timezone-converter-action'));
      expect(queryByTestId('timezone-converter')).toBeTruthy();

      fireEvent.click(queryByTestId('timezone-converter-close'));
      expect(queryByTestId('timezone-converter')).toBeFalsy();
    });

    it('closes the timezone converter dialog when the overlay backdrop is clicked', () => {
      const { queryByTestId } = render(
        <Header darkMode={false} setDarkMode={jest.fn()} />
      );

      fireEvent.click(queryByTestId('timezone-converter-action'));
      expect(queryByTestId('timezone-converter')).toBeTruthy();

      fireEvent.click(queryByTestId('timezone-converter-overlay'));
      expect(queryByTestId('timezone-converter')).toBeFalsy();
    });
  });
});
