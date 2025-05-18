"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import { Save as SaveIcon, Check as CheckIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon, Visibility as VisibilityIcon } from "@mui/icons-material"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Mock data for document content
const mockDocument = {
  id: "doc-1",
  title: "API Documentation",
  content: `# API Documentation

## Introduction
This document provides information about the RESTful API endpoints available in our service.

## Authentication
All API requests require authentication using an API key.

## Endpoints

### GET /api/users
Returns a list of all users.

### POST /api/users
Creates a new user.

### GET /api/users/{id}
Returns details for a specific user.

### PUT /api/users/{id}
Updates a specific user.

### DELETE /api/users/{id}
Deletes a specific user.`,
  createdAt: new Date().toISOString(),
  team: "Engineering",
  author: "John Doe",
  tags: ["API", "Backend", "Documentation"],
  status: "Draft",
}

// Mock data for available tags and teams
const availableTags = ["API", "Frontend", "Backend", "Database", "Security", "UI/UX", "Testing", "Documentation"]
const availableTeams = ["Engineering", "Product", "Design", "Marketing", "Sales", "Support"]

const DocumentEditor: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  // State for document data
  const [document, setDocument] = useState(mockDocument)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [team, setTeam] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")

  // UI state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  // Load document data
  useEffect(() => {
    // In a real app, this would fetch the document from an API
    // For now, we'll use our mock data
    setTitle(mockDocument.title)
    setContent(mockDocument.content)
    setTeam(mockDocument.team)
    setTags(mockDocument.tags)
  }, [id])

  const handleTeamChange = (event: SelectChangeEvent) => {
    setTeam(event.target.value)
  }

  const handleTagsChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    setTags(newValue)
  }

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "edit" | "preview" | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handleSave = () => {
    // In a real app, this would call an API to save the document
    const updatedDocument = {
      ...document,
      title,
      content,
      team,
      tags,
      updatedAt: new Date().toISOString(),
    }

    console.log("Saving document:", updatedDocument)

    // Show success message
    setSnackbarMessage("Document saved successfully")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }

  const handleConfirmOpen = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false)
  }

  const handleConfirm = () => {
    // In a real app, this would call an API to publish the document to Confluence
    console.log("Publishing document to Confluence:", {
      ...document,
      title,
      content,
      team,
      tags,
      status: "Published",
      publishedAt: new Date().toISOString(),
    })

    // Show success message
    setSnackbarMessage("Document published to Confluence successfully")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Close dialog
    setConfirmDialogOpen(false)

    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/")} variant="outlined">
          Back to Dashboard
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Document Editor
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
          sx={{ mr: 2 }}
        >
          <ToggleButton value="edit" aria-label="edit mode">
            <EditIcon sx={{ mr: 1 }} /> Edit
          </ToggleButton>
          <ToggleButton value="preview" aria-label="preview mode">
            <VisibilityIcon sx={{ mr: 1 }} /> Preview
          </ToggleButton>
        </ToggleButtonGroup>
        <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave} sx={{ mr: 1 }}>
          Save
        </Button>
        <Button variant="contained" color="primary" startIcon={<CheckIcon />} onClick={handleConfirmOpen}>
          Confirm & Publish
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Document Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="team-select-label">Team</InputLabel>
              <Select labelId="team-select-label" value={team} label="Team" onChange={handleTeamChange}>
                {availableTeams.map((teamOption) => (
                  <MenuItem key={teamOption} value={teamOption}>
                    {teamOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              id="tags-input"
              options={availableTags}
              value={tags}
              onChange={handleTagsChange}
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add tags" />}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Document Content
            </Typography>
            {viewMode === "edit" ? (
              <TextField
                multiline
                fullWidth
                minRows={15}
                maxRows={30}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
              />
            ) : (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  minHeight: "300px",
                  maxHeight: "600px",
                  overflow: "auto",
                  "& img": { maxWidth: "100%" },
                  "& table": {
                    borderCollapse: "collapse",
                    width: "100%",
                    "& th, & td": {
                      border: "1px solid rgba(224, 224, 224, 1)",
                      padding: "8px",
                      textAlign: "left",
                    },
                  },
                }}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <Typography variant="h1" gutterBottom {...props} />,
                    h2: (props) => <Typography variant="h2" gutterBottom {...props} />,
                    h3: (props) => <Typography variant="h3" gutterBottom {...props} />,
                    h4: (props) => <Typography variant="h4" gutterBottom {...props} />,
                    h5: (props) => <Typography variant="h5" gutterBottom {...props} />,
                    h6: (props) => <Typography variant="h6" gutterBottom {...props} />,
                    p: (props) => <Typography paragraph {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </Paper>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created by {document.author} on {new Date(document.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Publication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to publish this document to Confluence? Once published, it will be available to all
            users with access to the Confluence space.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm & Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DocumentEditor
