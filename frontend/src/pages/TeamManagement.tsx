"use client"

import type React from "react"
import { useState } from "react"
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Stack,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from "@mui/icons-material"

// Mock data for teams
const initialTeams = [
  {
    id: "team-1",
    name: "Engineering",
    description: "Software development team responsible for building and maintaining the product.",
    members: [
      { id: "user-1", name: "John Doe", email: "john@example.com", role: "Team Lead" },
      { id: "user-2", name: "Jane Smith", email: "jane@example.com", role: "Senior Developer" },
      { id: "user-3", name: "Bob Johnson", email: "bob@example.com", role: "Developer" },
    ],
  },
  {
    id: "team-2",
    name: "Product",
    description: "Product management team responsible for product strategy and roadmap.",
    members: [
      { id: "user-4", name: "Alice Williams", email: "alice@example.com", role: "Product Manager" },
      { id: "user-5", name: "Charlie Brown", email: "charlie@example.com", role: "Product Owner" },
    ],
  },
  {
    id: "team-3",
    name: "Design",
    description: "Design team responsible for user experience and interface design.",
    members: [
      { id: "user-6", name: "David Miller", email: "david@example.com", role: "UX Designer" },
      { id: "user-7", name: "Eva Garcia", email: "eva@example.com", role: "UI Designer" },
    ],
  },
  {
    id: "team-4",
    name: "Marketing",
    description: "Marketing team responsible for promoting the product and brand.",
    members: [
      { id: "user-8", name: "Frank Wilson", email: "frank@example.com", role: "Marketing Manager" },
      { id: "user-9", name: "Grace Lee", email: "grace@example.com", role: "Content Specialist" },
    ],
  },
]

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState(initialTeams)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [teamFormData, setTeamFormData] = useState({ name: "", description: "" })
  const [memberFormData, setMemberFormData] = useState({ name: "", email: "", role: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId)
  }

  const handleOpenTeamDialog = (team?: (typeof teams)[0]) => {
    if (team) {
      setTeamFormData({ name: team.name, description: team.description })
      setIsEditing(true)
      setEditingTeamId(team.id)
    } else {
      setTeamFormData({ name: "", description: "" })
      setIsEditing(false)
      setEditingTeamId(null)
    }
    setDialogOpen(true)
  }

  const handleCloseTeamDialog = () => {
    setDialogOpen(false)
  }

  const handleOpenMemberDialog = (teamId: string, member?: (typeof teams)[0]["members"][0]) => {
    setSelectedTeam(teamId)
    if (member) {
      setMemberFormData({ name: member.name, email: member.email, role: member.role })
      setIsEditing(true)
      setEditingMemberId(member.id)
    } else {
      setMemberFormData({ name: "", email: "", role: "" })
      setIsEditing(false)
      setEditingMemberId(null)
    }
    setMemberDialogOpen(true)
  }

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false)
  }

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeamFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMemberFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMemberFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveTeam = () => {
    if (isEditing && editingTeamId) {
      // Update existing team
      setTeams(
        teams.map((team) =>
          team.id === editingTeamId
            ? { ...team, name: teamFormData.name, description: teamFormData.description }
            : team,
        ),
      )
    } else {
      // Add new team
      const newTeam = {
        id: `team-${Date.now()}`,
        name: teamFormData.name,
        description: teamFormData.description,
        members: [],
      }
      setTeams([...teams, newTeam])
      setSelectedTeam(newTeam.id)
    }
    handleCloseTeamDialog()
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
    if (selectedTeam === teamId) {
      setSelectedTeam(null)
    }
  }

  const handleSaveMember = () => {
    if (!selectedTeam) return

    const updatedTeams = [...teams]
    const teamIndex = updatedTeams.findIndex((team) => team.id === selectedTeam)

    if (teamIndex === -1) return

    if (isEditing && editingMemberId) {
      // Update existing member
      updatedTeams[teamIndex].members = updatedTeams[teamIndex].members.map((member) =>
        member.id === editingMemberId
          ? { ...member, name: memberFormData.name, email: memberFormData.email, role: memberFormData.role }
          : member,
      )
    } else {
      // Add new member
      const newMember = {
        id: `user-${Date.now()}`,
        name: memberFormData.name,
        email: memberFormData.email,
        role: memberFormData.role,
      }
      updatedTeams[teamIndex].members.push(newMember)
    }

    setTeams(updatedTeams)
    handleCloseMemberDialog()
  }

  const handleDeleteMember = (teamId: string, memberId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId ? { ...team, members: team.members.filter((member) => member.id !== memberId) } : team,
      ),
    )
  }

  const selectedTeamData = selectedTeam ? teams.find((team) => team.id === selectedTeam) : null

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Team Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Teams</Typography>
              <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => handleOpenTeamDialog()}>
                Add Team
              </Button>
            </Box>

            <List>
              {teams.map((team) => (
                <ListItem
                  key={team.id}
                  button
                  selected={selectedTeam === team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  sx={{ mb: 1, borderRadius: 1 }}
                >
                  <ListItemText primary={team.name} secondary={`${team.members.length} members`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenTeamDialog(team)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTeam(team.id)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedTeamData ? (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h5">{selectedTeamData.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedTeamData.description}
                  </Typography>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => handleOpenMemberDialog(selectedTeamData.id)}
                >
                  Add Member
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>
                Team Members ({selectedTeamData.members.length})
              </Typography>

              <Grid container spacing={2}>
                {selectedTeamData.members.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>{member.name.charAt(0)}</Avatar>
                          <Typography variant="h6" noWrap>
                            {member.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {member.email}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip size="small" label={member.role} icon={<PersonIcon />} />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenMemberDialog(selectedTeamData.id, member)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteMember(selectedTeamData.id, member.id)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {selectedTeamData.members.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <GroupIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No team members yet. Add your first team member to get started.
                  </Typography>
                </Box>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <GroupIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No team selected
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select a team from the list or create a new one to manage its members.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Team Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseTeamDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Team" : "Add New Team"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              name="name"
              label="Team Name"
              fullWidth
              value={teamFormData.name}
              onChange={handleTeamFormChange}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={teamFormData.description}
              onChange={handleTeamFormChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamDialog}>Cancel</Button>
          <Button onClick={handleSaveTeam} variant="contained" disabled={!teamFormData.name}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={memberDialogOpen} onClose={handleCloseMemberDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              name="name"
              label="Name"
              fullWidth
              value={memberFormData.name}
              onChange={handleMemberFormChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={memberFormData.email}
              onChange={handleMemberFormChange}
            />
            <TextField
              name="role"
              label="Role"
              fullWidth
              value={memberFormData.role}
              onChange={handleMemberFormChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMemberDialog}>Cancel</Button>
          <Button
            onClick={handleSaveMember}
            variant="contained"
            disabled={!memberFormData.name || !memberFormData.email}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TeamManagement
