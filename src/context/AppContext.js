import React, { createContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';

// Create Context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useLocalStorage('aiDocsDigestProjects', ['default']);
  const [activeProject, setActiveProject] = useLocalStorage('activeProject', 'default');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

  // Initialize sections as an empty array
  const [sections, setSections] = useState([]);

  // Load sections from localStorage when activeProject changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSections = window.localStorage.getItem(`aiDocsDigestSections_${activeProject}`);
      if (savedSections) {
        setSections(JSON.parse(savedSections));
      } else {
        setSections([{ id: uuidv4(), content: '', title: '', tags: [] }]);
      }
    }
  }, [activeProject]);

  // Save sections to localStorage when sections change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`aiDocsDigestSections_${activeProject}`, JSON.stringify(sections));
    }
  }, [sections, activeProject]);

  // Add a new section
  const addSection = useCallback(() => {
    const newSection = { id: uuidv4(), content: '', title: '', tags: [] };
    setSections(prevSections => [...prevSections, newSection]);
  }, [setSections]);

  // Remove a section by ID
  const removeSection = useCallback(
    (id) => {
      setSections(prevSections => prevSections.filter(section => section.id !== id));
    },
    [setSections]
  );

  // Update a section's field
  const updateSection = useCallback(
    (id, field, value) => {
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    },
    [setSections]
  );

  // Toggle theme
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, [setDarkMode]);

  // Add a new project
  const addProject = useCallback(
    (projectName) => {
      const trimmedName = projectName.trim();
      if (trimmedName && !projects.includes(trimmedName)) {
        setProjects(prevProjects => [...prevProjects, trimmedName]);
        setActiveProject(trimmedName);
        setSections([{ id: uuidv4(), content: '', title: '', tags: [] }]);
      } else {
        alert('Invalid or duplicate project name.');
      }
    },
    [projects, setProjects, setActiveProject, setSections]
  );

  return (
    <AppContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        addProject,
        sections,
        addSection,
        removeSection,
        updateSection,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};