"use client";

import React, { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { AppContext, AppProvider } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import ProjectSelector from './ProjectSelector';
import SectionsList from './SectionsList';
import MarkdownPreview from './MarkdownPreview';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorBoundary from './ErrorBoundary';

const AiDocsDigestAppContent = () => {
  const { addSection } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container
      maxWidth="md"
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        color: 'text.primary',
        py: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        AI Docs Digest
      </Typography>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <ThemeToggle />
        <ProjectSelector />
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search sections..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <SectionsList searchTerm={searchTerm} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={addSection}
          variant="contained"
        >
          Add Section
        </Button>
      </Box>
      <MarkdownPreview />
    </Container>
  );
};

export default function AiDocsDigestApp() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AiDocsDigestAppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}