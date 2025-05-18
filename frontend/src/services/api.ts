const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  description: string
  created_at: string
  members: TeamMember[]
}

export interface Document {
  id: string
  title: string
  content: string
  team_id: string
  author_id: string
  author_name: string
  tags: string[]
  status: string
  created_at: string
  updated_at: string | null
  published_at: string | null
}

export interface SlackMessage {
  user: string
  text: string
  timestamp: string
}

export interface SlackThread {
  channel: string
  thread_ts: string
  messages: SlackMessage[]
}

export interface SlackThreadToDoc {
  title: string
  team_id: string
  author_id: string
  threads: SlackThread[]
  tags: string[]
}

// Document API
export const documentsApi = {
  getAll: async (teamId?: string, status?: string): Promise<Document[]> => {
    const params = new URLSearchParams()
    if (teamId) params.append('team_id', teamId)
    if (status) params.append('status', status)
    
    const response = await fetch(`${API_BASE_URL}/documents/?${params}`)
    if (!response.ok) throw new Error('Failed to fetch documents')
    return response.json()
  },

  getById: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`)
    if (!response.ok) throw new Error('Failed to fetch document')
    return response.json()
  },

  create: async (document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'published_at' | 'status' | 'author_name'>): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    })
    if (!response.ok) throw new Error('Failed to create document')
    return response.json()
  },

  update: async (id: string, document: Partial<Document>): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    })
    if (!response.ok) throw new Error('Failed to update document')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete document')
  },

  publish: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/publish`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to publish document')
    return response.json()
  },
}

// Slack API
export const slackApi = {
  convertThreadsToDoc: async (data: SlackThreadToDoc): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/slack/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to convert Slack threads')
    return response.json()
  },
}

// Team API
export const teamsApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await fetch(`${API_BASE_URL}/teams/`)
    if (!response.ok) throw new Error('Failed to fetch teams')
    return response.json()
  },

  getById: async (id: string): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`)
    if (!response.ok) throw new Error('Failed to fetch team')
    return response.json()
  },

  create: async (team: Omit<Team, 'id' | 'created_at' | 'members'>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    })
    if (!response.ok) throw new Error('Failed to create team')
    return response.json()
  },

  update: async (id: string, team: Partial<Team>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    })
    if (!response.ok) throw new Error('Failed to update team')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete team')
  },
} 