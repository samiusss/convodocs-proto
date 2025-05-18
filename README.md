# ConvoDocs

ConvoDocs is a documentation management system that allows teams to convert Slack threads into well-structured documentation and sync with Confluence.

## Project Structure

```
convodocs/
├── frontend/     # Next.js frontend application
└── backend/      # FastAPI backend application
```

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Poetry (Python package manager)
- pnpm (Node.js package manager)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Start the FastAPI server:
   ```bash
   poetry run uvicorn main:app --reload
   ```

   The backend will be available at http://localhost:8000
   - API documentation: http://localhost:8000/docs
   - Alternative API docs: http://localhost:8000/redoc

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

   The frontend will be available at http://localhost:3000

## Initial Setup

Before using the application, you need to:

1. Create a team (POST /teams/)
2. Add team members (POST /teams/{team_id}/members/)
3. Create documents (POST /documents/)

You can do this through:
- The Swagger UI at http://localhost:8000/docs
- The frontend interface at http://localhost:3000
- Direct API calls

Example using curl:
```bash
# Create a team
curl -X POST http://localhost:8000/teams/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Engineering", "description": "Engineering team"}'

# Add a team member (replace {team_id} with the ID from previous response)
curl -X POST http://localhost:8000/teams/{team_id}/members/ \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "role": "Engineer"}'

# Create a document (replace {team_id} and {author_id} with IDs from previous responses)
curl -X POST http://localhost:8000/documents/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Document",
    "content": "# Hello World\n\nThis is my first document.",
    "team_id": "{team_id}",
    "author_id": "{author_id}",
    "tags": ["documentation", "getting-started"]
  }'
```

## Development

- Backend uses an in-memory database for development
- CORS is enabled for all origins in development
- Both servers support hot-reload for development

## API Features

- Team management
- Document CRUD operations
- Slack thread conversion
- Confluence integration (planned)
- Markdown support
- Document versioning
- Team collaboration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 