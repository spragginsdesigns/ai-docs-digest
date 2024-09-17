import React, { useContext } from 'react';
import { TextField, Button, Box, Chip, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppContext } from '../context/AppContext';
import { Draggable } from 'react-beautiful-dnd';

const Section = ({ section, index }) => {
  const { updateSection, removeSection, darkMode } = useContext(AppContext);

  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: darkMode ? 'grey.800' : 'grey.100',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={section.title}
            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
            placeholder="Section Title"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={section.content}
            onChange={(e) => updateSection(section.id, 'content', e.target.value)}
            placeholder="Paste your documentation here..."
          />
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => removeSection(section.id)}
              color="error"
              variant="outlined"
            >
              Remove
            </Button>
            <Chip label={`Section ${index + 1}`} />
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default React.memo(Section);