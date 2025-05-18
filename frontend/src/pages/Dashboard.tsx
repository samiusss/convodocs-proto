"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material"
import { Search as SearchIcon, Edit as EditIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material"

// Mock data for documents
const mockDocuments = Array.from({ length: 50 }, (_, index) => ({
  id: `doc-${index + 1}`,
  title: `Document ${index + 1}`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  team: ["Engineering", "Product", "Design", "Marketing"][Math.floor(Math.random() * 4)],
  author: ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"][Math.floor(Math.random() * 4)],
  tags: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => ["API", "Frontend", "Backend", "Database", "Security", "UI/UX", "Testing"][Math.floor(Math.random() * 7)],
  ),
  status: Math.random() > 0.3 ? "Draft" : "Published",
}))

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEditDocument = (documentId: string) => {
    navigate(`/document/${documentId}`)
  }

  const handleConfirmDocument = (documentId: string) => {
    // In a real app, this would call an API to update the document status
    console.log(`Confirming document ${documentId}`)
    // Then maybe refresh the document list or update the local state
  }

  // Filter documents based on search term, team, and status
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      searchTerm === "" ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTeam = selectedTeam === null || doc.team === selectedTeam
    const matchesStatus = selectedStatus === null || doc.status === selectedStatus

    return matchesSearch && matchesTeam && matchesStatus
  })

  // Get unique teams and statuses for filters
  const teams = Array.from(new Set(mockDocuments.map((doc) => doc.team)))
  const statuses = Array.from(new Set(mockDocuments.map((doc) => doc.status)))

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Document Dashboard
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
        }}
      >
        <TextField
          label="Search documents"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: { md: "50%" } }}
        />

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Team:
            </Typography>
            {teams.map((team) => (
              <Chip
                key={team}
                label={team}
                clickable
                color={selectedTeam === team ? "primary" : "default"}
                onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Status:
            </Typography>
            {statuses.map((status) => (
              <Chip
                key={status}
                label={status}
                clickable
                color={selectedStatus === status ? "primary" : "default"}
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>
        </Stack>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
          <Table stickyHeader aria-label="documents table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((document) => (
                <TableRow hover key={document.id}>
                  <TableCell component="th" scope="row">
                    {document.title}
                  </TableCell>
                  <TableCell>{new Date(document.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{document.team}</TableCell>
                  <TableCell>{document.author}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {document.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={document.status}
                      color={document.status === "Published" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditDocument(document.id)}
                      aria-label="edit document"
                    >
                      <EditIcon />
                    </IconButton>
                    {document.status !== "Published" && (
                      <IconButton
                        color="success"
                        onClick={() => handleConfirmDocument(document.id)}
                        aria-label="confirm document"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default Dashboard
