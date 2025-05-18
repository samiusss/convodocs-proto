# ConvoDocs Backend

This is the backend for ConvoDocs, a documentation creation tool for Confluence pages.

## Setup

1. Create a virtual environment:
   \`\`\`
   python -m venv venv
   \`\`\`

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

4. Run the server:
   \`\`\`
   uvicorn main:app --reload
   \`\`\`

5. Access the API documentation at http://localhost:8000/docs

## API Endpoints

The API provides endpoints for:

- Team management
- Team member management
- Document management
- Confluence integration

See the Swagger documentation for detailed API information.

## Confluence Integration

To integrate with Confluence, you'll need to:

1. Set up Confluence API credentials
2. Implement the actual API calls in the `/confluence/sync` endpoint
3. Configure webhook handlers for real-time updates

## Development

This is a FastAPI application. To extend it:

1. Add new models in the models section
2. Create new endpoints as needed
3. Implement database integration (currently using in-memory storage)
