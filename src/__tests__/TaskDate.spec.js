import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { TaskDate } from '../components/TaskDate';

beforeEach(cleanup);

describe('<TaskDate />', () => {
  const baseProps = {
    setTaskDate: jest.fn(),
    showTaskDate: true,
    setShowTaskDate: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('renders the overlay when showTaskDate is true', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      expect(queryByTestId('task-date-overlay')).toBeTruthy();
    });

    it('does not render the overlay when showTaskDate is false', () => {
      const { queryByTestId } = render(
        <TaskDate {...baseProps} showTaskDate={false} />
      );
      expect(queryByTestId('task-date-overlay')).toBeFalsy();
    });
  });

  describe('Preset buttons', () => {
    it('calls setTaskDate and setShowTaskDate when Today is clicked', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.click(queryByTestId('task-date-today'));
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });

    it('calls setTaskDate and setShowTaskDate when Today is activated via Enter', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.keyDown(queryByTestId('task-date-today'), {
        key: 'Enter',
        code: 13,
      });
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });

    it('does not call setTaskDate when a non-Enter key is pressed on Today', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.keyDown(queryByTestId('task-date-today'), {
        key: 'a',
        code: 65,
      });
      expect(baseProps.setTaskDate).not.toHaveBeenCalled();
    });

    it('calls setTaskDate and setShowTaskDate when Tomorrow is clicked', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.click(queryByTestId('task-date-tomorrow'));
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });

    it('calls setTaskDate and setShowTaskDate when Tomorrow is activated via Enter', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.keyDown(queryByTestId('task-date-tomorrow'), {
        key: 'Enter',
        code: 13,
      });
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });

    it('calls setTaskDate and setShowTaskDate when Next week is clicked', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.click(queryByTestId('task-date-next-week'));
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });

    it('calls setTaskDate and setShowTaskDate when Next week is activated via Enter', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.keyDown(queryByTestId('task-date-next-week'), {
        key: 'Enter',
        code: 13,
      });
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
      expect(baseProps.setTaskDate).toHaveBeenCalled();
    });
  });

  describe('Custom date input', () => {
    it('renders the custom date input and submit button', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      expect(queryByTestId('task-date-custom-input')).toBeTruthy();
      expect(queryByTestId('task-date-custom-submit')).toBeTruthy();
    });

    it('updates the custom date input value on change', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.change(queryByTestId('task-date-custom-input'), {
        target: { value: '2024-12-25' },
      });
      expect(queryByTestId('task-date-custom-input').value).toBe('2024-12-25');
    });

    it('calls setTaskDate with formatted date and closes overlay on OK click', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.change(queryByTestId('task-date-custom-input'), {
        target: { value: '2024-12-25' },
      });
      fireEvent.click(queryByTestId('task-date-custom-submit'));
      expect(baseProps.setTaskDate).toHaveBeenCalledWith('25/12/2024');
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
    });

    it('calls setTaskDate with formatted date when Enter is pressed on OK button', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      fireEvent.change(queryByTestId('task-date-custom-input'), {
        target: { value: '2024-06-01' },
      });
      fireEvent.keyDown(queryByTestId('task-date-custom-submit'), {
        key: 'Enter',
        code: 13,
      });
      expect(baseProps.setTaskDate).toHaveBeenCalledWith('01/06/2024');
      expect(baseProps.setShowTaskDate).toHaveBeenCalledWith(false);
    });

    it('does not call setTaskDate when OK is clicked with an empty custom date', () => {
      const { queryByTestId } = render(<TaskDate {...baseProps} />);
      // input is empty by default
      fireEvent.click(queryByTestId('task-date-custom-submit'));
      expect(baseProps.setTaskDate).not.toHaveBeenCalled();
      expect(baseProps.setShowTaskDate).not.toHaveBeenCalled();
    });
  });
});
