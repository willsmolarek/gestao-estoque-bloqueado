from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class ItemBloqueado(Base):
    __tablename__ = "itens_bloqueados"

    id = Column(Integer, primary_key=True, index=True)
    codigo_produto = Column(String, index=True, nullable=False)
    nome_produto = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)
    motivo_bloqueio = Column(String, nullable=False) # Ex: Avaria, Qualidade, Devolução
    status = Column(String, default="Bloqueado")    # Ex: Bloqueado, Em Análise, Liberado, Descartado
    data_bloqueio = Column(DateTime, default=datetime.utcnow)