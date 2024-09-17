import React, { useState, useContext, useMemo } from 'react';
import { Button, Paper, Typography, Box, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { AppContext } from '../context/AppContext';
import { combineSectionsToMarkdown } from '../utils/markdownUtils';
import { jsPDF } from 'jspdf';

const MarkdownPreview = () => {
  const { sections, activeProject, darkMode } = useContext(AppContext);
  const [combinedMarkdown, setCombinedMarkdown] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const combined = useMemo(() => combineSectionsToMarkdown(sections), [sections]);

  const combineMarkdown = () => {
    setCombinedMarkdown(combined);
    setSnackbar({ open: true, message: 'Markdown combined successfully!' });
  };

  const copyToClipboard = () => {
    if (combinedMarkdown) {
      navigator.clipboard.writeText(combinedMarkdown);
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    } else {
      setSnackbar({ open: true, message: 'Nothing to copy!' });
    }
  };

  const downloadMarkdown = () => {
    if (combinedMarkdown) {
      const blob = new Blob([combinedMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject}_combined_docs.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: 'Markdown file downloaded!' });
    } else {
      setSnackbar({ open: true, message: 'Nothing to download!' });
    }
  };

  const downloadPDF = () => {
    if (combinedMarkdown) {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(combinedMarkdown, 180);
      doc.text(lines, 10, 10);
      doc.save(`${activeProject}_combined_docs.pdf`);
      setSnackbar({ open: true, message: 'PDF downloaded!' });
    } else {
      setSnackbar({ open: true, message: 'Nothing to download!' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Paper
      sx={{ p: 2, mt: 2, bgcolor: darkMode ? 'grey.800' : 'grey.100' }}
    >
      <Typography variant="h6">Combined Markdown:</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? 'Show Raw Markdown' : 'Show Preview'}
        </Button>
        <Button onClick={combineMarkdown} variant="contained" color="primary">
          Combine Markdown
        </Button>
      </Box>
      {previewMode ? (
        <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto', bgcolor: darkMode ? 'grey.700' : 'white' }}>
          <ReactMarkdown>{combinedMarkdown}</ReactMarkdown>
        </Paper>
      ) : (
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={combinedMarkdown}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />
      )}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          startIcon={<ContentCopyIcon />}
          onClick={copyToClipboard}
          disabled={!combinedMarkdown}
        >
          Copy to Clipboard
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={downloadMarkdown}
          variant="contained"
          color="secondary"
          disabled={!combinedMarkdown}
        >
          Download Markdown
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={downloadPDF}
          variant="contained"
          color="secondary"
          disabled={!combinedMarkdown}
        >
          Download PDF
        </Button>
      </Box>
      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'grey.800',
            color: 'white',
            p: 2,
            borderRadius: 1,
          }}
        >
          {snackbar.message}
          <Button onClick={handleCloseSnackbar} sx={{ ml: 2, color: 'white' }}>
            Close
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default React.memo(MarkdownPreview);