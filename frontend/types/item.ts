export interface ItemBloqueado {
  id: number;
  codigo_produto: string;
  nome_produto: string;
  quantidade: number;
  motivo_bloqueio: string;
  status: string;
  data_bloqueio: string;
}

export interface ItemBloqueadoCreate {
  codigo_produto: string;
  nome_produto: string;
  quantidade: number;
  motivo_bloqueio: string;
}