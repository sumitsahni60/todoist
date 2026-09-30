import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  TimezoneConverter,
  TIMEZONES,
  formatInTimezone,
  parseLocalDatetime,
} from '../TimezoneConverter';

/**
 * Standalone page that renders the Timezone Converter at the /timezone route.
 * The converter is always visible (no modal toggle needed here).
 */
export const TimezonePage = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const defaultDatetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [inputDatetime, setInputDatetime] = useState(defaultDatetime);
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState(() => {
    try {
      const utcDate = parseLocalDatetime(defaultDatetime, 'UTC');
      return formatInTimezone(utcDate, 'America/New_York');
    } catch {
      return '';
    }
  });
  const [error, setError] = useState('');

  const handleDatetimeChange = (e) => {
    const val = e.target.value;
    setInputDatetime(val);
    convert(val, sourceTimezone, targetTimezone);
  };

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSourceTimezone(val);
    convert(inputDatetime, val, targetTimezone);
  };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTargetTimezone(val);
    convert(inputDatetime, sourceTimezone, val);
  };

  const handleSwap = () => {
    const newSource = targetTimezone;
    const newTarget = sourceTimezone;
    setSourceTimezone(newSource);
    setTargetTimezone(newTarget);
    convert(inputDatetime, newSource, newTarget);
  };

  const convert = (datetime, source, target) => {
    if (!datetime) {
      setConvertedTime('');
      setError('');
      return;
    }
    try {
      const utcDate = parseLocalDatetime(datetime, source);
      setConvertedTime(formatInTimezone(utcDate, target));
      setError('');
    } catch {
      setError('Conversion failed. Please check your inputs.');
      setConvertedTime('');
    }
  };

  return (
    <div className="timezone-page" data-testid="timezone-page">
      <div className="timezone-page__header">
        <Link
          to="/"
          className="timezone-page__back"
          data-testid="timezone-page-back"
          aria-label="Back to app"
        >
          <FaArrowLeft aria-hidden="true" /> Back
        </Link>
        <h1 className="timezone-page__title">🌐 Timezone Converter</h1>
      </div>

      <div className="timezone-page__card">
        {/* Date / time input */}
        <div className="timezone-converter__field">
          <label htmlFor="page-tz-datetime" className="timezone-converter__label">
            <span>Date &amp; Time</span>
            <input
              id="page-tz-datetime"
              type="datetime-local"
              className="timezone-converter__input"
              data-testid="page-tz-datetime-input"
              value={inputDatetime}
              onChange={handleDatetimeChange}
            />
          </label>
        </div>

        {/* Source timezone */}
        <div className="timezone-converter__field">
          <label htmlFor="page-tz-source" className="timezone-converter__label">
            <span>From Timezone</span>
            <select
              id="page-tz-source"
              className="timezone-converter__select"
              data-testid="page-tz-source-select"
              value={sourceTimezone}
              onChange={handleSourceChange}
              onBlur={handleSourceChange}
            >
              {TIMEZONES.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Target timezone */}
        <div className="timezone-converter__field">
          <label htmlFor="page-tz-target" className="timezone-converter__label">
            <span>To Timezone</span>
            <select
              id="page-tz-target"
              className="timezone-converter__select"
              data-testid="page-tz-target-select"
              value={targetTimezone}
              onChange={handleTargetChange}
              onBlur={handleTargetChange}
            >
              {TIMEZONES.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Swap button */}
        <div className="timezone-converter__swap-row">
          <button
            type="button"
            className="timezone-converter__swap"
            data-testid="page-tz-swap-btn"
            aria-label="Swap source and target timezones"
            onClick={handleSwap}
          >
            ⇅ Swap
          </button>
        </div>

        {/* Result */}
        {error ? (
          <p
            className="timezone-converter__error"
            data-testid="page-tz-error"
            role="alert"
          >
            {error}
          </p>
        ) : (
          convertedTime && (
            <div
              className="timezone-converter__result"
              data-testid="page-tz-result"
              aria-live="polite"
            >
              <span className="timezone-converter__result-label">
                Converted time:
              </span>
              <span
                className="timezone-converter__result-value"
                data-testid="page-tz-result-value"
              >
                {convertedTime}
              </span>
            </div>
          )
        )}
      </div>

      {/* Keep the modal component importable from this page for reuse */}
      <TimezoneConverter show={false} onClose={() => {}} />
    </div>
  );
};

export default TimezonePage;
