export const AREAS = [
  {
    id: 'mental', label: 'Mental', icon: '🧠', color: '#e8f0fb',
    qs: [
      'Com que frequência você para para observar seus pensamentos e emoções?',
      'Você tem clareza sobre seus objetivos e para onde sua vida está indo?',
      'Seu nível de estresse e ansiedade está sob controle no dia a dia?'
    ],
    habitos: {
      fase1: [
        { id: 'm1', texto: 'Escrevi 3 pensamentos que me limitaram hoje' },
        { id: 'm2', texto: 'Fiz 10 min de leitura intencional sem redes sociais' },
        { id: 'm3', texto: 'Identifiquei um padrão de pensamento negativo' },
      ],
      fase2: [
        { id: 'm4', texto: 'Transformei 1 pensamento negativo em perspectiva neutra' },
        { id: 'm5', texto: 'Fiz journaling por 5 minutos sem parar de escrever' },
        { id: 'm6', texto: 'Identifiquei o que me roubou energia mental hoje' },
      ],
      fase3: [
        { id: 'm7', texto: 'Tomei uma decisão difícil sem procrastinar' },
        { id: 'm8', texto: 'Pratiquei gratidão ativa com 3 coisas específicas do dia' },
        { id: 'm9', texto: 'Protegi pelo menos 1 hora de foco profundo' },
      ]
    }
  },
  {
    id: 'espiritual', label: 'Espiritual', icon: '🕊️', color: '#f0ebe0',
    qs: [
      'Sua vida tem propósito e significado além do cotidiano?',
      'Com que frequência você pratica silêncio, meditação ou espiritualidade?',
      'Você age de acordo com seus valores mais profundos?'
    ],
    habitos: {
      fase1: [
        { id: 'e1', texto: '5 minutos de silêncio intencional — sem tela, sem barulho' },
        { id: 'e2', texto: 'Escrevi uma coisa que deu sentido ao meu dia' },
        { id: 'e3', texto: 'Identifiquei um valor meu que guiou uma decisão hoje' },
      ],
      fase2: [
        { id: 'e4', texto: '10 minutos de meditação ou oração consciente' },
        { id: 'e5', texto: 'Refleti se minhas ações estavam alinhadas com meus valores' },
        { id: 'e6', texto: 'Escrevi sobre uma crença limitante que quero transformar' },
      ],
      fase3: [
        { id: 'e7', texto: 'Tomei uma decisão difícil guiada pelos meus valores, não pelo medo' },
        { id: 'e8', texto: 'Pratiquei 15 min de contemplação ou leitura espiritual' },
        { id: 'e9', texto: 'Escrevi minha declaração de propósito para a próxima semana' },
      ]
    }
  },
  {
    id: 'fisico', label: 'Físico', icon: '⚡', color: '#edf5e8',
    qs: [
      'Como está sua energia física no dia a dia?',
      'Você cuida da sua alimentação e do sono de forma consistente?',
      'Você tem uma rotina de movimento ou exercício físico?'
    ],
    habitos: {
      fase1: [
        { id: 'f1', texto: 'Me movi intencionalmente por pelo menos 20 minutos' },
        { id: 'f2', texto: 'Dormi 7 horas ou mais' },
        { id: 'f3', texto: 'Bebi pelo menos 2 litros de água' },
      ],
      fase2: [
        { id: 'f4', texto: 'Completei 30 min de exercício sem negociar com a preguiça' },
        { id: 'f5', texto: 'Fiz uma refeição principal sem tela ou distração' },
        { id: 'f6', texto: 'Evitei ultraprocessados em todas as refeições' },
      ],
      fase3: [
        { id: 'f7', texto: 'Completei 45 min de atividade física mesmo sob pressão' },
        { id: 'f8', texto: 'Mantive minha rotina de sono mesmo com agenda difícil' },
        { id: 'f9', texto: 'Fiz uma escolha alimentar difícil — e escolhi o que me cuida' },
      ]
    }
  },
  {
    id: 'financeiro', label: 'Financeiro', icon: '🌿', color: '#f0f5e8',
    qs: [
      'Você tem controle e clareza sobre suas finanças pessoais?',
      'Seu trabalho ou renda te gera segurança e satisfação?',
      'Você está construindo algo financeiro para o futuro?'
    ],
    habitos: {
      fase1: [
        { id: 'fi1', texto: 'Registrei todos os gastos do dia' },
        { id: 'fi2', texto: 'Identifiquei um gasto desnecessário que posso eliminar' },
        { id: 'fi3', texto: 'Reservei qualquer valor — o hábito importa mais que o valor' },
      ],
      fase2: [
        { id: 'fi4', texto: 'Revisei meu saldo e situação financeira do mês' },
        { id: 'fi5', texto: 'Tomei uma decisão de compra consciente antes de executar' },
        { id: 'fi6', texto: 'Aprendi algo novo sobre finanças pessoais' },
      ],
      fase3: [
        { id: 'fi7', texto: 'Avaliei meu progresso financeiro do mês e ajustei o plano' },
        { id: 'fi8', texto: 'Dei um passo concreto em direção a uma meta financeira' },
        { id: 'fi9', texto: 'Recusei um gasto impulsivo e direcionei para meu objetivo' },
      ]
    }
  },
  {
    id: 'familiar', label: 'Familiar', icon: '🤝', color: '#faf0e8',
    qs: [
      'A qualidade das suas relações com família está como você deseja?',
      'Você está presente de verdade para as pessoas que ama?',
      'Existe harmonia e comunicação aberta nas suas relações familiares?'
    ],
    habitos: {
      fase1: [
        { id: 'fa1', texto: 'Tive um momento de presença real com a família — sem tela' },
        { id: 'fa2', texto: 'Disse algo de apreciação genuína para um familiar' },
        { id: 'fa3', texto: 'Escutei ativamente sem interromper em uma conversa' },
      ],
      fase2: [
        { id: 'fa4', texto: 'Fiz algo concreto para demonstrar cuidado com um familiar' },
        { id: 'fa5', texto: 'Tive uma conversa difícil que precisava acontecer' },
        { id: 'fa6', texto: 'Compartilhei como estou me sentindo de verdade' },
      ],
      fase3: [
        { id: 'fa7', texto: 'Criei um momento especial com a família' },
        { id: 'fa8', texto: 'Pedi desculpas ou reparei algo pendente em uma relação familiar' },
        { id: 'fa9', texto: 'Defini e respeitei um limite saudável dentro da família' },
      ]
    }
  },
  {
    id: 'relacional', label: 'Relacional', icon: '💬', color: '#f0e8f5',
    qs: [
      'Você tem amizades e relações que te nutrem e te desafiam a crescer?',
      'Você se sente à vontade para ser autêntico nas suas relações?',
      'Suas relações sociais te dão energia ou te drenam?'
    ],
    habitos: {
      fase1: [
        { id: 'r1', texto: 'Tive uma conversa genuína com alguém — sem tela, sem pressa' },
        { id: 'r2', texto: 'Entrei em contato com alguém que importa e está distante' },
        { id: 'r3', texto: 'Pratiquei escuta ativa: ouvi para entender, não para responder' },
      ],
      fase2: [
        { id: 'r4', texto: 'Fui autêntico em uma situação onde seria mais fácil me esconder' },
        { id: 'r5', texto: 'Ofereci ajuda genuína a alguém sem esperar nada em troca' },
        { id: 'r6', texto: 'Estabeleci ou reforçei um limite em uma relação que me drena' },
      ],
      fase3: [
        { id: 'r7', texto: 'Investi em uma amizade que me desafia a crescer' },
        { id: 'r8', texto: 'Expressei vulnerabilidade real com alguém de confiança' },
        { id: 'r9', texto: 'Reduzi contato com uma relação que consistentemente me drena' },
      ]
    }
  }
]

export const getFase = (diaAtual) => {
  if (diaAtual <= 20) return 'fase1'
  if (diaAtual <= 40) return 'fase2'
  return 'fase3'
}

export const getFaseLabel = (diaAtual) => {
  if (diaAtual <= 20) return 'Fundação · Dias 1–20'
  if (diaAtual <= 40) return 'Aprofundamento · Dias 21–40'
  return 'Consolidação · Dias 41–60'
}

export const getAreaById = (id) => AREAS.find(a => a.id === id)

export const FRASES = [
  'A identidade não se declara — ela se constrói, um dia de cada vez.',
  'Aparecer é o ato mais revolucionário que existe.',
  'Você não precisa sentir vontade. Você precisa aparecer.',
  'O hábito não se forma na motivação — se forma na repetição.',
  'Cada dia concluído é uma prova de quem você está se tornando.',
  'Pequenas ações consistentes vencem grandes esforços esporádicos.',
]
