# ConvoDocs Frontend

This is the frontend for ConvoDocs, a documentation creation tool for Confluence pages.

## Features

- Dashboard view of documents with filtering by tags, teams, and status
- Document editor with Markdown support
- Team management interface
- Confluence integration for publishing documents

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm start
   \`\`\`

3. Build for production:
   \`\`\`
   npm run build
   \`\`\`

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Main application pages
- `src/types`: TypeScript type definitions
- `src/App.tsx`: Main application component with routing

## Integration with Backend

The frontend is designed to work with the ConvoDocs FastAPI backend. Update the API endpoints in the services to point to your backend server.

## Confluence Integration

To complete the Confluence integration:

1. Set up Confluence API credentials
2. Implement the actual API calls for document publishing
3. Configure authentication for Confluence access
