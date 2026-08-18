from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Estrutura base comum a todos os schemas
class ItemBloqueadoBase(BaseModel):
    codigo_produto: str
    nome_produto: str
    quantidade: int
    motivo_bloqueio: str

# Schema usado na criação do item (herdando os campos base)
class ItemBloqueadoCreate(ItemBloqueadoBase):
    pass

# Schema para atualização do status
class ItemBloqueadoUpdateStatus(BaseModel):
    status: str

# Schema de resposta da API (inclui id e datas geradas automaticamente)
class ItemBloqueadoResponse(ItemBloqueadoBase):
    id: int
    status: str
    data_bloqueio: datetime

    class Config:
        from_attributes = True