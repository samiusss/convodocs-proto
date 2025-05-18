export interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  publishedAt?: string
  team: string
  author: string
  tags: string[]
  status: "Draft" | "Published"
}

export interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}
