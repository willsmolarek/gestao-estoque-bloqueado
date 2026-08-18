from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexão com o PostgreSQL: postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
# Altere os valores abaixo de acordo com a sua configuração do PostgreSQL local:
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:2803@localhost:5432/estoque_db"

# O engine é o motor de conexão com o banco
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Criamos uma sessão para executar operações no banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para a criação das nossas tabelas
Base = declarative_base()

# Função auxiliar para obter a conexão com o banco a cada requisição na API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()