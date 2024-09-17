import React, { useContext, useCallback } from 'react';
import { TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppContext } from '../context/AppContext';

const ProjectSelector = () => {
  const { projects, activeProject, setActiveProject, addProject } = useContext(AppContext);

  const handleAddProject = useCallback(() => {
    const projectName = prompt('Enter new project name:');
    if (projectName) {
      addProject(projectName);
    }
  }, [addProject]);

  return (
    <>
      <TextField
        select
        value={activeProject}
        onChange={(e) => setActiveProject(e.target.value)}
        SelectProps={{
          native: true,
        }}
        sx={{ width: 200 }}
        variant="outlined"
      >
        {projects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </TextField>
      <Button
        onClick={handleAddProject}
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ ml: 2 }}
      >
        New Project
      </Button>
    </>
  );
};

export default React.memo(ProjectSelector);