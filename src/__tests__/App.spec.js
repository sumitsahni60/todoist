import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { App } from '../App';

beforeEach(cleanup); // clean meeeeeeeeee!

// Mock firebase so hooks that call firestore() don't throw.
jest.mock('../firebase', () => {
  // A fully chainable mock: every method returns the same object,
  // .onSnapshot immediately invokes with an empty snapshot and returns an unsubscribe fn,
  // .get resolves with an empty snapshot.
  const emptySnapshot = { docs: [] };
  const chain = {};
  chain.where = jest.fn(() => chain);
  chain.orderBy = jest.fn(() => chain);
  chain.collection = jest.fn(() => chain);
  chain.onSnapshot = jest.fn((cb) => {
    if (typeof cb === 'function') cb(emptySnapshot);
    return jest.fn();
  });
  chain.get = jest.fn(() => Promise.resolve(emptySnapshot));
  const firestore = jest.fn(() => chain);
  return { firebase: { firestore } };
});

describe('<App />', () => {
  it('renders the application', () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId('application')).toBeTruthy();
    expect(
      queryByTestId('application').classList.contains('darkmode')
    ).toBeFalsy();
  });

  it('renders the application using dark mode', () => {
    const { queryByTestId } = render(<App darkModeDefault />);
    expect(queryByTestId('application')).toBeTruthy();
    expect(
      queryByTestId('application').classList.contains('darkmode')
    ).toBeTruthy();
  });
});
