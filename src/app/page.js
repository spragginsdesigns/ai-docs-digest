// src/app/page.js
"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AiDocsDigestApp from "../components/AiDocsDigestApp";

const darkTheme = createTheme({
	palette: {
		mode: "dark"
	}
});

export default function Home() {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<AiDocsDigestApp />
		</ThemeProvider>
	);
}
