import React, { useState } from 'react';
import moment from 'moment';
import { FaSpaceShuttle, FaSun, FaRegPaperPlane, FaRegCalendarAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

export const TaskDate = ({ setTaskDate, showTaskDate, setShowTaskDate }) => {
  const [customDate, setCustomDate] = useState('');

  const handleCustomDate = () => {
    if (customDate) {
      setTaskDate(moment(customDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
      setShowTaskDate(false);
      setCustomDate('');
    }
  };

  return (
    showTaskDate && (
      <div className="task-date" data-testid="task-date-overlay">
        <ul className="task-date__list">
          <li>
            <div
              onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().format('DD/MM/YYYY'));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowTaskDate(false);
                  setTaskDate(moment().format('DD/MM/YYYY'));
                }
              }}
              data-testid="task-date-today"
              tabIndex={0}
              aria-label="Select today as the task date"
              role="button"
            >
              <span>
                <FaSpaceShuttle />
              </span>
              <span>Today</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().add(1, 'day').format('DD/MM/YYYY'));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowTaskDate(false);
                  setTaskDate(moment().add(1, 'day').format('DD/MM/YYYY'));
                }
              }}
              data-testid="task-date-tomorrow"
              role="button"
              tabIndex={0}
              aria-label="Select tomorrow as the task date"
            >
              <span>
                <FaSun />
              </span>
              <span>Tomorrow</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().add(7, 'days').format('DD/MM/YYYY'));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowTaskDate(false);
                  setTaskDate(moment().add(7, 'days').format('DD/MM/YYYY'));
                }
              }}
              data-testid="task-date-next-week"
              aria-label="Select next week as the task date"
              tabIndex={0}
              role="button"
            >
              <span>
                <FaRegPaperPlane />
              </span>
              <span>Next week</span>
            </div>
          </li>
          <li className="task-date__custom">
            <span className="task-date__custom-icon">
              <FaRegCalendarAlt />
            </span>
            <input
              className="task-date__custom-input"
              data-testid="task-date-custom-input"
              type="date"
              value={customDate}
              aria-label="Pick a custom due date"
              onChange={(e) => setCustomDate(e.target.value)}
            />
            <button
              type="button"
              className="task-date__custom-submit"
              data-testid="task-date-custom-submit"
              aria-label="Confirm custom due date"
              onClick={handleCustomDate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCustomDate();
              }}
            >
              OK
            </button>
          </li>
        </ul>
      </div>
    )
  );
};

TaskDate.propTypes = {
  setTaskDate: PropTypes.func.isRequired,
  showTaskDate: PropTypes.bool.isRequired,
  setShowTaskDate: PropTypes.func.isRequired,
};
