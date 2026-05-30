import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './PainelRestaurante.css';
import HistoricoRestaurante from './HistoricoRestaurante';

interface ItemPedido {
  id: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

interface Pedido {
  id: number;
  data: string;
  status: string;
  nomeCliente: string;
  telefoneCliente: string;
  itens: ItemPedido[];
  total: number;
  restaurante?: {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    latitude?: number;
    longitude?: number;
  };
}

interface PainelProps {
  restauranteId?: number;
  onVoltar?: () => void;
}

const PainelRestaurante: React.FC<PainelProps> = ({ restauranteId, onVoltar }) => {
  const params = useParams<{ restauranteId: string }>();
  const restauranteIdFinal = restauranteId ?? Number(params.restauranteId);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [nomeProd, setNomeProd] = useState('');
  const [descProd, setDescProd] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [msgOk, setMsgOk] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  const [nomeRestaurante, setNomeRestaurante] = useState<string>('');
  const [enderecoRestaurante, setEnderecoRestaurante] = useState<string>('');
  const [telefoneRestaurante, setTelefoneRestaurante] = useState<string>('');

  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const navigate = useNavigate();

  const CLOUD_NAME = 'dcc1ltcod';
  const UPLOAD_PRESET = 'larica_preset';

  const carregarPedidos = async () => {
    console.log(`🔍 Buscando pedidos para restaurante ${restauranteIdFinal}`);
    
    try {
      const response = await api.get(`/pedidos/restaurante/${restauranteIdFinal}`);
      
      const pedidosConvertidos = (response.data || []).map((pedidoHist: any) => {
        const total = pedidoHist.itens.reduce((soma: number, item: any) => {
          const preco = typeof item.precoUnitario === 'string'
            ? parseFloat(item.precoUnitario)
            : item.precoUnitario || 0;
          return soma + (preco * item.quantidade);
        }, 0);
        
        return {
          id: pedidoHist.pedidoId,
          data: pedidoHist.data.includes('T') ? pedidoHist.data : `${pedidoHist.data}T12:00:00`,
          status: pedidoHist.status,
          nomeCliente: pedidoHist.nomeCliente || 'Cliente',
          telefoneCliente: pedidoHist.telefoneCliente || '',
          itens: pedidoHist.itens.map((item: any) => ({
            id: item.id,
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            precoUnitario: typeof item.precoUnitario === 'string'
              ? parseFloat(item.precoUnitario)
              : item.precoUnitario
          })),
          total: total,
          restaurante: {
            id: restauranteIdFinal,
            nome: nomeRestaurante,
            endereco: enderecoRestaurante,
            telefone: telefoneRestaurante
          }
        };
      });
      
      setPedidos(pedidosConvertidos);
      setErro(null);
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar pedidos:', err);
      setErro('Erro ao carregar pedidos. Tente novamente.');
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  };

  const carregarDadosRestaurante = async () => {
    try {
      const r = await api.get(`/restaurantes/${restauranteIdFinal}`);
      setNomeRestaurante(r.data?.nome || '');
      setEnderecoRestaurante(r.data?.endereco || '');
      setTelefoneRestaurante(r.data?.telefone || '');
    } catch (err) {
      console.error('Erro ao buscar restaurante:', err);
      setNomeRestaurante('');
      setEnderecoRestaurante('');
      setTelefoneRestaurante('');
    }
  };

  useEffect(() => {
    if (!restauranteIdFinal || Number.isNaN(restauranteIdFinal)) {
      setErro('ID do restaurante inválido');
      setCarregando(false);
      return;
    }
    
    const carregarTudo = async () => {
      await carregarDadosRestaurante();
      await carregarPedidos();
    };
    
    carregarTudo();
  }, [restauranteIdFinal]);

  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    try {
      await api.patch(
        `/restaurantes/${restauranteIdFinal}/pedidos/${pedidoId}/status`,
        null,
        { params: { status: novoStatus } }
      );
      await carregarPedidos();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setErro('Erro ao atualizar status do pedido');
    }
  };

  const coopStorageKey = (id: number) => `coop_whats_${id}`;
  const limparNaoDigitos = (s: string) => s.replace(/\D+/g, '');

  const normalizarNumero = (raw: string) => {
    let n = limparNaoDigitos(raw);
    if (!n.startsWith('55') && (n.length === 10 || n.length === 11)) {
      n = '55' + n;
    }
    return n;
  };

  const obterOuConfigurarCooperativa = (): string | null => {
    const key = coopStorageKey(restauranteIdFinal);
    const atual = localStorage.getItem(key);
    if (atual) return atual;

    const informado = window.prompt(
      'Informe o WhatsApp da cooperativa/motoboy (com DDI/DDD). Ex.: 5584XXXXXXXXX'
    );
    if (!informado) return null;

    const numero = normalizarNumero(informado);
    if (!/^55\d{10,13}$/.test(numero)) {
      alert('Número inválido. Use DDI 55 + DDD + número.');
      return null;
    }
    localStorage.setItem(key, numero);
    return numero;
  };

  const configurarCooperativa = () => {
    const key = coopStorageKey(restauranteIdFinal);
    const atual = localStorage.getItem(key) || '';
    const informado = window.prompt(
      'Definir/alterar WhatsApp da cooperativa (com DDI/DDD).',
      atual
    );
    if (!informado) return;
    const numero = normalizarNumero(informado);
    if (!/^55\d{10,13}$/.test(numero)) {
      alert('Número inválido. Use DDI 55 + DDD + número.');
      return;
    }
    localStorage.setItem(key, numero);
    alert('Número salvo com sucesso!');
  };

  const chamarMeuEntregador = async (pedido: Pedido) => {
    const numero = obterOuConfigurarCooperativa();
    if (!numero) return;

    const nomeRest = pedido.restaurante?.nome || nomeRestaurante || 'Restaurante';
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/auth/donos/entregador/pedido/${pedido.id}/rota`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      const restLat = data.latRestaurante;
      const restLng = data.lngRestaurante;
      const enderecoCliente = data.enderecoCliente;
      
      let mapsUrl: string;
      if (enderecoCliente && enderecoCliente.trim() !== '') {
        const enderecoEncoded = encodeURIComponent(enderecoCliente);
        mapsUrl = `https://www.google.com/maps/dir/${restLat},${restLng}/${enderecoEncoded}`;
      } else {
        mapsUrl = `https://www.google.com/maps/dir/${restLat},${restLng}/-5.7945,-35.211`;
      }
      
      const mensagem = 
        `🚚 *LARICA - ENTREGA DISPONÍVEL* 🚚\n\n` +
        `*Pedido:* #${pedido.id}\n` +
        `*Restaurante:* ${nomeRest}\n` +
        `📍 *Restaurante:* ${pedido.restaurante?.endereco || enderecoRestaurante}\n` +
        `🏠 *Cliente:* ${enderecoCliente || 'Endereço não informado'}\n\n` +
        `🗺️ *ROTA:*\n${mapsUrl}\n\n` +
        `💰 *Valor sugerido:* R$ 15,00\n` +
        `⏰ *Prazo:* 30 minutos`;
      
      window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
      
    } catch (err) {
      console.error('Erro ao gerar rota:', err);
      alert('Erro ao gerar rota. Tente novamente.');
    }
  };

  const postarNoGrupoWhatsApp = async (pedido: Pedido) => {
    const nomeRest = pedido.restaurante?.nome || nomeRestaurante || 'Restaurante';
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/auth/donos/entregador/pedido/${pedido.id}/rota`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      const restLat = data.latRestaurante;
      const restLng = data.lngRestaurante;
      const enderecoCliente = data.enderecoCliente;
      
      let mapsUrl: string;
      if (enderecoCliente && enderecoCliente.trim() !== '') {
        const enderecoEncoded = encodeURIComponent(enderecoCliente);
        mapsUrl = `https://www.google.com/maps/dir/${restLat},${restLng}/${enderecoEncoded}`;
      } else {
        mapsUrl = `https://www.google.com/maps/dir/${restLat},${restLng}/-5.7945,-35.211`;
      }
      
      const mensagem =
        `🚚 *LARICA - ENTREGA DISPONÍVEL* 🚚\n\n` +
        `*Pedido:* #${pedido.id}\n` +
        `*Restaurante:* ${nomeRest}\n` +
        `📍 *Endereço do Restaurante:* ${pedido.restaurante?.endereco || enderecoRestaurante}\n` +
        `🏠 *Endereço do Cliente:* ${enderecoCliente || 'Endereço não informado'}\n\n` +
        `🗺️ *ROTA:*\n${mapsUrl}\n\n` +
        `⚠️ *QUEM PEGAR COMENTA NO GRUPO!*`;

      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, '_blank');
      
    } catch (err) {
      console.error('Erro ao postar no grupo:', err);
      alert('Erro ao gerar rota. Tente novamente.');
    }
  };

  const avisarCliente = async (pedido: Pedido) => {
    let telefoneCliente = pedido.telefoneCliente;
    if (!telefoneCliente || telefoneCliente === '') {
      alert('Cliente não cadastrou telefone!');
      return;
    }
    
    let numero = telefoneCliente.replace(/\D/g, '');
    if (!numero.startsWith('55') && (numero.length === 10 || numero.length === 11)) {
      numero = '55' + numero;
    }
    
    if (!/^55\d{10,13}$/.test(numero)) {
      alert('Número de telefone do cliente inválido');
      return;
    }
    
    const nomeRest = pedido.restaurante?.nome || nomeRestaurante || 'Restaurante';
    
    let statusPagamento = '⏳ Aguardando confirmação';
    let corPagamento = '#ffc107';
    
    if (pedido.status === 'PAGO') {
      statusPagamento = '✅ Pagamento confirmado';
      corPagamento = '#28a745';
    } else if (pedido.status === 'AGUARDANDO_PAGAMENTO') {
      statusPagamento = '⏳ Pagamento pendente';
      corPagamento = '#ffc107';
    }
    
    const mensagem = 
      `🍕 *LARICA - SEU PEDIDO FOI CONFIRMADO!* 🍕\n\n` +
      `*Restaurante:* ${nomeRest}\n` +
      `*Pedido:* #${pedido.id}\n` +
      `*Status:* ${pedido.status === 'EM_PREPARO' ? '🟡 Em preparo' : pedido.status === 'PAGO' ? '💰 Pago' : pedido.status}\n\n` +
      `💰 *Pagamento:* ${statusPagamento}\n\n` +
      `*Itens do pedido:*\n` +
      pedido.itens.map(item => `- ${item.quantidade}x ${item.nomeProduto} - R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`).join('\n') +
      `\n\n*Total:* R$ ${pedido.total.toFixed(2)}\n\n` +
      `⏰ *Previsão de entrega:* 30-45 minutos\n\n` +
      `📞 Dúvidas? Entre em contato com o restaurante: ${pedido.restaurante?.telefone || telefoneRestaurante}\n\n` +
      `*Agradecemos a preferência!* ❤️`;
    
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const handleAceitar = async (pedido: Pedido) => {
    try {
      await atualizarStatus(pedido.id, 'EM_PREPARO');
      if (window.confirm('Pedido aceito! Deseja avisar o cliente via WhatsApp?')) {
        await avisarCliente(pedido);
      }
    } catch {
      setErro('Erro ao aceitar o pedido.');
    }
  };

  const handleRecusar = async (pedidoId: number) => {
    try {
      await atualizarStatus(pedidoId, 'CANCELADO');
    } catch {
      setErro('Erro ao recusar pedido.');
    }
  };

  const marcarEntregue = async (pedidoId: number) => {
    try {
      await atualizarStatus(pedidoId, 'ENTREGUE');
    } catch {
      setErro('Erro ao marcar como entregue.');
    }
  };

  const getStatusClass = (status: string) => {
    const s = status?.toUpperCase?.() || '';
    if (s === 'AGUARDANDO') return 'status-aguardando';
    if (s === 'EM_PREPARO' || s === 'PREPARANDO') return 'status-preparo';
    if (s === 'PRONTO') return 'status-pronto';
    if (s === 'ENTREGUE') return 'status-entregue';
    if (s === 'CANCELADO' || s === 'RECUSADO') return 'status-cancelado';
    if (s === 'PAGO') return 'status-pago';
    if (s === 'AGUARDANDO_PAGAMENTO') return 'status-aguardando-pagamento';
    return '';
  };

  const getStatusTexto = (status: string) => {
    const s = status?.toUpperCase?.() || '';
    if (s === 'AGUARDANDO') return '🟡 Aguardando confirmação';
    if (s === 'EM_PREPARO' || s === 'PREPARANDO') return '🟠 Em preparo';
    if (s === 'PRONTO') return '🟢 Pronto para retirada';
    if (s === 'ENTREGUE') return '✅ Entregue';
    if (s === 'CANCELADO' || s === 'RECUSADO') return '❌ Cancelado';
    if (s === 'PAGO') return '💰 Pago';
    if (s === 'AGUARDANDO_PAGAMENTO') return '⏳ Aguardando pagamento';
    return status;
  };

  const syncPagamento = async (pedidoId: number) => {
    try {
      const response = await api.post(`/pagamentos/sync/pedido/${pedidoId}`);
      const data = response.data;
      
      if (data.ok && data.status === 'PAGO') {
        alert('✅ Pagamento confirmado! Pedido atualizado.');
        await carregarPedidos();
        return true;
      } else if (data.status === 'PAGO') {
        alert('✅ Pagamento confirmado!');
        await carregarPedidos();
        return true;
      } else if (data.status === 'pending') {
        alert('⏳ Pagamento pendente. Aguardando confirmação do PIX.');
        return false;
      } else if (data.status === 'in_process') {
        alert('⏳ Pagamento em processamento.');
        return false;
      } else {
        alert(`❌ ${data.message || 'Pagamento não encontrado'}`);
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      alert('❌ Erro ao verificar pagamento. Tente novamente.');
      return false;
    }
  };

  const fazerUploadImagem = async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `larica/restaurantes/${restauranteIdFinal}/produtos`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    const data = await response.json();
    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMsgErro('Por favor, selecione uma imagem válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMsgErro('Imagem muito grande. Máximo 5MB');
        return;
      }
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgOk(null);
    setMsgErro(null);

    if (!nomeProd.trim() || !descProd.trim() || !precoProd.trim()) {
      setMsgErro('Preencha nome, descrição e preço.');
      return;
    }

    const precoNumber = Number(precoProd.replace(',', '.'));
    if (Number.isNaN(precoNumber) || precoNumber < 0) {
      setMsgErro('Informe um preço válido (ex.: 28.90).');
      return;
    }

    setSalvando(true);
    try {
      const produtoResponse = await api.post(`/produtos/por-restaurante/${restauranteIdFinal}`, {
        nome: nomeProd.trim(),
        descricao: descProd.trim(),
        preco: precoNumber,
      });

      const produtoId = produtoResponse.data.id;

      if (imagemFile) {
        const { url, publicId } = await fazerUploadImagem(imagemFile);
        
        await api.patch(`/produtos/${produtoId}/imagem`, {
          imagemUrl: url,
          imagemPublicId: publicId
        });
      }

      setMsgOk('✅ Produto cadastrado com sucesso!');
      setNomeProd('');
      setDescProd('');
      setPrecoProd('');
      setImagemFile(null);
      setImagemPreview(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao cadastrar produto.';
      setMsgErro(`❌ ${msg}`);
    } finally {
      setSalvando(false);
      setTimeout(() => {
        setMsgErro(null);
        setMsgOk(null);
      }, 4000);
    }
  };

  if (mostrarHistorico) {
    return (
      <div className="painel-container">
        <HistoricoRestaurante
          restauranteId={restauranteIdFinal}
          onVoltar={() => setMostrarHistorico(false)}
        />
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="painel-container">
      <button
        onClick={() => (onVoltar ? onVoltar() : navigate(-1))}
        className="btn-voltar"
      >
        &larr; Voltar
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 className="painel-nome-restaurante" style={{ margin: 0 }}>
          {nomeRestaurante || `Restaurante #${restauranteIdFinal}`}
        </h2>
        <button
          className="btn-historico"
          onClick={() => setMostrarHistorico(true)}
          title="Ver histórico por restaurante"
        >
          📜 Ver histórico
        </button>
        <button
          className="btn-secundario"
          onClick={configurarCooperativa}
          title="Definir/alterar WhatsApp da cooperativa"
        >
          ⚙️ Configurar Whats da cooperativa
        </button>
      </div>

      <p className="painel-subtitulo">Usando ID: {restauranteIdFinal}</p>

      {msgOk && <div className="alert sucesso">{msgOk}</div>}
      {msgErro && <div className="alert erro">{msgErro}</div>}
      {erro && <div className="alert erro">{erro}</div>}

      <div className="novo-produto-card">
        <h2>Novo produto</h2>
        <form onSubmit={criarProduto} className="novo-produto-form">
          <div>
            <label>Nome</label>
            <input value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} required />
          </div>
          <div className="grid-2">
            <div>
              <label>Descrição</label>
              <input value={descProd} onChange={(e) => setDescProd(e.target.value)} required />
            </div>
            <div>
              <label>Preço (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={precoProd}
                onChange={(e) => setPrecoProd(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label>Imagem do produto (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              style={{ display: 'block', marginTop: '8px', marginBottom: '8px' }}
            />
            {imagemPreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={imagemPreview} 
                  alt="Preview" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagemFile(null);
                    setImagemPreview(null);
                  }}
                  style={{ marginLeft: '10px', padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remover
                </button>
              </div>
            )}
            <small style={{ color: '#666' }}>Formatos: JPG, PNG, GIF. Máximo 5MB</small>
          </div>

          <div className="acoes">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => {
                setNomeProd('');
                setDescProd('');
                setPrecoProd('');
                setImagemFile(null);
                setImagemPreview(null);
                setMsgErro(null);
                setMsgOk(null);
              }}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>

      <div className="pedidos-lista">
        {pedidos.length === 0 ? (
          <div className="sem-pedidos">
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const statusUp = (pedido.status || '').toUpperCase();
            const podeChamarEntregador = statusUp === 'EM_PREPARO' || statusUp === 'PRONTO';
            const podeAvisarCliente = statusUp === 'EM_PREPARO' || statusUp === 'AGUARDANDO';

            return (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <h3>Pedido #{pedido.id}</h3>
                  <span className={`status-badge ${getStatusClass(pedido.status)}`}>
                    {getStatusTexto(pedido.status)}
                  </span>
                </div>

                <div className="pedido-info">
                  <p><strong>Data:</strong> {new Date(pedido.data).toLocaleString()}</p>
                  <p><strong>Cliente:</strong> {pedido.nomeCliente}</p>
                  <p><strong>Telefone:</strong> {pedido.telefoneCliente || 'Não informado'}</p>
                  <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
                </div>

                <div className="itens-container">
                  <h4>Itens:</h4>
                  <ul className="itens-lista">
                    {pedido.itens.map((item) => (
                      <li key={item.id}>
                        <span className="item-quantidade">{item.quantidade}x</span>
                        <span className="item-nome">{item.nomeProduto}</span>
                        <span className="item-preco">
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="acoes-pedido" style={{ gap: 8, flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(statusUp === 'AGUARDANDO') && (
                      <>
                        <button
                          onClick={() => syncPagamento(pedido.id)}
                          className="btn-verificar"
                          style={{ background: '#ffc107', color: '#000', border: 'none', padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}
                        >
                          🔍 Verificar Pagamento
                        </button>
                        <button
                          onClick={() => handleAceitar(pedido)}
                          className="btn-aceitar"
                        >
                          Aceitar Pedido
                        </button>
                        <button
                          onClick={() => handleRecusar(pedido.id)}
                          className="btn-recusar"
                        >
                          Recusar Pedido
                        </button>
                      </>
                    )}

                    {podeAvisarCliente && pedido.telefoneCliente && (
                      <button
                        onClick={() => avisarCliente(pedido)}
                        className="btn-aviso"
                        style={{ background: '#25D366', color: 'white' }}
                      >
                        📱 Avisar Cliente
                      </button>
                    )}

                    {(statusUp === 'EM_PREPARO' || statusUp === 'PRONTO') && (
                      <button
                        onClick={() => marcarEntregue(pedido.id)}
                        className="btn-entregue"
                      >
                        Marcar como Entregue
                      </button>
                    )}
                  </div>

                  {podeChamarEntregador && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <button
                        onClick={() => chamarMeuEntregador(pedido)}
                        className="btn-primario"
                      >
                        📞 Chamar Meu Entregador
                      </button>
                      <button
                        onClick={() => postarNoGrupoWhatsApp(pedido)}
                        className="btn-secundario"
                      >
                        📢 Chamar Grupo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PainelRestaurante;