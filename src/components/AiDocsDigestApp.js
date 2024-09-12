"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Paper,
	Snackbar,
	IconButton,
	Divider,
	Chip,
	ToggleButton,
	ToggleButtonGroup,
	InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

export default function AiDocsDigestApp() {
	const [sections, setSections] = useState([
		{ id: "1", content: "", title: "", tags: [] }
	]);
	const [combinedMarkdown, setCombinedMarkdown] = useState("");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [darkMode, setDarkMode] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeProject, setActiveProject] = useState("default");
	const [projects, setProjects] = useState(["default"]);
	const [previewMode, setPreviewMode] = useState(false);

	useEffect(() => {
		const savedSections = localStorage.getItem(
			`aiDocsDigestSections_${activeProject}`
		);
		if (savedSections) {
			setSections(JSON.parse(savedSections));
		}
		const savedProjects = localStorage.getItem("aiDocsDigestProjects");
		if (savedProjects) {
			setProjects(JSON.parse(savedProjects));
		}
	}, [activeProject]);

	useEffect(() => {
		localStorage.setItem(
			`aiDocsDigestSections_${activeProject}`,
			JSON.stringify(sections)
		);
	}, [sections, activeProject]);

	useEffect(() => {
		localStorage.setItem("aiDocsDigestProjects", JSON.stringify(projects));
	}, [projects]);

const addSection = useCallback(() => {
  const newId = (sections.length > 0
    ? Math.max(...sections.map((s) => parseInt(s.id)))
    : 0) + 1;
  setSections([
    ...sections,
    { id: newId.toString(), content: "", title: "", tags: [] }
  ]);
}, [sections]);

	const updateSection = (id, field, value) => {
		setSections(
			sections.map((section) =>
				section.id === id ? { ...section, [field]: value } : section
			)
		);
	};

	const removeSection = (id) => {
		setSections(sections.filter((section) => section.id !== id));
	};

const combineMarkdown = useCallback(() => {
  const combined = sections
    .map((section) => `## ${section.title}\n\n${section.content}`)
    .join("\n\n---\n\n");
  setCombinedMarkdown(combined);
  setSnackbarMessage("Markdown combined successfully!");
  setSnackbarOpen(true);
}, [sections]);

const copyToClipboard = useCallback(() => {
  navigator.clipboard.writeText(combinedMarkdown);
  setSnackbarMessage("Copied to clipboard!");
  setSnackbarOpen(true);
}, [combinedMarkdown]);

const downloadMarkdown = useCallback(() => {
  const blob = new Blob([combinedMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${activeProject}_combined_docs.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  setSnackbarMessage("File downloaded!");
  setSnackbarOpen(true);
}, [combinedMarkdown, activeProject]);

	const downloadPDF = () => {
		const doc = new jsPDF();
		doc.text(combinedMarkdown, 10, 10);
		doc.save(`${activeProject}_combined_docs.pdf`);
		setSnackbarMessage("PDF downloaded!");
		setSnackbarOpen(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbarOpen(false);
	};

	const handleDragEnd = (result) => {
		if (!result.destination) {
			return;
		}

		const items = Array.from(sections);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setSections(items);
	};

	const filteredSections = sections.filter(
		(section) =>
			section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			section.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			)
	);

	const handleAddProject = () => {
		const projectName = prompt("Enter new project name:");
		if (projectName && !projects.includes(projectName)) {
			setProjects([...projects, projectName]);
			setActiveProject(projectName);
			setSections([{ id: "1", content: "", title: "", tags: [] }]);
		}
	};



useEffect(() => {
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [handleKeyDown]);

const handleKeyDown = useCallback((e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "s":
        e.preventDefault();
        combineMarkdown();
        break;
      case "d":
        e.preventDefault();
        downloadMarkdown();
        break;
      case "c":
        if (e.shiftKey) {
          e.preventDefault();
          copyToClipboard();
        }
        break;
      case "n":
        e.preventDefault();
        addSection();
        break;
      default:
        break;
    }
  }
}, [combineMarkdown, downloadMarkdown, copyToClipboard, addSection]);

	return (
		<Container
			maxWidth="md"
			sx={{
				bgcolor: darkMode ? "grey.900" : "background.default",
				minHeight: "100vh",
				color: darkMode ? "common.white" : "common.black"
			}}
		>
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					AI Docs Digest
				</Typography>
				<Box
					sx={{
						mb: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					<ToggleButtonGroup
						value={darkMode}
						exclusive
						onChange={() => setDarkMode(!darkMode)}
						aria-label="text alignment"
					>
						<ToggleButton value={true} aria-label="dark mode">
							<DarkModeIcon />
						</ToggleButton>
						<ToggleButton value={false} aria-label="light mode">
							<LightModeIcon />
						</ToggleButton>
					</ToggleButtonGroup>
					<TextField
						select
						value={activeProject}
						onChange={(e) => setActiveProject(e.target.value)}
						SelectProps={{
							native: true
						}}
						sx={{ width: 200 }}
					>
						{projects.map((project) => (
							<option key={project} value={project}>
								{project}
							</option>
						))}
					</TextField>
					<Button onClick={handleAddProject}>New Project</Button>
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
						)
					}}
					sx={{ mb: 2 }}
				/>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="sections">
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{filteredSections.map((section, index) => (
									<Draggable
										key={section.id}
										draggableId={section.id}
										index={index}
									>
										{(provided) => (
											<Paper
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												sx={{
													p: 2,
													mb: 2,
													bgcolor: darkMode ? "grey.800" : "grey.100"
												}}
											>
												<TextField
													fullWidth
													variant="outlined"
													value={section.title}
													onChange={(e) =>
														updateSection(section.id, "title", e.target.value)
													}
													placeholder="Section Title"
													sx={{ mb: 2 }}
												/>
												<TextField
													fullWidth
													multiline
													rows={4}
													variant="outlined"
													value={section.content}
													onChange={(e) =>
														updateSection(section.id, "content", e.target.value)
													}
													placeholder="Paste your documentation here..."
												/>
												<Box
													sx={{
														mt: 1,
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center"
													}}
												>
													<Button
														startIcon={<DeleteIcon />}
														onClick={() => removeSection(section.id)}
														color="error"
													>
														Remove
													</Button>
													<Chip label={`Section ${index + 1}`} />
												</Box>
											</Paper>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
				<Button
					startIcon={<AddIcon />}
					onClick={addSection}
					variant="contained"
					sx={{ mr: 1, mb: 2 }}
				>
					Add Section
				</Button>
				<Button
					onClick={combineMarkdown}
					variant="contained"
					color="primary"
					sx={{ mb: 2 }}
				>
					Combine Markdown
				</Button>
				<Divider sx={{ my: 2 }} />
				<Paper
					sx={{ p: 2, mt: 2, bgcolor: darkMode ? "grey.800" : "grey.100" }}
				>
					<Typography variant="h6">Combined Markdown:</Typography>
					<Box sx={{ display: "flex", mb: 2 }}>
						<Button onClick={() => setPreviewMode(!previewMode)}>
							{previewMode ? "Show Raw Markdown" : "Show Preview"}
						</Button>
					</Box>
					{previewMode ? (
						<Paper sx={{ p: 2, maxHeight: 400, overflow: "auto" }}>
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
								readOnly: true
							}}
							sx={{ mb: 2 }}
						/>
					)}
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Button startIcon={<ContentCopyIcon />} onClick={copyToClipboard}>
							Copy to Clipboard
						</Button>
						<Button
							startIcon={<DownloadIcon />}
							onClick={downloadMarkdown}
							variant="contained"
							color="secondary"
						>
							Download Markdown
						</Button>
						<Button
							startIcon={<DownloadIcon />}
							onClick={downloadPDF}
							variant="contained"
							color="secondary"
						>
							Download PDF
						</Button>
					</Box>
				</Paper>
			</Box>
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				message={snackbarMessage}
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleCloseSnackbar}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		</Container>
	);
}
