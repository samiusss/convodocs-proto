from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="ConvoDocs API", description="API for ConvoDocs - Confluence Documentation Tool")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TeamMemberBase(BaseModel):
    name: str
    email: str
    role: str

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
    description: str

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: str
    created_at: datetime
    members: List[TeamMember] = []

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    title: str
    content: str
    team_id: str
    author_id: str
    tags: List[str] = []

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    team_id: Optional[str] = None
    tags: Optional[List[str]] = None

class Document(DocumentBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    status: str = "Draft"

    class Config:
        orm_mode = True

# Mock database
db = {
    "teams": [],
    "members": [],
    "documents": []
}

# Helper functions
def get_current_time():
    return datetime.now()

# Team endpoints
@app.post("/teams/", response_model=Team, status_code=status.HTTP_201_CREATED)
async def create_team(team: TeamCreate):
    team_id = str(uuid.uuid4())
    new_team = {
        "id": team_id,
        "name": team.name,
        "description": team.description,
        "created_at": get_current_time(),
        "members": []
    }
    db["teams"].append(new_team)
    return new_team

@app.get("/teams/", response_model=List[Team])
async def get_teams():
    return db["teams"]

@app.get("/teams/{team_id}", response_model=Team)
async def get_team(team_id: str):
    for team in db["teams"]:
        if team["id"] == team_id:
            return team
    raise HTTPException(status_code=404, detail="Team not found")

@app.put("/teams/{team_id}", response_model=Team)
async def update_team(team_id: str, team_update: TeamCreate):
    for i, team in enumerate(db["teams"]):
        if team["id"] == team_id:
            db["teams"][i].update({
                "name": team_update.name,
                "description": team_update.description
            })
            return db["teams"][i]
    raise HTTPException(status_code=404, detail="Team not found")

@app.delete("/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(team_id: str):
    for i, team in enumerate(db["teams"]):
        if team["id"] == team_id:
            db["teams"].pop(i)
            # Also remove team members
            db["members"] = [m for m in db["members"] if m["team_id"] != team_id]
            return
    raise HTTPException(status_code=404, detail="Team not found")

# Team member endpoints
@app.post("/teams/{team_id}/members/", response_model=TeamMember, status_code=status.HTTP_201_CREATED)
async def create_team_member(team_id: str, member: TeamMemberCreate):
    # Check if team exists
    team_exists = False
    for team in db["teams"]:
        if team["id"] == team_id:
            team_exists = True
            break
    
    if not team_exists:
        raise HTTPException(status_code=404, detail="Team not found")
    
    member_id = str(uuid.uuid4())
    new_member = {
        "id": member_id,
        "team_id": team_id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
        "created_at": get_current_time()
    }
    
    db["members"].append(new_member)
    
    # Add member to team
    for team in db["teams"]:
        if team["id"] == team_id:
            team_member = {
                "id": member_id,
                "name": member.name,
                "email": member.email,
                "role": member.role,
                "created_at": new_member["created_at"]
            }
            team["members"].append(team_member)
            break
    
    return new_member

@app.get("/teams/{team_id}/members/", response_model=List[TeamMember])
async def get_team_members(team_id: str):
    members = []
    for member in db["members"]:
        if member.get("team_id") == team_id:
            members.append(member)
    return members

@app.delete("/teams/{team_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_member(team_id: str, member_id: str):
    # Remove from members list
    for i, member in enumerate(db["members"]):
        if member["id"] == member_id and member["team_id"] == team_id:
            db["members"].pop(i)
            break
    else:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    # Remove from team's members list
    for team in db["teams"]:
        if team["id"] == team_id:
            team["members"] = [m for m in team["members"] if m["id"] != member_id]
            break

# Document endpoints
@app.post("/documents/", response_model=Document, status_code=status.HTTP_201_CREATED)
async def create_document(document: DocumentCreate):
    # Check if team exists
    team_exists = False
    for team in db["teams"]:
        if team["id"] == document.team_id:
            team_exists = True
            break
    
    if not team_exists:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if author exists
    author_exists = False
    author_name = ""
    for member in db["members"]:
        if member["id"] == document.author_id:
            author_exists = True
            author_name = member["name"]
            break
    
    if not author_exists:
        raise HTTPException(status_code=404, detail="Author not found")
    
    document_id = str(uuid.uuid4())
    now = get_current_time()
    
    new_document = {
        "id": document_id,
        "title": document.title,
        "content": document.content,
        "team_id": document.team_id,
        "author_id": document.author_id,
        "author_name": author_name,
        "tags": document.tags,
        "status": "Draft",
        "created_at": now,
        "updated_at": now,
        "published_at": None
    }
    
    db["documents"].append(new_document)
    return new_document

@app.get("/documents/", response_model=List[Document])
async def get_documents(team_id: Optional[str] = None, status: Optional[str] = None):
    documents = db["documents"]
    
    if team_id:
        documents = [doc for doc in documents if doc["team_id"] == team_id]
    
    if status:
        documents = [doc for doc in documents if doc["status"] == status]
    
    return documents

@app.get("/documents/{document_id}", response_model=Document)
async def get_document(document_id: str):
    for document in db["documents"]:
        if document["id"] == document_id:
            return document
    raise HTTPException(status_code=404, detail="Document not found")

@app.put("/documents/{document_id}", response_model=Document)
async def update_document(document_id: str, document_update: DocumentUpdate):
    for i, document in enumerate(db["documents"]):
        if document["id"] == document_id:
            update_data = document_update.dict(exclude_unset=True)
            
            if "team_id" in update_data:
                # Check if team exists
                team_exists = False
                for team in db["teams"]:
                    if team["id"] == update_data["team_id"]:
                        team_exists = True
                        break
                
                if not team_exists:
                    raise HTTPException(status_code=404, detail="Team not found")
            
            db["documents"][i].update(update_data)
            db["documents"][i]["updated_at"] = get_current_time()
            return db["documents"][i]
    
    raise HTTPException(status_code=404, detail="Document not found")

@app.post("/documents/{document_id}/publish", response_model=Document)
async def publish_document(document_id: str):
    for i, document in enumerate(db["documents"]):
        if document["id"] == document_id:
            if document["status"] == "Published":
                raise HTTPException(status_code=400, detail="Document is already published")
            
            db["documents"][i]["status"] = "Published"
            db["documents"][i]["published_at"] = get_current_time()
            
            # Here you would integrate with Confluence API to publish the document
            # For this example, we'll just update the status
            
            return db["documents"][i]
    
    raise HTTPException(status_code=404, detail="Document not found")

@app.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: str):
    for i, document in enumerate(db["documents"]):
        if document["id"] == document_id:
            db["documents"].pop(i)
            return
    
    raise HTTPException(status_code=404, detail="Document not found")

# Confluence integration endpoints
@app.post("/confluence/sync", status_code=status.HTTP_200_OK)
async def sync_with_confluence():
    # This would be where you implement the Confluence API integration
    # For this example, we'll just return a success message
    return {"message": "Sync with Confluence completed successfully"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to ConvoDocs API",
        "version": "1.0.0",
        "documentation": "/docs"
    }
