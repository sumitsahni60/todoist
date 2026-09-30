import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import {
  TimezoneConverter,
  TIMEZONES,
  formatInTimezone,
  parseLocalDatetime,
} from '../components/TimezoneConverter';

beforeEach(cleanup);

// ---------------------------------------------------------------------------
// Helper: formatInTimezone
// ---------------------------------------------------------------------------
describe('formatInTimezone()', () => {
  it('formats a UTC date in UTC', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatInTimezone(date, 'UTC');
    expect(result).toContain('2024');
    expect(result).toContain('12:00');
  });

  it('formats a UTC date in a different timezone', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const utcResult = formatInTimezone(date, 'UTC');
    const nyResult = formatInTimezone(date, 'America/New_York');
    // New York is behind UTC, so the hour should differ
    expect(utcResult).not.toBe(nyResult);
  });

  it('returns "Invalid timezone" for an unknown timezone', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatInTimezone(date, 'Not/ATimezone');
    expect(result).toBe('Invalid timezone');
  });
});

// ---------------------------------------------------------------------------
// Helper: parseLocalDatetime
// ---------------------------------------------------------------------------
describe('parseLocalDatetime()', () => {
  it('parses a UTC datetime string and returns a Date', () => {
    const result = parseLocalDatetime('2024-01-15T12:00', 'UTC');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCHours()).toBe(12);
    expect(result.getUTCMinutes()).toBe(0);
  });

  it('accounts for a positive UTC offset (e.g. Asia/Kolkata UTC+5:30)', () => {
    // 12:00 IST = 06:30 UTC
    const result = parseLocalDatetime('2024-01-15T12:00', 'Asia/Kolkata');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCHours()).toBe(6);
    expect(result.getUTCMinutes()).toBe(30);
  });

  it('accounts for a negative UTC offset (e.g. America/New_York UTC-5 in winter)', () => {
    // 12:00 EST = 17:00 UTC
    const result = parseLocalDatetime('2024-01-15T12:00', 'America/New_York');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCHours()).toBe(17);
  });

  it('round-trips: parse then format returns the original local time', () => {
    const datetimeStr = '2024-06-21T09:30';
    const tz = 'Europe/London';
    const utcDate = parseLocalDatetime(datetimeStr, tz);
    const formatted = formatInTimezone(utcDate, tz);
    // The formatted string should contain the original hour and minute
    expect(formatted).toContain('09:30');
  });
});

// ---------------------------------------------------------------------------
// TIMEZONES constant
// ---------------------------------------------------------------------------
describe('TIMEZONES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(TIMEZONES)).toBe(true);
    expect(TIMEZONES.length).toBeGreaterThan(0);
  });

  it('every entry has a label and a value string', () => {
    TIMEZONES.forEach(({ label, value }) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('contains UTC as the first entry', () => {
    expect(TIMEZONES[0].value).toBe('UTC');
  });
});

// ---------------------------------------------------------------------------
// <TimezoneConverter /> component
// ---------------------------------------------------------------------------
describe('<TimezoneConverter />', () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when show=false', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show={false} onClose={onClose} />
      );
      expect(queryByTestId('timezone-converter')).toBeFalsy();
      expect(queryByTestId('timezone-converter-overlay')).toBeFalsy();
    });

    it('renders the dialog when show=true', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      expect(queryByTestId('timezone-converter-overlay')).toBeTruthy();
      expect(queryByTestId('timezone-converter')).toBeTruthy();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when the close button is clicked', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      fireEvent.click(queryByTestId('timezone-converter-close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the overlay backdrop is clicked', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      // Click directly on the overlay element (not the inner dialog)
      fireEvent.click(queryByTestId('timezone-converter-overlay'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape is pressed on the overlay', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      fireEvent.keyDown(queryByTestId('timezone-converter-overlay'), {
        key: 'Escape',
        code: 'Escape',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does NOT call onClose for non-Escape keys on the overlay', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      fireEvent.keyDown(queryByTestId('timezone-converter-overlay'), {
        key: 'Enter',
        code: 'Enter',
      });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('form controls', () => {
    it('renders the datetime input with a default value', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const input = queryByTestId('tz-datetime-input');
      expect(input).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('renders source and target timezone selects', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      expect(queryByTestId('tz-source-select')).toBeTruthy();
      expect(queryByTestId('tz-target-select')).toBeTruthy();
    });

    it('source select defaults to UTC', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      expect(queryByTestId('tz-source-select').value).toBe('UTC');
    });

    it('target select defaults to America/New_York', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      expect(queryByTestId('tz-target-select').value).toBe('America/New_York');
    });

    it('populates both selects with all TIMEZONES options', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const sourceOptions = queryByTestId('tz-source-select').options;
      const targetOptions = queryByTestId('tz-target-select').options;
      expect(sourceOptions.length).toBe(TIMEZONES.length);
      expect(targetOptions.length).toBe(TIMEZONES.length);
    });

    it('updates the datetime input when changed', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const input = queryByTestId('tz-datetime-input');
      fireEvent.change(input, { target: { value: '2024-03-10T08:30' } });
      expect(input.value).toBe('2024-03-10T08:30');
    });

    it('updates the source timezone select when changed', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const select = queryByTestId('tz-source-select');
      fireEvent.change(select, { target: { value: 'Asia/Tokyo' } });
      expect(select.value).toBe('Asia/Tokyo');
    });

    it('updates the target timezone select when changed', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const select = queryByTestId('tz-target-select');
      fireEvent.change(select, { target: { value: 'Europe/London' } });
      expect(select.value).toBe('Europe/London');
    });
  });

  describe('swap button', () => {
    it('renders the swap button', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      expect(queryByTestId('tz-swap-btn')).toBeTruthy();
    });

    it('swaps source and target timezones when clicked', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const sourceSelect = queryByTestId('tz-source-select');
      const targetSelect = queryByTestId('tz-target-select');

      // Set known values first
      fireEvent.change(sourceSelect, { target: { value: 'Europe/Paris' } });
      fireEvent.change(targetSelect, { target: { value: 'Asia/Tokyo' } });

      expect(sourceSelect.value).toBe('Europe/Paris');
      expect(targetSelect.value).toBe('Asia/Tokyo');

      fireEvent.click(queryByTestId('tz-swap-btn'));

      expect(sourceSelect.value).toBe('Asia/Tokyo');
      expect(targetSelect.value).toBe('Europe/Paris');
    });
  });

  describe('conversion result', () => {
    it('shows a converted time result on initial render', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      // Default state has a valid datetime and two valid timezones,
      // so the result panel should be visible immediately.
      expect(queryByTestId('tz-result')).toBeTruthy();
      expect(queryByTestId('tz-result-value')).toBeTruthy();
      expect(
        queryByTestId('tz-result-value').textContent.length
      ).toBeGreaterThan(0);
    });

    it('updates the result when the datetime input changes', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const before = queryByTestId('tz-result-value').textContent;

      act(() => {
        fireEvent.change(queryByTestId('tz-datetime-input'), {
          target: { value: '2024-07-04T15:00' },
        });
      });

      const after = queryByTestId('tz-result-value').textContent;
      expect(after).not.toBe(before);
      // Source=UTC, target=America/New_York (UTC-4 in July): 15:00→11:00
      expect(after).toContain('2024');
    });

    it('updates the result when the source timezone changes', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      // Fix the datetime so only the timezone changes
      fireEvent.change(queryByTestId('tz-datetime-input'), {
        target: { value: '2024-06-15T12:00' },
      });
      const before = queryByTestId('tz-result-value').textContent;

      act(() => {
        fireEvent.change(queryByTestId('tz-source-select'), {
          target: { value: 'Asia/Tokyo' },
        });
      });

      const after = queryByTestId('tz-result-value').textContent;
      expect(after).not.toBe(before);
    });

    it('updates the result when the target timezone changes', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      fireEvent.change(queryByTestId('tz-datetime-input'), {
        target: { value: '2024-06-15T12:00' },
      });
      const before = queryByTestId('tz-result-value').textContent;

      act(() => {
        fireEvent.change(queryByTestId('tz-target-select'), {
          target: { value: 'Australia/Sydney' },
        });
      });

      const after = queryByTestId('tz-result-value').textContent;
      expect(after).not.toBe(before);
    });

    it('hides the result panel when the datetime input is cleared', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      act(() => {
        fireEvent.change(queryByTestId('tz-datetime-input'), {
          target: { value: '' },
        });
      });
      expect(queryByTestId('tz-result')).toBeFalsy();
    });

    it('converts UTC noon to the correct New York time in winter', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      // Source = UTC, target = America/New_York (UTC-5 in January)
      fireEvent.change(queryByTestId('tz-source-select'), {
        target: { value: 'UTC' },
      });
      fireEvent.change(queryByTestId('tz-target-select'), {
        target: { value: 'America/New_York' },
      });
      act(() => {
        fireEvent.change(queryByTestId('tz-datetime-input'), {
          target: { value: '2024-01-15T12:00' },
        });
      });
      const result = queryByTestId('tz-result-value').textContent;
      // 12:00 UTC → 07:00 EST
      expect(result).toContain('07:00');
    });
  });

  describe('accessibility', () => {
    it('the dialog has role="dialog" and aria-modal="true"', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const dialog = queryByTestId('timezone-converter');
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('the close button has an aria-label', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const btn = queryByTestId('timezone-converter-close');
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });

    it('the swap button has an aria-label', () => {
      const { queryByTestId } = render(
        <TimezoneConverter show onClose={onClose} />
      );
      const btn = queryByTestId('tz-swap-btn');
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });
});
