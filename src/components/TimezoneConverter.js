import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaGlobe } from 'react-icons/fa';

// A curated list of IANA timezone identifiers with friendly labels.
export const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (ET)', value: 'America/New_York' },
  { label: 'Chicago (CT)', value: 'America/Chicago' },
  { label: 'Denver (MT)', value: 'America/Denver' },
  { label: 'Los Angeles (PT)', value: 'America/Los_Angeles' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Kolkata (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST/NZDT)', value: 'Pacific/Auckland' },
];

/**
 * Format a Date object into the given IANA timezone, returning a
 * human-readable string such as "Mon, 01 Jan 2024, 14:30:00".
 */
export const formatInTimezone = (date, timezone) => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return 'Invalid timezone';
  }
};

/**
 * Parse a "YYYY-MM-DDTHH:mm" local-datetime string as if it were in
 * `sourceTimezone`, and return the equivalent UTC Date.
 */
export const parseLocalDatetime = (datetimeStr, sourceTimezone) => {
  const [datePart, timePart] = datetimeStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // First approximation: treat the string as UTC to get a rough Date.
  const roughUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Find the UTC offset (in minutes) for that instant in the source timezone.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: sourceTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(roughUtc);

  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const tzYear = get('year');
  const tzMonth = get('month');
  const tzDay = get('day');
  const tzHour = get('hour') === 24 ? 0 : get('hour');
  const tzMinute = get('minute');
  const tzSecond = get('second');

  const tzAsUtc = Date.UTC(
    tzYear,
    tzMonth - 1,
    tzDay,
    tzHour,
    tzMinute,
    tzSecond
  );
  const offsetMs = roughUtc.getTime() - tzAsUtc;

  // Shift the rough UTC by the offset to get the true UTC instant.
  return new Date(roughUtc.getTime() + offsetMs);
};

export const TimezoneConverter = ({ show, onClose }) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const defaultDatetime = `${now.getFullYear()}-${pad(
    now.getMonth() + 1
  )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [inputDatetime, setInputDatetime] = useState(defaultDatetime);
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState('');
  const [error, setError] = useState('');

  // Re-convert whenever any input changes.
  useEffect(() => {
    if (!inputDatetime) {
      setConvertedTime('');
      setError('');
      return;
    }
    try {
      const utcDate = parseLocalDatetime(inputDatetime, sourceTimezone);
      setConvertedTime(formatInTimezone(utcDate, targetTimezone));
      setError('');
    } catch (e) {
      setError('Conversion failed. Please check your inputs.');
      setConvertedTime('');
    }
  }, [inputDatetime, sourceTimezone, targetTimezone]);

  if (!show) return null;

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="timezone-converter__overlay"
      data-testid="timezone-converter-overlay"
      role="button"
      tabIndex={-1}
      aria-label="Close timezone converter"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        className="timezone-converter"
        data-testid="timezone-converter"
        role="dialog"
        aria-modal="true"
        aria-label="Timezone Converter"
      >
        {/* Header row */}
        <div className="timezone-converter__header">
          <h2 className="timezone-converter__title">
            <FaGlobe aria-hidden="true" /> Timezone Converter
          </h2>
          <button
            type="button"
            className="timezone-converter__close"
            data-testid="timezone-converter-close"
            aria-label="Close timezone converter"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Date / time input */}
        <div className="timezone-converter__field">
          <label htmlFor="tz-datetime" className="timezone-converter__label">
            <span>Date &amp; Time</span>
            <input
              id="tz-datetime"
              type="datetime-local"
              className="timezone-converter__input"
              data-testid="tz-datetime-input"
              value={inputDatetime}
              onChange={(e) => setInputDatetime(e.target.value)}
            />
          </label>
        </div>

        {/* Source timezone */}
        <div className="timezone-converter__field">
          <label htmlFor="tz-source" className="timezone-converter__label">
            <span>From Timezone</span>
            <select
              id="tz-source"
              className="timezone-converter__select"
              data-testid="tz-source-select"
              value={sourceTimezone}
              onBlur={(e) => setSourceTimezone(e.target.value)}
              onChange={(e) => setSourceTimezone(e.target.value)}
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
          <label htmlFor="tz-target" className="timezone-converter__label">
            <span>To Timezone</span>
            <select
              id="tz-target"
              className="timezone-converter__select"
              data-testid="tz-target-select"
              value={targetTimezone}
              onBlur={(e) => setTargetTimezone(e.target.value)}
              onChange={(e) => setTargetTimezone(e.target.value)}
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
            data-testid="tz-swap-btn"
            aria-label="Swap source and target timezones"
            onClick={() => {
              setSourceTimezone(targetTimezone);
              setTargetTimezone(sourceTimezone);
            }}
          >
            ⇅ Swap
          </button>
        </div>

        {/* Result */}
        {error ? (
          <p
            className="timezone-converter__error"
            data-testid="tz-error"
            role="alert"
          >
            {error}
          </p>
        ) : (
          convertedTime && (
            <div
              className="timezone-converter__result"
              data-testid="tz-result"
              aria-live="polite"
            >
              <span className="timezone-converter__result-label">
                Converted time:
              </span>
              <span
                className="timezone-converter__result-value"
                data-testid="tz-result-value"
              >
                {convertedTime}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

TimezoneConverter.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
