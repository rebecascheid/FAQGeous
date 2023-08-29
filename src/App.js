import { useEffect, useState } from 'react';
import './App.css';
import TOPICOS from './topicos.json';
import RESPOSTAS from './respostas.json';



function Cabecalho() {
return (
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="logoGeous.jpg" alt="Logo Geous" height="100"/>
</div>
    
  );
}

function CaixaPesquisa({textoPesquisa, onTextoPesquisaChange}) {
  return(
    <div>
      <p style={{ display: 'flex', justifyContent: 'center', fontStyle: 'italic' }}>
        Como podemos ajudar?
      </p>
      <form style={{ display: 'flex', justifyContent: 'center' }}>
        <input 
          type="text"
          value = {textoPesquisa}
          placeholder="Descreva sua dúvida..."
          onChange={(e) => onTextoPesquisaChange(e.target.value)}
          />
      </form>
    </div>
  )
}

function TextoEmListaPerguntas({perguntas, textoPesquisa}) {
  let seAchou = false;
  let contador = 0;

  while (!seAchou && (contador < perguntas.length)) {
    if (perguntas[contador].resposta.toLowerCase().indexOf(
        textoPesquisa.toLowerCase()
        ) > -1) {
          seAchou = true;
        }
    else { contador++ }
  }

  return (seAchou)
}

function ObterTextoHtmlResposta(pergunta, respPadrao) {
  const [textoHtml, setTextoHtml] = useState('');

  useEffect(() => {
    const readFile = async () => {
      const nomeHtmlResp = `resp${String(pergunta.perguntaId).padStart(4,'0')}.htm`;
      const locPerguntaId = `PerguntaId${String(pergunta.perguntaId)}`;
      try {
        const response = await fetch(nomeHtmlResp);
        const text = await response.text();
        if (text.indexOf(locPerguntaId) > -1) {
          setTextoHtml(text);
        }
        else {
          setTextoHtml(respPadrao)
        };
      } catch (erro) {
        console.log(`Não foi possível carregar ${nomeHtmlResp}`);
      }
    };
    readFile();
  }, [pergunta.perguntaId, respPadrao]);

  return (textoHtml);
}

function AtribuirRespostas(topicos, respostas) {
  const topicosRespondidos = [];
  
  topicos.forEach(t => {
    t.perguntas.forEach(p => {
      const respPadrao = respostas.find(r => r.perguntaId === p.perguntaId).resposta;
      p.resposta = ObterTextoHtmlResposta(p, respPadrao);
    });
    topicosRespondidos.push(t);
  });

  return (topicosRespondidos);
};


function App() {
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const topicosRespondidos = AtribuirRespostas(TOPICOS,RESPOSTAS);
  return(
    <>
      <Cabecalho></Cabecalho>
      <CaixaPesquisa textoPesquisa={textoPesquisa}
                     onTextoPesquisaChange={setTextoPesquisa}></CaixaPesquisa>
      <BlocosTabela topicos={topicosRespondidos}
                    textoPesquisa={textoPesquisa}></BlocosTabela>
      <Rodape></Rodape>
    </>
  )
}

function PerguntaLinha ({pergunta}) {
  const nomeHtmlResp = `./resp${String(pergunta.perguntaId).padStart(4,'0')}.htm`;
  return(  
    <li>
      <a href={nomeHtmlResp}>{pergunta.pergunta}</a>
    </li>
  )
}

function PerguntasLista({perguntas, textoPesquisa}){
  const listaPerguntas = [];

  perguntas.forEach(pergunta => {
    if ((pergunta.resposta.toLowerCase().indexOf(textoPesquisa.toLowerCase()) > -1)
    ) {
      listaPerguntas.push(<PerguntaLinha
        pergunta={pergunta}
        key={pergunta.perguntaId}/>);
      }
  });
  return(
    <ul>{listaPerguntas}</ul>
  )
}

function TopicoTitulo({topico}){
  return(
    <p>{topico}</p>
  )
}

function TopicoBloco({topico, textoPesquisa}){
  return(
    <div>
      <TopicoTitulo topico={topico.topico}/>
      <PerguntasLista 
        perguntas={topico.perguntas}
        textoPesquisa={textoPesquisa}/>
    </div>
  )
}


function BlocosTabela({topicos, textoPesquisa}){
  const listaTopicoBloco=[];
  topicos.forEach((topico) => {
    const perguntas = topico.perguntas;
    if (TextoEmListaPerguntas({perguntas, textoPesquisa})) {
      listaTopicoBloco.push(<TopicoBloco 
        topico={topico} 
        key={topico.topicoId}
        textoPesquisa={textoPesquisa}/>)
    }
    
  });
  return(
    <div className='grid-blocos'>
      {listaTopicoBloco}
    </div>
    
  )
}

function Rodape(){
  return(
  <div>
    <p style={{ display: 'flex', justifyContent: 'center' }}>
      Não encontrou resposta para sua dúvida?</p>
    <a style={{ display: 'flex', justifyContent: 'center' }}
    href="https://wa.me/3511951562216">Fale Conosco</a>
  </div>

  )
}

/*
const TOPICOS = [
  {topidoId: 1,
   topico: "Emissão de NF-e",
   perguntas: [
     {perguntaId: 1, pergunta: "Rejeições SEFAZ", resposta: "Rejeições teste"},
     {perguntaId: 2, pergunta: "Emitir Carta de correção", resposta: "Carta de correção"},
     {perguntaId: 3, pergunta: "Cancelar NF-e", resposta: "Cancelar"},
     {perguntaId: 4, pergunta: "Uso Denegado", resposta: "Denegado"},
     {perguntaId: 5, pergunta: "Consumo indevido", resposta: "Consumo"},
     {perguntaId: 6, pergunta: "Erros/avisos ao solicitar NF-e", resposta: "solicitar"},
     {perguntaId: 7, pergunta: "Emitir NF-e complementar", resposta: "complementar"}
   ]
  },
  {topidoId: 2,
    topico: "Devolução NFe",
    perguntas: [
      {perguntaId: 8, pergunta: "Devolução de compra", resposta: "Devolução compra"},
      {perguntaId: 9, pergunta: "Devolução de venda", resposta: "Devolução venda"},
      {perguntaId: 10, pergunta: "Devolução com geração de crédito", resposta: "Devolução crédito"},
      {perguntaId: 11, pergunta: "Entrada de devolução", resposta: "Entrada devolução"},
      {perguntaId: 12, pergunta: "Cancelamento de devolução", resposta: "Cancelamento devolução"}
    ]
  },
  {topidoId: 3,
    topico: "Entrada de NF-e (compras)",
    perguntas: [
      {perguntaId: 13, pergunta: "Entrada via xml", resposta: "Entrada xml"},
      {perguntaId: 14, pergunta: "Entrada via pedido de compras", resposta: "Entrada pedido"},
      {perguntaId: 15, pergunta: "Críticas recebimento fiscal", resposta: "recebimento teste fiscal"},
      {perguntaId: 16, pergunta: "Divergência impostos", resposta: "Divergência impostos"},
      {perguntaId: 17, pergunta: "Análise de custos", resposta: "Análise custos"}
    ]
  },
  {topidoId: 4,
    topico: "Pedidos vendas/compras",
    perguntas: [
      {perguntaId: 18, pergunta: "Auditoria de pedidos", resposta: "Auditoria pedidos"},
      {perguntaId: 19, pergunta: "Saldo de reserva", resposta: "Saldo reserva"}
    ]
  },
  {topidoId: 5,
    topico: "Cadastros",
    perguntas: [
      {perguntaId: 20, pergunta: "NCM/Classificação Fiscal", resposta: "NCM/Classificação Fiscal"},
      {perguntaId: 21, pergunta: "CFOP", resposta: "CFOP"},
      {perguntaId: 22, pergunta: "Condição de Pagamento", resposta: "Condição teste Pagamento"},
      {perguntaId: 23, pergunta: "Tipo de Documento", resposta: "Tipo Documento"},
      {perguntaId: 24, pergunta: "Transportadora", resposta: "Transportadora"},
      {perguntaId: 25, pergunta: "Vendedor/Comprador", resposta: "Vendedor teste Comprador"}
    ]
  },
  {topidoId: 6,
    topico: "Inventário",
    perguntas: [
      {perguntaId: 26, pergunta: "Boas práticas", resposta: "Boas práticas"},
      {perguntaId: 27, pergunta: "Relatórios contagem de estoque", resposta: "Relatórios contagem de estoque"},
      {perguntaId: 28, pergunta: "Lançamento de Inventário", resposta: "Lançamento de Inventário"},
      {perguntaId: 29, pergunta: "Estorno de Inventário", resposta: ""}
    ]
  }
];
*/


export default App;
