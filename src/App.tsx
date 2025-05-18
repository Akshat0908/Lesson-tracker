import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Timeline from './pages/Timeline';
import Dashboard from './pages/Dashboard';
import CoursesLibrary from './pages/CoursesLibrary';
import Settings from './pages/Settings';
import { LessonProvider } from './context/LessonContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LessonProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Timeline />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<CoursesLibrary />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </LessonProvider>
    </ThemeProvider>
  );
}

export default App;