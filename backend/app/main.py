from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Gestão de Estoque - Itens Bloqueados",
    description="API para cadastro, consulta e alteração de status de itens retidos no estoque.",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "online", "mensagem": "API de Gestão de Estoque Bloqueado está pronta!"}

@app.post("/itens/", response_model=schemas.ItemBloqueadoResponse, status_code=status.HTTP_201_CREATED)
def criar_item_bloqueado(item: schemas.ItemBloqueadoCreate, db: Session = Depends(get_db)):
    novo_item = models.ItemBloqueado(**item.model_dump())
    
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    
    return novo_item

@app.get("/itens/", response_model=List[schemas.ItemBloqueadoResponse])
def listar_itens_bloqueados(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    itens = db.query(models.ItemBloqueado).offset(skip).limit(limit).all()
    return itens

@app.get("/itens/{item_id}", response_model=schemas.ItemBloqueadoResponse)
def buscar_item_por_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ItemBloqueado).filter(models.ItemBloqueado.id == item_id).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Item com ID {item_id} não foi encontrado no banco."
        )
    return item

@app.patch("/itens/{item_id}/status", response_model=schemas.ItemBloqueadoResponse)
def atualizar_status_item(
    item_id: int, 
    status_update: schemas.ItemBloqueadoUpdateStatus, 
    db: Session = Depends(get_db)
):
    item = db.query(models.ItemBloqueado).filter(models.ItemBloqueado.id == item_id).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Item com ID {item_id} não foi encontrado no banco."
        )
    
    item.status = status_update.status
    db.commit()
    db.refresh(item)
    
    return item

@app.delete("/itens/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ItemBloqueado).filter(models.ItemBloqueado.id == item_id).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Item com ID {item_id} não foi encontrado no banco."
        )
    
    db.delete(item)
    db.commit()
    return None