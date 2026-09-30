import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TimezonePage } from '../components/pages/TimezonePage';

beforeEach(cleanup);

// Helper: render TimezonePage inside a MemoryRouter (required for <Link>).
const renderPage = () =>
  render(
    <MemoryRouter>
      <TimezonePage />
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('<TimezonePage />', () => {
  describe('Rendering', () => {
    it('renders the page container', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('timezone-page')).toBeTruthy();
    });

    it('renders the page title', () => {
      const { getByText } = renderPage();
      expect(getByText(/Timezone Converter/i)).toBeTruthy();
    });

    it('renders a back link pointing to "/"', () => {
      const { queryByTestId } = renderPage();
      const back = queryByTestId('timezone-page-back');
      expect(back).toBeTruthy();
      expect(back.getAttribute('href')).toBe('/');
    });

    it('renders the datetime input', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-datetime-input')).toBeTruthy();
    });

    it('renders the source timezone select', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-source-select')).toBeTruthy();
    });

    it('renders the target timezone select', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-target-select')).toBeTruthy();
    });

    it('renders the swap button', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-swap-btn')).toBeTruthy();
    });

    it('shows a converted result on initial render (default UTC → New York)', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-result')).toBeTruthy();
      expect(queryByTestId('page-tz-result-value').textContent).not.toBe('');
    });

    it('does not show an error on initial render', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-error')).toBeFalsy();
    });
  });

  // -------------------------------------------------------------------------
  // Source / target selects
  // -------------------------------------------------------------------------
  describe('Timezone selects', () => {
    it('source select defaults to UTC', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-source-select').value).toBe('UTC');
    });

    it('target select defaults to America/New_York', () => {
      const { queryByTestId } = renderPage();
      expect(queryByTestId('page-tz-target-select').value).toBe(
        'America/New_York'
      );
    });

    it('updates the source select when changed', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-source-select'), {
        target: { value: 'Asia/Kolkata' },
      });
      expect(queryByTestId('page-tz-source-select').value).toBe('Asia/Kolkata');
    });

    it('updates the target select when changed', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-target-select'), {
        target: { value: 'Europe/London' },
      });
      expect(queryByTestId('page-tz-target-select').value).toBe('Europe/London');
    });

    it('re-converts when the source timezone changes', () => {
      const { queryByTestId } = renderPage();
      const before = queryByTestId('page-tz-result-value').textContent;

      fireEvent.change(queryByTestId('page-tz-source-select'), {
        target: { value: 'Asia/Tokyo' },
      });

      const after = queryByTestId('page-tz-result-value').textContent;
      // Tokyo is UTC+9, so the converted result should differ from UTC source
      expect(after).not.toBe(before);
    });

    it('re-converts when the target timezone changes', () => {
      const { queryByTestId } = renderPage();
      const before = queryByTestId('page-tz-result-value').textContent;

      fireEvent.change(queryByTestId('page-tz-target-select'), {
        target: { value: 'Asia/Tokyo' },
      });

      const after = queryByTestId('page-tz-result-value').textContent;
      expect(after).not.toBe(before);
    });
  });

  // -------------------------------------------------------------------------
  // Datetime input
  // -------------------------------------------------------------------------
  describe('Datetime input', () => {
    it('updates the input value when changed', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-datetime-input'), {
        target: { value: '2024-06-15T10:30' },
      });
      expect(queryByTestId('page-tz-datetime-input').value).toBe(
        '2024-06-15T10:30'
      );
    });

    it('shows a result after entering a valid datetime', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-datetime-input'), {
        target: { value: '2024-01-15T12:00' },
      });
      expect(queryByTestId('page-tz-result')).toBeTruthy();
    });

    it('clears the result when the datetime input is emptied', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-datetime-input'), {
        target: { value: '' },
      });
      expect(queryByTestId('page-tz-result')).toBeFalsy();
      expect(queryByTestId('page-tz-error')).toBeFalsy();
    });
  });

  // -------------------------------------------------------------------------
  // Swap button
  // -------------------------------------------------------------------------
  describe('Swap button', () => {
    it('swaps source and target timezones', () => {
      const { queryByTestId } = renderPage();

      // Initial state: source=UTC, target=America/New_York
      expect(queryByTestId('page-tz-source-select').value).toBe('UTC');
      expect(queryByTestId('page-tz-target-select').value).toBe(
        'America/New_York'
      );

      fireEvent.click(queryByTestId('page-tz-swap-btn'));

      expect(queryByTestId('page-tz-source-select').value).toBe(
        'America/New_York'
      );
      expect(queryByTestId('page-tz-target-select').value).toBe('UTC');
    });

    it('re-converts after swapping', () => {
      const { queryByTestId } = renderPage();
      const before = queryByTestId('page-tz-result-value').textContent;

      fireEvent.click(queryByTestId('page-tz-swap-btn'));

      // After swap the source/target differ so the result should change
      const after = queryByTestId('page-tz-result-value').textContent;
      expect(after).not.toBe(before);
    });

    it('has the correct aria-label', () => {
      const { queryByTestId } = renderPage();
      expect(
        queryByTestId('page-tz-swap-btn').getAttribute('aria-label')
      ).toBe('Swap source and target timezones');
    });
  });

  // -------------------------------------------------------------------------
  // Conversion result
  // -------------------------------------------------------------------------
  describe('Conversion result', () => {
    it('displays a result for a known conversion (UTC noon → New York)', () => {
      const { queryByTestId } = renderPage();
      fireEvent.change(queryByTestId('page-tz-datetime-input'), {
        target: { value: '2024-01-15T12:00' },
      });
      // UTC noon in winter → New York is UTC-5, so 07:00
      const value = queryByTestId('page-tz-result-value').textContent;
      expect(value).toContain('07:00');
    });

    it('result panel has aria-live="polite"', () => {
      const { queryByTestId } = renderPage();
      expect(
        queryByTestId('page-tz-result').getAttribute('aria-live')
      ).toBe('polite');
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------
  describe('Accessibility', () => {
    it('back link has an aria-label', () => {
      const { queryByTestId } = renderPage();
      expect(
        queryByTestId('timezone-page-back').getAttribute('aria-label')
      ).toBeTruthy();
    });

    it('datetime input has an associated label', () => {
      const { getByLabelText } = renderPage();
      expect(getByLabelText(/Date & Time/i)).toBeTruthy();
    });

    it('source select has an associated label', () => {
      const { getByLabelText } = renderPage();
      expect(getByLabelText(/From Timezone/i)).toBeTruthy();
    });

    it('target select has an associated label', () => {
      const { getByLabelText } = renderPage();
      expect(getByLabelText(/To Timezone/i)).toBeTruthy();
    });
  });
});
