// src/pages/RegulamentoPromocional.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegulamentoPromocional.css';
import laricaLogo from '../assets/larica-logo.png';
import nemodevLogo from '../assets/logonemindev.png';

const RegulamentoPromocional: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="regulamento-container" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    }}>
      {/* HEADER */}
      <div style={{
        textAlign: 'center',
        padding: '40px 0',
        borderBottom: '3px solid #FF6B35',
        marginBottom: '40px'
      }}>
        <img 
          src={laricaLogo} 
          alt="LARICA Food Delivery" 
          style={{ height: '80px', marginBottom: '20px' }}
        />
        <h1 style={{ color: '#FF6B35', marginBottom: '10px' }}>
          📋 REGULAMENTO OFICIAL
        </h1>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          PROMOÇÃO "R$ 1.000,00 NO LANÇAMENTO"
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          display: 'inline-block',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '0 5px 15px rgba(255, 107, 53, 0.3)'
        }}>
          🎉 <strong>SORTEIO: 01 DE MARÇO DE 2024</strong> 🎉
        </div>
      </div>

      {/* INFO EM DESTAQUE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '10px',
          borderLeft: '5px solid #FF6B35'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>🗓️ DATA DO SORTEIO</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FF6B35',
            margin: '10px 0'
          }}>01 DE MARÇO DE 2024</p>
          <p style={{ color: '#666' }}>
            Transmissão ao vivo em nossas redes sociais
          </p>
        </div>
        
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '10px',
          borderLeft: '5px solid #4CAF50'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>🏆 PRÊMIOS</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#4CAF50',
            margin: '10px 0'
          }}>R$ 2.000,00 TOTAL</p>
          <p style={{ color: '#666' }}>• R$ 1.000,00 para 1 restaurante</p>
          <p style={{ color: '#666' }}>• R$ 1.000,00 para 1 cliente</p>
        </div>
      </div>

      {/* RESTAURANTES */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>🍽️ PARA RESTAURANTES PARCEIROS</h2>
          <span style={{
            background: 'white',
            color: '#FF6B35',
            padding: '8px 15px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            CONCORRA A R$ 1.000,00
          </span>
        </div>
        
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>Como participar:</h3>
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '15px',
              padding: '15px',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#FF6B35',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Cadastre seu restaurante
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Acesse <a href="https://larica.neemindev.com" style={{ color: '#FF6B35' }}>
                    larica.neemindev.com
                  </a> e complete seu cadastro
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '15px',
              padding: '15px',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#FF6B35',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Efetue pelo menos 1 venda
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Realize 1 pedido confirmado através do aplicativo Larica Food
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '15px',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#FF6B35',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Concorra automaticamente
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Pronto! Você já está concorrendo aos R$ 1.000,00
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#fff3e0',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #FF9800'
          }}>
            <h4 style={{ color: '#E65100', marginTop: 0 }}>⚠️ Requisitos importantes:</h4>
            <ul style={{ color: '#666', marginBottom: 0 }}>
              <li>Cadastro completo e verificado</li>
              <li>Pelo menos 1 pedido confirmado e finalizado</li>
              <li>Restaurante ativo durante todo o período promocional</li>
              <li>Restaurantes devem manter cadastro por pelo menos 90 dias</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>👤 PARA USUÁRIOS/CLIENTES</h2>
          <span style={{
            background: 'white',
            color: '#2196F3',
            padding: '8px 15px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            CONCORRA A R$ 1.000,00
          </span>
        </div>
        
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>Como participar:</h3>
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '15px',
              padding: '15px',
              background: '#f0f8ff',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#2196F3',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Faça seu cadastro como cliente
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Baixe o app Larica Food e complete seu cadastro
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '15px',
              padding: '15px',
              background: '#f0f8ff',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#2196F3',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Indique 3 amigos pelo WhatsApp
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Use a função "Indicar Amigos" no app para enviar pelo WhatsApp oficial do Larica
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '15px',
              background: '#f0f8ff',
              borderRadius: '8px'
            }}>
              <div style={{
                background: '#2196F3',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  Amigos devem se cadastrar
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Seus 3 amigos precisam efetuar o cadastro completo no app
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#e8f5e9',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #4CAF50'
          }}>
            <h4 style={{ color: '#2E7D32', marginTop: 0 }}>📱 Como indicar pelo WhatsApp:</h4>
            <ol style={{ color: '#666', marginBottom: 0 }}>
              <li>Acesse seu perfil no app Larica Food</li>
              <li>Clique em "Indicar Amigos"</li>
              <li>Selecione 3 contatos do seu WhatsApp</li>
              <li>O link de indicação será enviado automaticamente</li>
            </ol>
          </div>
        </div>
      </section>

      {/* REGRAS GERAIS */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{
          color: '#333',
          paddingBottom: '10px',
          borderBottom: '2px solid #ddd',
          marginBottom: '25px'
        }}>📋 REGRAS GERAIS</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#FF6B35', marginTop: 0 }}>🗓️ Período</h4>
            <p style={{ margin: 0, color: '#666' }}>
              • Início: Data de lançamento<br/>
              • Término: 30 dias após lançamento<br/>
              • Sorteio: 01/03/2024
            </p>
          </div>
          
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#FF6B35', marginTop: 0 }}>🏆 Premiação</h4>
            <p style={{ margin: 0, color: '#666' }}>
              • 2 ganhadores total<br/>
              • R$ 1.000,00 cada<br/>
              • Pagamento via PIX
            </p>
          </div>
          
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#FF6B35', marginTop: 0 }}>⚖️ Critérios</h4>
            <p style={{ margin: 0, color: '#666' }}>
              • Validade apenas para cadastros promocionais<br/>
              • Todas as indicações auditadas<br/>
              • Data/hora como critério de desempate
            </p>
          </div>
        </div>
      </section>

      {/* RESTRIÇÕES */}
      <section style={{
        background: '#fff8e1',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '40px',
        border: '2px solid #ffd54f'
      }}>
        <h3 style={{ color: '#E65100', marginTop: 0 }}>🚫 RESTRIÇÕES</h3>
        <ul style={{ color: '#666' }}>
          <li>Não podem participar funcionários da NEMO SYSTEMS LTDA ou familiares</li>
          <li>Cadastros duplicados serão desclassificados</li>
          <li>Indicações fraudulentas serão invalidadas</li>
          <li>Restaurantes devem manter cadastro ativo por 90 dias</li>
          <li>Prazo para resgate: 30 dias após resultado</li>
        </ul>
      </section>

      {/* CONTATO */}
      <section style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '15px',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginTop: 0 }}>📞 DÚVIDAS E SUPORTE</h2>
        <div style={{ fontSize: '1.2rem' }}>
          <p>WhatsApp: <strong>(91) 998744-6061</strong></p>
          <p>Email: <strong>contato@larica.com</strong></p>
        </div>
        <button 
          onClick={() => window.location.href = 'https://larica.neemindev.com/'}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          🚀 PARTICIPAR DA PROMOÇÃO
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: '#1a1a1a',
        color: '#aaa',
        borderRadius: '10px',
        marginTop: '50px'
      }}>
        <img 
          src={laricaLogo} 
          alt="LARICA Food Delivery" 
          style={{ height: '50px', marginBottom: '20px', opacity: '0.8' }}
        />
        
        {/* LOGO DA NEMO SYSTEMS */}
        <div style={{ 
          margin: '30px 0', 
          padding: '20px 0',
          borderTop: '1px solid #333',
          borderBottom: '1px solid #333'
        }}>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#888', 
            marginBottom: '10px' 
          }}>
            Desenvolvido por:
          </p>
          <img 
            src={nemodevLogo} 
            alt="Nemo Systems - Desenvolvimento de Software" 
            style={{ 
              height: '35px', 
              filter: 'brightness(2)',
              opacity: '0.7',
              marginBottom: '5px'
            }}
          />
          <p style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            marginTop: '0'
          }}>
            NEMO SYSTEMS LTDA
          </p>
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          © 2024 LARICA Food Delivery - Todos os direitos reservados
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>
          📍 Natal - RN, Brasil
        </p>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← VOLTAR PARA A PÁGINA INICIAL
        </button>
        
        <div style={{ 
          marginTop: '30px', 
          fontSize: '0.8rem', 
          color: '#666' 
        }}>
          <p>
            *Promoção válida durante o período de lançamento. 
            A Larica Food se reserva o direito de alterar o regulamento sem aviso prévio.
          </p>
          <p>
            Ao participar da promoção, o usuário aceita integralmente todas as condições deste regulamento.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegulamentoPromocional;