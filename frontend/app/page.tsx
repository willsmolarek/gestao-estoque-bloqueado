'use client';

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ItemBloqueado, ItemBloqueadoCreate } from '../types/item';

export default function Home() {
  const [itens, setItens] = useState<ItemBloqueado[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<ItemBloqueadoCreate>({
    codigo_produto: '',
    nome_produto: '',
    quantidade: 1,
    motivo_bloqueio: '',
  });

  const carregarItens = async () => {
    try {
      const response = await api.get<ItemBloqueado[]>('/itens/');
      setItens(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarItens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/itens/', formData);
      setFormData({
        codigo_produto: '',
        nome_produto: '',
        quantidade: 1,
        motivo_bloqueio: '',
      });
      carregarItens();
    } catch (error) {
      console.error('Erro ao cadastrar item:', error);
      alert('Erro ao cadastrar item no estoque.');
    }
  };

  const handleAtualizarStatus = async (id: number, novoStatus: string) => {
    try {
      await api.patch(`/itens/${id}/status`, { status: novoStatus });
      carregarItens();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeletar = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este registro?')) {
      try {
        await api.delete(`/itens/${id}`);
        carregarItens();
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-blue-400">
            Gestão de Estoque - Itens Bloqueados
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Painel de controle e tratativa de produtos retidos no estoque.
          </p>
        </header>

        {/* FORMULÁRIO DE CADASTRO */}
        <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">
            Bloquear Novo Item
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Código / SKU</label>
              <input
                type="text"
                required
                value={formData.codigo_produto}
                onChange={(e) => setFormData({ ...formData, codigo_produto: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: PROD-102030"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Produto</label>
              <input
                type="text"
                required
                value={formData.nome_produto}
                onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: Monitor LED 24"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Motivo do Bloqueio</label>
              <input
                type="text"
                required
                value={formData.motivo_bloqueio}
                onChange={(e) => setFormData({ ...formData, motivo_bloqueio: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ex: Tela Riscada"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded text-sm transition-colors"
              >
                Cadastrar Produto
              </button>
            </div>
          </form>
        </section>

        {/* TABELA DE LISTAGEM */}
        <section className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200">Itens</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Carregando itens...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">PAT ou Código</th>
                    <th className="p-3">Produto</th>
                    <th className="p-3">Qtd</th>
                    <th className="p-3">Motivo</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {itens.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-500">
                        Nenhum item bloqueado encontrado.
                      </td>
                    </tr>
                  ) : (
                    itens.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-750">
                        <td className="p-3 font-mono text-xs">{item.id}</td>
                        <td className="p-3 font-mono text-xs text-blue-300">{item.codigo_produto}</td>
                        <td className="p-3 font-medium text-slate-100">{item.nome_produto}</td>
                        <td className="p-3">{item.quantidade}</td>
                        <td className="p-3 text-slate-400">{item.motivo_bloqueio}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status === 'Bloqueado' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                            item.status === 'Liberado' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                            'bg-amber-900/50 text-amber-300 border border-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button
                            onClick={() => handleAtualizarStatus(item.id, 'Liberado')}
                            className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded"
                          >
                            Liberar
                          </button>
                          <button
                            onClick={() => handleAtualizarStatus(item.id, 'Sucateado')}
                            className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded"
                          >
                            Sucatear
                          </button>
                          <button
                            onClick={() => handleDeletar(item.id)}
                            className="text-xs bg-rose-800 hover:bg-rose-700 text-white px-2 py-1 rounded"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}