import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Content } from './components/layout/Content';
import { ProjectsProvider, SelectedProjectProvider } from './context';
import { TimezonePage } from './components/pages/TimezonePage';

export const App = ({ darkModeDefault = false }) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);

  return (
    <Router>
      <SelectedProjectProvider>
        <ProjectsProvider>
          <Switch>
            {/* Standalone timezone converter page */}
            <Route path="/timezone" component={TimezonePage} />

            {/* Main app */}
            <Route
              path="/"
              render={() => (
                <main
                  data-testid="application"
                  className={darkMode ? 'darkmode' : undefined}
                >
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Content />
                </main>
              )}
            />
          </Switch>
        </ProjectsProvider>
      </SelectedProjectProvider>
    </Router>
  );
};

App.propTypes = {
  darkModeDefault: PropTypes.bool,
};
