import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPizzaSlice, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { AddTask } from '../AddTask';
import { TimezoneConverter } from '../TimezoneConverter';

export const Header = ({ darkMode, setDarkMode }) => {
  const [shouldShowMain, setShouldShowMain] = useState(false);
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);
  const [showTimezoneConverter, setShowTimezoneConverter] = useState(false);

  return (
    <header className="header" data-testid="header">
      <nav>
        <div className="logo">
          <img src="/images/logo.png" alt="Todoist" />
        </div>
        <div className="settings">
          <ul>
            <li className="settings__add">
              <button
                data-testid="quick-add-task-action"
                aria-label="Quick add task"
                type="button"
                onClick={() => {
                  setShowQuickAddTask(true);
                  setShouldShowMain(true);
                }}
              >
                +
              </button>
            </li>
            <li className="settings__timezone">
              <button
                data-testid="timezone-converter-action"
                aria-label="Open timezone converter"
                type="button"
                onClick={() => setShowTimezoneConverter(true)}
              >
                <FaGlobe />
              </button>
              <Link
                to="/timezone"
                data-testid="timezone-converter-link"
                aria-label="Open timezone converter page"
                className="settings__timezone-link"
                title="Open as full page"
              >
                <FaExternalLinkAlt />
              </Link>
            </li>
            <li className="settings__darkmode">
              <button
                data-testid="dark-mode-action"
                aria-label="Darkmode on/off"
                type="button"
                onClick={() => setDarkMode(!darkMode)}
              >
                <FaPizzaSlice />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <AddTask
        showAddTaskMain={false}
        shouldShowMain={shouldShowMain}
        showQuickAddTask={showQuickAddTask}
        setShowQuickAddTask={setShowQuickAddTask}
      />

      <TimezoneConverter
        show={showTimezoneConverter}
        onClose={() => setShowTimezoneConverter(false)}
      />
    </header>
  );
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
