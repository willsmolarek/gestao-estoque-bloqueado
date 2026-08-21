from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ItemBloqueadoBase(BaseModel):
    codigo_produto: str
    nome_produto: str
    quantidade: int
    motivo_bloqueio: str

class ItemBloqueadoCreate(ItemBloqueadoBase):
    pass

class ItemBloqueadoUpdateStatus(BaseModel):
    status: str

class ItemBloqueadoResponse(ItemBloqueadoBase):
    id: int
    status: str
    data_bloqueio: datetime

    class Config:
        from_attributes = True