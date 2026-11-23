// Material de estudo por tópico: resumo autoral, pontos de atenção e fontes oficiais.
// Os resumos não substituem a leitura da lei seca e das fontes indicadas.

const CF = 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
const LAI = 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm';
const L9784 = 'https://www.planalto.gov.br/ccivil_03/leis/l9784.htm';
const L4717 = 'https://www.planalto.gov.br/ccivil_03/leis/l4717.htm';
const CTN = 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm';
const MP2200 = 'https://www.planalto.gov.br/ccivil_03/mpv/antigas_2001/2200-2.htm';
const L14063 = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14063.htm';
const LC63 = 'http://www3.alerj.rj.gov.br/lotus_notes/default.asp?id=6&url=L2NvbnRsZWkubnNmL2E5OWUzMTdhOWNmZWMzODMwMzI1Njg2MjAwNzFmNWQyLzRiMjk3MmJkYzU2M2U3NjYwMzI1NjY1MjAwNmI4NDliP09wZW5Eb2N1bWVudA%3D%3D';
const TCERJ = 'https://www.tcerj.tc.br/';
const TCU = 'https://portal.tcu.gov.br/';
const STF = 'https://portal.stf.jus.br/';
const CERT = 'https://cartilha.cert.br/';
const ISO_GRATIS = 'https://standards.iso.org/ittf/PubliclyAvailableStandards/';
const ISO27001 = 'https://www.iso.org/standard/27001';
const ISO27002 = 'https://www.iso.org/standard/75652.html';
const ISO27005 = 'https://www.iso.org/standard/80585.html';
const ISO31000 = 'https://www.iso.org/standard/65694.html';
const ITI = 'https://www.gov.br/iti/pt-br';
const VOLP = 'https://www.academia.org.br/nossa-lingua/busca-no-vocabulario';
const nist = (p) => `https://csrc.nist.gov/pubs/${p}/final`;
const rfc = (n) => `https://www.rfc-editor.org/rfc/rfc${n}`;

/**
 * @typedef {{resumo:string[], atencao:string[], fontes:[string, string|null][]}} Material
 * @type {Record<string, Material>}
 */
export const MATERIAL = {
  // ───────────── Português ─────────────
  'port.interpretacao': {
    resumo: [
      'Compreender é localizar o que o texto diz. Interpretar é concluir o que o texto permite deduzir (inferência).',
      'Leia o comando: "segundo o texto" pede compreensão; "infere-se" ou "depreende-se" pede uma conclusão autorizada pelo texto.',
      'Os erros mais cobrados nas alternativas: extrapolação (vai além do texto), redução (pega só parte da ideia) e contradição (afirma o oposto).',
      'Identifique a tese (ideia central) e os argumentos. Os conectivos mostram a relação entre as ideias: concessão, causa, conclusão, oposição.',
      'Na paráfrase correta, o sentido se mantém. Trocar o conectivo pode mudar a relação lógica e tornar a reescrita errada.',
    ],
    atencao: [
      'Desconfie de palavras absolutas (sempre, nunca, apenas, todos, exclusivamente): costumam indicar extrapolação.',
      'No Cebraspe, um item parcialmente certo é errado.',
      'Volte ao texto para cada alternativa. Não responda pela sua opinião sobre o tema.',
    ],
    fontes: [['Gramática de referência (Bechara ou Cegalla): capítulos de semântica e conectivos', null], ['Provas anteriores de FGV e Cebraspe (questões de interpretação)', null]],
  },
  'port.coesao': {
    resumo: [
      'Tipos textuais: narração (fatos no tempo, personagens), descrição (características), dissertação expositiva (informa), dissertação argumentativa (defende uma tese) e injunção (instruções).',
      'Gênero é diferente de tipo: gênero é a forma social do texto (relatório, ofício, notícia), e um mesmo gênero pode misturar tipos.',
      'Coesão referencial: anáfora retoma algo já dito; catáfora antecipa algo que virá. Usa pronomes, sinônimos, hiperônimos (termo geral) e elipse.',
      'Coesão sequencial (conectivos): adição (e, além disso), oposição (mas, porém, contudo, todavia), concessão (embora, ainda que), causa (porque, visto que), conclusão (logo, portanto), condição (se, caso), finalidade (para que, a fim de).',
      'Coerência é a lógica do sentido. Um texto pode ter conectivos e mesmo assim ser incoerente.',
    ],
    atencao: [
      'No uso textual, "este" anuncia o que vem a seguir e "esse" retoma o que já foi dito.',
      '"Pois" antes do verbo é explicativo/causal; deslocado para depois do verbo, entre vírgulas, é conclusivo ("Estudou; passará, pois, no concurso").',
      'Mas/porém (adversativas) e embora (concessiva) exprimem oposição, mas "embora" exige subjuntivo: "embora estude".',
    ],
    fontes: [['Gramática de referência: conjunções coordenativas e subordinativas', null]],
  },
  'port.concordancia': {
    resumo: [
      'O verbo concorda com o sujeito em número e pessoa, mesmo quando o sujeito vem depois ("Chegaram os relatórios").',
      'Verbos impessoais ficam no singular: haver (existir ou tempo decorrido) e fazer (tempo ou clima). O auxiliar acompanha: "Deve haver problemas", "Vai fazer dois anos".',
      'Voz passiva sintética (verbo transitivo direto + se): o verbo concorda com o sujeito ("Vendem-se casas", "Analisaram-se os contratos").',
      'Índice de indeterminação do sujeito (verbo transitivo indireto ou intransitivo + se): verbo no singular ("Precisa-se de técnicos", "Trata-se de questões").',
      'Concordância nominal: anexo, incluso, mesmo, próprio, obrigado e quite concordam com o nome ("seguem anexas as planilhas", "elas mesmas"). "Bastante" varia quando significa "muitos" ("bastantes servidores"). "Meio" como advérbio (um pouco) não varia ("meio cansada").',
    ],
    atencao: [
      '"É proibido entrada" (sem artigo, invariável) × "É proibida a entrada" (com artigo, concorda).',
      '"Mais de um" pede o verbo no singular; "a maioria dos servidores votou/votaram" admite as duas formas.',
      'Existir não é impessoal: "Existem problemas" (plural) × "Há problemas" (singular).',
    ],
    fontes: [['Gramática de referência: concordância verbal e nominal', null], ['VOLP da Academia Brasileira de Letras (grafia oficial)', VOLP]],
  },
  'port.regencia-crase': {
    resumo: [
      'Crase é a fusão da preposição "a" com o artigo feminino "a(s)" ou com os pronomes aquele, aquela e aquilo ("Refiro-me àquele parecer").',
      'Teste prático: troque a palavra feminina por uma masculina. Se aparecer "ao", há crase ("Fui à reunião" → "Fui ao encontro").',
      'Crase proibida: antes de palavra masculina, de verbo, de pronomes pessoais e de tratamento (Vossa Excelência), de "a" no singular antes de plural ("a pessoas") e entre palavras repetidas ("cara a cara").',
      'Crase obrigatória: locuções femininas (às vezes, à noite, à medida que, à custa de) e indicação de horas ("às 10h").',
      'Crase facultativa: antes de pronome possessivo feminino no singular ("à/a minha sala"), de nome próprio feminino e depois de "até".',
      'Regências mais cobradas: assistir (ver) a; visar (almejar) a; aspirar (almejar) a; obedecer a; preferir uma coisa a outra; implicar (acarretar) sem preposição; chegar a e ir a (não "em").',
    ],
    atencao: [
      '"Casa" (lar) e "terra" (chão firme) só têm crase quando especificadas: "voltou a casa" × "voltou à casa dos pais".',
      'Pronome de tratamento: não há crase antes de Vossa Senhoria, mas pode haver antes de "senhora" e "dona".',
      '"Preferir mais" e "preferir do que" são inadequados na norma-padrão.',
    ],
    fontes: [['Gramática de referência: crase e regência verbal', null]],
  },

  // ───────────── Constitucional ─────────────
  'const.principios': {
    resumo: [
      'Fundamentos (art. 1º, mnemônico SO-CI-DI-VA-PLU): soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa e pluralismo político. Todo o poder emana do povo (parágrafo único).',
      'Poderes (art. 2º): Legislativo, Executivo e Judiciário, independentes e harmônicos entre si.',
      'Objetivos fundamentais (art. 3º, começam por verbo): construir uma sociedade livre, justa e solidária; garantir o desenvolvimento nacional; erradicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais; promover o bem de todos, sem preconceitos.',
      'Relações internacionais (art. 4º): independência nacional, prevalência dos direitos humanos, autodeterminação dos povos, não intervenção, igualdade entre os Estados, defesa da paz, solução pacífica dos conflitos, repúdio ao terrorismo e ao racismo, cooperação entre os povos e concessão de asilo político. O parágrafo único trata da integração da América Latina.',
      'A forma federativa de Estado é cláusula pétrea (art. 60, § 4º, I).',
    ],
    atencao: [
      'Pobreza se erradica; desigualdades se reduzem (não se "erradicam").',
      'Independência nacional (art. 4º) não é fundamento; soberania (art. 1º) é.',
      'Ministério Público e Tribunais de Contas não são Poderes.',
    ],
    fontes: [['Constituição Federal, arts. 1º a 4º e 60', CF]],
  },
  'const.direitos': {
    resumo: [
      'Art. 5º, caput: direitos à vida, à liberdade, à igualdade, à segurança e à propriedade. As normas de direitos fundamentais têm aplicação imediata (§ 1º).',
      'Casa (XI): sem consentimento, só em flagrante delito, desastre ou para prestar socorro (a qualquer hora) ou por determinação judicial (durante o dia).',
      'Sigilo (XII): correspondência e comunicações telegráficas, de dados e telefônicas. Só as telefônicas podem ser interceptadas, por ordem judicial, para investigação criminal ou instrução processual penal (Lei 9.296/1996).',
      'Remédios: habeas corpus (locomoção, LXVIII); mandado de segurança (direito líquido e certo não amparado por HC ou HD, LXIX); mandado de segurança coletivo (LXX); mandado de injunção (falta de norma regulamentadora, LXXI); habeas data (informações pessoais em registros públicos, LXXII); ação popular (qualquer cidadão, para anular ato lesivo ao patrimônio público, à moralidade, ao meio ambiente e ao patrimônio histórico, LXXIII).',
      'HC e HD são gratuitos (LXXVII). Na ação popular, o autor fica isento de custas, salvo comprovada má-fé.',
      'Proteção de dados pessoais, inclusive nos meios digitais, é direito fundamental (LXXIX, incluído pela EC 115/2022).',
      'Tratados de direitos humanos aprovados em cada Casa, em dois turnos, por 3/5 dos votos equivalem a emendas constitucionais (§ 3º).',
    ],
    atencao: [
      'Quebra de sigilo telefônico por autoridade policial ou CPI sem ordem judicial: errado. (CPI pode quebrar sigilo de dados telefônicos, mas não interceptar ligações.)',
      'Associações: suspensão das atividades por decisão judicial; dissolução compulsória só por decisão judicial transitada em julgado (XIX).',
      'Legitimidade da ação popular: cidadão (eleitor), não "qualquer pessoa".',
    ],
    fontes: [['Constituição Federal, art. 5º', CF]],
  },
  'const.adm-publica': {
    resumo: [
      'Princípios do art. 37 (LIMPE): legalidade, impessoalidade, moralidade, publicidade e eficiência. Valem para a administração direta e indireta de todos os Poderes e entes.',
      'Concurso: validade de até 2 anos, prorrogável uma vez por igual período (III). Durante a validade, o aprovado tem prioridade sobre novos concursados (IV).',
      'Cargos em comissão são de livre nomeação; funções de confiança são exclusivas de servidores efetivos. Os dois só servem para direção, chefia e assessoramento (V).',
      'Acumulação remunerada (XVI), com compatibilidade de horários e respeito ao teto: dois cargos de professor; professor + técnico ou científico; dois cargos ou empregos privativos de profissionais de saúde com profissão regulamentada.',
      'Improbidade (§ 4º): suspensão dos direitos políticos, perda da função pública, indisponibilidade dos bens e ressarcimento ao erário, sem prejuízo da ação penal.',
      'Responsabilidade objetiva do Estado e das prestadoras de serviço público, com direito de regresso contra o agente em caso de dolo ou culpa (§ 6º).',
      'Estabilidade (art. 41): após 3 anos de efetivo exercício e avaliação especial de desempenho. O servidor estável perde o cargo por sentença judicial transitada em julgado, processo administrativo com ampla defesa ou avaliação periódica de desempenho.',
    ],
    atencao: [
      'Validade do concurso: "até" 2 anos. A prorrogação é por igual período ao fixado, não necessariamente 2 anos.',
      'Estabilidade é no serviço público, não no cargo. Efetividade é atributo do cargo.',
      'Direito de greve do servidor: nos termos e limites de lei específica (VII).',
    ],
    fontes: [['Constituição Federal, arts. 37 a 41', CF]],
  },
  'const.fiscalizacao': {
    resumo: [
      'Art. 70: fiscalização contábil, financeira, orçamentária, operacional e patrimonial, quanto à legalidade, legitimidade, economicidade, aplicação das subvenções e renúncia de receitas. É exercida pelo controle externo (Congresso) e pelo controle interno de cada Poder.',
      'Presta contas qualquer pessoa física ou jurídica, pública ou privada, que utilize, arrecade, guarde, gerencie ou administre dinheiros, bens e valores públicos (art. 70, parágrafo único).',
      'TCU, art. 71: I – aprecia as contas do Presidente com parecer prévio em 60 dias; II – julga as contas dos administradores e responsáveis; III – aprecia, para registro, a legalidade de admissões e de concessões de aposentadorias, reformas e pensões (exceto nomeações para cargo em comissão); IV – realiza inspeções e auditorias; VIII – aplica sanções; IX – assina prazo para correção; X – susta ato impugnado, comunicando à Câmara e ao Senado.',
      'Contrato: a sustação é adotada diretamente pelo Congresso (§ 1º). Se Congresso ou Executivo não agirem em 90 dias, o Tribunal decide (§ 2º). Decisões que imputem débito ou multa são título executivo (§ 3º).',
      'Composição (art. 73): TCU com 9 Ministros. Um terço é escolhido pelo Presidente com aprovação do Senado, sendo dois alternadamente entre auditores e membros do MP junto ao Tribunal; dois terços são escolhidos pelo Congresso.',
      'Controle interno (art. 74): quem souber de irregularidade e não der ciência ao TCU responde solidariamente (§ 1º). Qualquer cidadão, partido, associação ou sindicato pode denunciar irregularidades ao TCU (§ 2º).',
      'Art. 75: as regras valem, no que couber, para os TCEs, que têm 7 Conselheiros.',
    ],
    atencao: [
      'Contas do Presidente: o TCU aprecia (parecer prévio); quem julga é o Congresso (art. 49, IX).',
      'Ato administrativo: o próprio Tribunal susta. Contrato: o Congresso susta.',
      'Súmula Vinculante 3: nos processos no TCU há contraditório e ampla defesa quando a decisão puder anular ou revogar ato que beneficie o interessado, exceto na apreciação da legalidade do ato inicial de aposentadoria, reforma e pensão.',
    ],
    fontes: [['Constituição Federal, arts. 70 a 75', CF], ['Portal do TCU', TCU]],
  },

  // ───────────── Controle Externo ─────────────
  'ce.conceitos': {
    resumo: [
      'Controle é o poder de fiscalizar e corrigir a atuação administrativa.',
      'Quanto ao órgão que controla: administrativo (a própria Administração), legislativo (Parlamento, com o auxílio do Tribunal de Contas) e judicial.',
      'Quanto à posição: interno (dentro da mesma estrutura de Poder) e externo (por outro Poder ou órgão).',
      'Quanto ao momento: prévio (antes do ato), concomitante (durante) e posterior (depois).',
      'Quanto ao aspecto: legalidade e mérito. O mérito (conveniência e oportunidade) só é revisto pela própria Administração.',
      'Controle social: exercido pelo cidadão e pela sociedade (denúncia ao TC pelo art. 74, § 2º, da CF; pedidos de informação pela LAI).',
      'Os Tribunais de Contas não integram o Judiciário. São órgãos autônomos que auxiliam o Legislativo, e suas decisões são administrativas, sujeitas a controle judicial.',
      'Instrumentos de fiscalização (modelo do TCU): auditoria, inspeção, levantamento, acompanhamento e monitoramento. A auditoria operacional avalia economicidade, eficiência, eficácia e efetividade.',
    ],
    atencao: [
      'O Judiciário controla legalidade e legitimidade, nunca o mérito administrativo.',
      'TC "subordinado" ao Legislativo: errado. Ele auxilia, mas tem competências próprias.',
    ],
    fontes: [['Constituição Federal, arts. 70 a 75 e 92', CF], ['Portal do TCU (publicações sobre fiscalização)', TCU]],
  },
  'ce.lc63-1': {
    resumo: [
      'A LC estadual 63/1990 é a Lei Orgânica do TCE-RJ.',
      'Art. 1º: compete ao TCE-RJ julgar as contas dos administradores e responsáveis por dinheiros, bens e valores públicos das unidades dos Poderes do Estado e da administração indireta (incluídas as fundações e sociedades instituídas e mantidas pelo Poder Público estadual), dos fundos e de quem der causa a perda, extravio ou outra irregularidade com dano ao erário. Também exerce a fiscalização contábil, financeira, orçamentária, operacional e patrimonial dessas entidades.',
      'Art. 2º: no julgamento e na fiscalização, o Tribunal decide sobre a legalidade, a legitimidade e a economicidade dos atos de gestão e das despesas, e sobre a aplicação de subvenções, auxílios e renúncia de receitas.',
      'Art. 3º: compete também ao Tribunal apreciar as contas prestadas anualmente pelo Governador (parecer prévio). O julgamento cabe à ALERJ, por simetria com a CF.',
      'Art. 5º: o Tribunal tem jurisdição própria e privativa, em todo o território estadual, sobre as pessoas e matérias sujeitas à sua competência.',
      'Municípios: o TCE-RJ auxilia o controle externo dos municípios fluminenses, exceto o da capital, que tem o TCM-RJ (CF, art. 31, §§ 1º e 4º).',
    ],
    atencao: [
      'Leia a LC 63/1990 na íntegra, no texto atualizado. As bancas cobram a literalidade da lei orgânica do órgão.',
      'Governador: o TCE aprecia; quem julga é a ALERJ.',
    ],
    fontes: [['LC estadual 63/1990, texto na ALERJ', LC63], ['Portal do TCE-RJ', TCERJ], ['Constituição Federal, arts. 31 e 75', CF]],
  },

  // ───────────── Administrativo ─────────────
  'adm.principios': {
    resumo: [
      'Expressos na CF (art. 37): legalidade, impessoalidade, moralidade, publicidade e eficiência (incluída pela EC 19/1998).',
      'A Lei 9.784/1999 (art. 2º) lista também: finalidade, motivação, razoabilidade, proporcionalidade, ampla defesa, contraditório, segurança jurídica e interesse público.',
      'Pilares do regime jurídico-administrativo: supremacia do interesse público sobre o privado (prerrogativas) e indisponibilidade do interesse público (sujeições).',
      'Legalidade administrativa: a Administração só pode fazer o que a lei permite ou determina.',
      'Impessoalidade: finalidade pública e proibição de promoção pessoal em publicidade oficial (art. 37, § 1º).',
      'Autotutela (Súmulas 346 e 473 do STF): anular atos ilegais (efeitos retroativos) e revogar atos inconvenientes ou inoportunos (efeitos para o futuro), respeitados os direitos adquiridos.',
      'Prazo para anular atos que favoreçam o destinatário: 5 anos, salvo comprovada má-fé (Lei 9.784, art. 54).',
      'Nepotismo (Súmula Vinculante 13): vedada a nomeação de cônjuge, companheiro ou parente até o 3º grau da autoridade nomeante ou de servidor em cargo de direção, chefia ou assessoramento.',
    ],
    atencao: [
      '"A Administração pode fazer tudo o que a lei não proíbe": errado (essa é a legalidade do particular).',
      'Revogação é só pela Administração. O Judiciário anula atos ilegais, mas não revoga atos de outro Poder.',
    ],
    fontes: [['Constituição Federal, art. 37', CF], ['Lei 9.784/1999 (processo administrativo federal)', L9784], ['STF: súmulas e súmulas vinculantes', STF]],
  },
  'adm.poderes': {
    resumo: [
      'Poder hierárquico: dar ordens, fiscalizar, delegar, avocar e rever atos dos subordinados. É interno à Administração.',
      'Poder disciplinar: apurar infrações e punir servidores e particulares com vínculo especial com a Administração (contratados, por exemplo).',
      'Poder regulamentar: decretos para a fiel execução das leis (CF, art. 84, IV), sem inovar. Exceção: decreto autônomo do art. 84, VI (organização da administração sem aumento de despesa e extinção de cargos vagos).',
      'Poder de polícia: limitar direitos individuais em favor do interesse público (definição no CTN, art. 78). Atributos (DAC): discricionariedade, autoexecutoriedade e coercibilidade.',
      'Delegação do poder de polícia: o STF (Tema 532) admitiu a delegação a pessoas jurídicas de direito privado da administração indireta com capital majoritariamente público que prestem exclusivamente serviço público em regime não concorrencial.',
      'Abuso de poder: excesso de poder (agir fora da competência) e desvio de finalidade (agir com fim diferente do previsto em lei, Lei 4.717/1965, art. 2º).',
      'Não podem ser delegados: edição de atos normativos, decisão de recursos administrativos e matérias de competência exclusiva (Lei 9.784, art. 13).',
    ],
    atencao: [
      'Multa sanitária a um comerciante é poder de polícia, não poder disciplinar (não há vínculo especial).',
      'Remover servidor para puni-lo é desvio de finalidade.',
      'Cobrança de multa de polícia não é autoexecutória: depende de execução fiscal.',
    ],
    fontes: [['Lei 9.784/1999, arts. 11 a 17 (competência e delegação)', L9784], ['Lei 4.717/1965, art. 2º (vícios do ato)', L4717], ['CTN, art. 78 (poder de polícia)', CTN], ['Constituição Federal, art. 84', CF]],
  },

  // ───────────── Segurança da Informação ─────────────
  'si.pilares': {
    resumo: [
      'Confidencialidade: só pessoas autorizadas acessam a informação.',
      'Integridade: a informação está exata e completa, sem alterações indevidas.',
      'Disponibilidade: a informação está acessível quando os autorizados precisam.',
      'Outras propriedades: autenticidade (provém da fonte declarada), não repúdio ou irretratabilidade (o autor não pode negar a autoria), responsabilização (accountability) e confiabilidade.',
      'Mecanismos típicos: confidencialidade com criptografia e controle de acesso; integridade com hash, HMAC e assinatura; disponibilidade com redundância, backup e proteção contra DDoS; autenticidade com autenticação e certificados; não repúdio com assinatura digital.',
      'Ataques e o pilar afetado: interceptação (confidencialidade), modificação (integridade), interrupção (disponibilidade) e fabricação (autenticidade).',
    ],
    atencao: [
      'Definição de disponibilidade apresentada como integridade (ou o contrário) é pegadinha frequente.',
      'Hash sozinho garante integridade, mas não autenticidade nem não repúdio.',
    ],
    fontes: [['ISO/IEC 27000 (definições): disponível gratuitamente no site da ISO', ISO_GRATIS], ['Cartilha de Segurança para Internet (CERT.br)', CERT]],
  },
  'si.ameaca-risco': {
    resumo: [
      'Ativo: qualquer coisa que tenha valor para a organização (informação, sistemas, pessoas, instalações).',
      'Ameaça: causa potencial de um incidente indesejado. Vulnerabilidade: fraqueza de um ativo ou controle que pode ser explorada por uma ameaça.',
      'Risco: efeito da incerteza sobre os objetivos, normalmente expresso pela combinação de probabilidade e consequência.',
      'Evento de segurança é uma ocorrência que pode indicar problema; incidente é o evento que de fato compromete (ou tem grande chance de comprometer) a segurança.',
      'Controles por função: preventivos (evitam), detectivos (identificam) e corretivos (restauram). A doutrina cita também dissuasivos e compensatórios.',
      'Controles por natureza: físicos (catracas, câmeras), lógicos ou tecnológicos (senhas, criptografia, firewall) e administrativos ou organizacionais (políticas, treinamento).',
      'Defesa em profundidade: várias camadas de controle, de modo que a falha de uma não comprometa o todo.',
    ],
    atencao: [
      'Risco ≠ ameaça ≠ vulnerabilidade: o risco existe quando uma ameaça pode explorar uma vulnerabilidade de um ativo.',
      'IDS que só alerta é detectivo; IPS que bloqueia é preventivo; backup restaurado é corretivo.',
    ],
    fontes: [['ISO/IEC 27000 (gratuita no site da ISO)', ISO_GRATIS], ['ISO/IEC 27002:2022 (página oficial)', ISO27002]],
  },
  'si.politica': {
    resumo: [
      'Política de segurança da informação (PSI): diretrizes aprovadas pela alta direção, publicadas, comunicadas e revisadas periodicamente (ISO 27002, 5.1). Normas e procedimentos detalham a política.',
      'Gestão de ativos: inventário com proprietário definido (5.9). Classificação da informação (5.12), rotulagem (5.13) e transferência (5.14).',
      'Princípios de acesso: menor privilégio, necessidade de conhecer e segregação de funções (5.3).',
      'LAI (Lei 12.527/2011, art. 24): informação ultrassecreta até 25 anos (prorrogável uma única vez), secreta até 15 anos e reservada até 5 anos.',
      'Informações pessoais relativas à intimidade, à vida privada, à honra e à imagem têm acesso restrito por até 100 anos (LAI, art. 31).',
      'Na LAI, o acesso é a regra e o sigilo é a exceção.',
    ],
    atencao: [
      'Trocar os prazos da LAI (reservada 15 anos, por exemplo) é pegadinha comum. Mnemônico: 25-15-5.',
      'A PSI deve ser aprovada pela direção, não só pela área de TI.',
    ],
    fontes: [['Lei 12.527/2011 (LAI), arts. 23 a 31', LAI], ['ISO/IEC 27002:2022 (página oficial)', ISO27002]],
  },
  'si.cripto-simetrica': {
    resumo: [
      'Usa uma única chave secreta compartilhada para cifrar e decifrar. É rápida, mas exige distribuição segura da chave. Para n pessoas se comunicarem em pares, são necessárias n(n−1)/2 chaves.',
      'Cifras de bloco: AES (bloco de 128 bits; chaves de 128, 192 ou 256 bits), DES (chave efetiva de 56 bits, bloco de 64; inseguro) e 3DES (em desuso). Cifras de fluxo: ChaCha20; RC4 é obsoleto.',
      'Modos de operação: ECB (cada bloco cifrado isoladamente; vaza padrões), CBC (encadeia blocos e usa IV), CTR (contador; vira cifra de fluxo e permite paralelismo) e GCM (CTR + autenticação, ou seja, AEAD).',
      'Garante confidencialidade. Não garante não repúdio, porque as duas partes têm a mesma chave.',
      'Princípio de Kerckhoffs: a segurança deve depender do segredo da chave, não do segredo do algoritmo.',
    ],
    atencao: [
      'ECB é o modo inseguro para dados com padrões (blocos iguais geram cifras iguais).',
      'O NIST não aceita mais o 3DES para cifrar dados novos; o recomendado é o AES.',
    ],
    fontes: [['NIST FIPS 197 (AES)', nist('fips/197')], ['NIST SP 800-38A (modos de operação)', nist('sp/800/38/a')], ['NIST SP 800-131A Rev. 2 (algoritmos em transição)', nist('sp/800/131/a/r2')]],
  },
  'si.cripto-assimetrica': {
    resumo: [
      'Cada pessoa tem um par de chaves: a pública (divulgada) e a privada (secreta). Para n pessoas, são 2n chaves.',
      'Confidencialidade: cifra-se com a chave pública do destinatário; só a privada dele decifra.',
      'Assinatura: assina-se com a chave privada do remetente; qualquer um verifica com a pública do remetente.',
      'Algoritmos: RSA (baseado na fatoração de inteiros), ECC (curvas elípticas, mesma segurança com chaves menores), Diffie-Hellman (acordo de chave secreta) e DSA, ECDSA e EdDSA (assinatura).',
      'É mais lenta que a simétrica. Por isso, os sistemas usam o modelo híbrido: a assimétrica estabelece ou protege a chave de sessão e a simétrica cifra os dados (é assim no TLS).',
      'Diffie-Hellman sem autenticação das partes é vulnerável a man-in-the-middle.',
    ],
    atencao: [
      '"Assinar com a chave pública do destinatário": errado.',
      'Segurança equivalente a 128 bits: RSA de 3072 bits ou ECC de 256 bits.',
    ],
    fontes: [['NIST SP 800-57 Part 1 Rev. 5 (tamanhos de chave)', nist('sp/800/57/pt1/r5')], ['RFC 8446 (TLS 1.3)', rfc(8446)]],
  },
  'si.hash-assinatura': {
    resumo: [
      'Função hash: gera resumo de tamanho fixo, é unidirecional e tem efeito avalanche (pequena mudança na entrada muda todo o resumo).',
      'Propriedades: resistência à pré-imagem, à segunda pré-imagem e a colisões.',
      'MD5 (128 bits) e SHA-1 (160 bits) têm colisões práticas e não devem ser usados para assinatura. Use SHA-256, SHA-512 ou SHA-3.',
      'HMAC: hash + chave secreta. Garante integridade e autenticidade da origem, mas não o não repúdio (a chave é compartilhada).',
      'Assinatura digital: calcula-se o hash do documento e assina-se esse resumo com a chave privada. Garante autenticidade, integridade e não repúdio. Não garante confidencialidade.',
      'Senhas devem ser guardadas com hash lento e com salt (bcrypt, scrypt, Argon2 ou PBKDF2), nunca com hash simples.',
    ],
    atencao: [
      'Assinatura digital não cifra o documento: quem tem o documento lê o conteúdo.',
      'O número no nome indica o tamanho da saída: SHA-256 gera 256 bits.',
    ],
    fontes: [['NIST FIPS 180-4 (família SHA)', nist('fips/180-4/upd1')], ['RFC 2104 (HMAC)', rfc(2104)]],
  },
  'si.pki': {
    resumo: [
      'Certificado digital (padrão X.509): associa uma chave pública à identidade do titular, tem prazo de validade e é assinado pela Autoridade Certificadora (AC).',
      'ICP-Brasil (MP 2.200-2/2001): o ITI é a AC Raiz. As ACs emitem certificados e as Autoridades de Registro (AR) identificam o titular.',
      'Documentos eletrônicos assinados com certificado ICP-Brasil presumem-se verdadeiros em relação aos signatários (art. 10, § 1º). Outros meios de comprovar autoria são aceitos se as partes concordarem (§ 2º).',
      'Revogação: a Lista de Certificados Revogados (LCR/CRL) é publicada pela AC; o OCSP consulta o status em tempo real.',
      'Carimbo do tempo comprova a data e a hora em que um documento existia.',
      'A Lei 14.063/2020 classifica as assinaturas eletrônicas em simples, avançada e qualificada (esta última usa certificado ICP-Brasil).',
    ],
    atencao: [
      'A AC assina o certificado com a chave privada dela; quem verifica usa a chave pública da AC.',
      'Certificado expirado e certificado revogado são situações diferentes.',
    ],
    fontes: [['MP 2.200-2/2001 (ICP-Brasil)', MP2200], ['Lei 14.063/2020 (assinaturas eletrônicas)', L14063], ['ITI: Instituto Nacional de Tecnologia da Informação', ITI], ['RFC 5280 (perfil X.509)', rfc(5280)]],
  },
  'si.iso27001': {
    resumo: [
      'Norma de requisitos para estabelecer, implementar, manter e melhorar continuamente um SGSI. É a norma certificável da família 27000.',
      'Estrutura (comum às normas de sistema de gestão ISO): 4 contexto da organização; 5 liderança; 6 planejamento; 7 apoio; 8 operação; 9 avaliação de desempenho (monitoramento, auditoria interna e análise crítica pela direção); 10 melhoria.',
      'O Anexo A traz os 93 controles de referência, com os mesmos títulos da ISO 27002:2022.',
      'Declaração de Aplicabilidade (6.1.3 d): lista os controles necessários, a justificativa de inclusão, se estão implementados e a justificativa da exclusão de controles do Anexo A.',
      'Os requisitos das cláusulas 4 a 10 não podem ser excluídos quando a organização declara conformidade.',
      'A Emenda 1:2024 incluiu a consideração das mudanças climáticas no contexto da organização (cláusulas 4.1 e 4.2).',
    ],
    atencao: [
      'Auditoria interna e análise crítica estão na cláusula 9; não conformidade e ação corretiva, na 10.',
      'Certifica-se pela 27001, não pela 27002.',
    ],
    fontes: [['ISO/IEC 27001 (página oficial)', ISO27001], ['ISO/IEC 27000 (vocabulário, gratuita)', ISO_GRATIS]],
  },
  'si.iso27002': {
    resumo: [
      'Guia de boas práticas com orientações para implementar controles. Não é certificável.',
      'São 93 controles em 4 temas: 37 organizacionais (seção 5), 8 de pessoas (6), 14 físicos (7) e 34 tecnológicos (8).',
      'Os 11 controles novos na edição de 2022 são: inteligência de ameaças (5.7), segurança no uso de serviços em nuvem (5.23), prontidão de TIC para continuidade (5.30), monitoramento de segurança física (7.4), gestão de configuração (8.9), exclusão de informações (8.10), mascaramento de dados (8.11), prevenção de vazamento de dados (8.12), atividades de monitoramento (8.16), filtragem da web (8.23) e codificação segura (8.28).',
      'Cada controle tem atributos: tipo (preventivo, detectivo, corretivo), propriedades de segurança (C, I, D), conceitos de cibersegurança (identificar, proteger, detectar, responder, recuperar), capacidades operacionais e domínios de segurança.',
      'A edição anterior (2013) tinha 114 controles em 14 seções.',
    ],
    atencao: [
      'Mnemônico das quantidades: 37-8-14-34 (total 93).',
      'Trabalho remoto (6.7) é controle de pessoas; segurança de cabeamento (7.12) é físico.',
    ],
    fontes: [['ISO/IEC 27002:2022 (página oficial)', ISO27002]],
  },
  'si.malware': {
    resumo: [
      'Vírus: precisa de um hospedeiro e de execução para se propagar. Worm: propaga-se sozinho pela rede, explorando vulnerabilidades.',
      'Cavalo de troia: parece útil, mas executa funções maliciosas escondidas. Backdoor: garante o retorno do invasor. Rootkit: esconde a presença do invasor ou do malware.',
      'Spyware: monitora e envia dados (keylogger captura teclas, screenlogger captura a tela, adware exibe propaganda). Bot: permite controle remoto; muitos bots formam uma botnet.',
      'Ransomware: torna os dados inacessíveis, geralmente por criptografia, e exige resgate.',
      'Engenharia social: phishing (mensagem falsa de instituição conhecida), spear phishing (direcionado), whaling (alvo é alta direção), smishing (SMS), vishing (voz), pretexting (história inventada) e tailgating (entrar fisicamente atrás de alguém autorizado).',
      'Defesas: manter sistemas atualizados, antimalware/EDR, MFA, menor privilégio, conscientização e backup 3-2-1 (3 cópias, 2 mídias diferentes, 1 fora do local, de preferência offline).',
    ],
    atencao: [
      'A diferença entre vírus e worm (precisa ou não de hospedeiro e execução) cai com frequência.',
      'Contra ransomware, o backup só protege se estiver desconectado ou imutável.',
    ],
    fontes: [['Cartilha de Segurança para Internet (CERT.br): fascículos de códigos maliciosos, golpes e ransomware', CERT]],
  },
  'si.ataques': {
    resumo: [
      'DoS/DDoS: volumétricos (UDP flood, amplificação por DNS ou NTP), de protocolo (SYN flood) e de aplicação (HTTP flood). No DDoS, a origem é distribuída, muitas vezes uma botnet.',
      'Smurf: pings para endereço de broadcast com IP de origem falsificado (o da vítima).',
      'Man-in-the-middle: o atacante se põe entre as partes. ARP spoofing, DNS spoofing (envenenamento de cache) e sequestro de sessão são formas comuns.',
      'Sniffing: captura passiva do tráfego. A mitigação é cifrar (HTTPS, SSH, VPN).',
      'Ataques a senhas: força bruta (todas as combinações), dicionário, credential stuffing (senhas vazadas de outros sites) e password spraying (poucas senhas comuns contra muitas contas).',
      'Passivos (só observam, afetam a confidencialidade e são difíceis de detectar) × ativos (modificam, interrompem ou fabricam).',
      'Contramedidas: SYN cookies, limitação de taxa, serviços anti-DDoS e CDN, Dynamic ARP Inspection, DNSSEC, MFA e bloqueio após tentativas.',
    ],
    atencao: [
      'SYN flood explora o three-way handshake do TCP, deixando conexões semiabertas.',
      'IP spoofing falsifica o endereço de origem; não é o mesmo que ARP spoofing (que atua na rede local).',
    ],
    fontes: [['Cartilha de Segurança para Internet (CERT.br): ataques na internet', CERT], ['RFC 4987 (SYN flooding e mitigações)', rfc(4987)]],
  },
  'si.riscos': {
    resumo: [
      'ISO 31000:2018 (gestão de riscos em geral): princípios, estrutura e processo.',
      'Processo: comunicação e consulta; escopo, contexto e critérios; avaliação de riscos (identificação, análise e avaliação); tratamento; monitoramento e análise crítica; registro e relato.',
      'Opções de tratamento: evitar (não iniciar ou descontinuar a atividade), modificar/mitigar (controles), compartilhar/transferir (seguro, terceirização) e reter/aceitar (decisão consciente).',
      'Risco inerente (antes dos controles) × risco residual (depois do tratamento). O residual precisa ser aceito pelos proprietários do risco (ISO 27001, 6.1.3 f).',
      'Análise qualitativa usa escalas (baixo, médio, alto). Análise quantitativa usa valores: SLE = valor do ativo × fator de exposição; ALE = SLE × taxa anual de ocorrência (ARO).',
      'ISO/IEC 27005:2022: orientações para riscos de segurança da informação, com duas abordagens de identificação: baseada em eventos e baseada em ativos.',
    ],
    atencao: [
      'Transferir o risco não transfere a responsabilidade pela gestão dele.',
      'Na tradução brasileira, "processo de avaliação de riscos" engloba identificação, análise e avaliação.',
    ],
    fontes: [['ISO 31000:2018 (página oficial)', ISO31000], ['ISO/IEC 27005:2022 (página oficial)', ISO27005]],
  },

  // ───────────── Redes ─────────────
  'redes.osi': {
    resumo: [
      'Modelo OSI, de baixo para cima: 1 física (bits no meio), 2 enlace (quadros, endereço MAC, detecção de erros), 3 rede (pacotes, IP, roteamento), 4 transporte (segmentos, portas, TCP/UDP), 5 sessão, 6 apresentação (formato, compressão, cifração) e 7 aplicação.',
      'Modelo TCP/IP: acesso à rede (ou enlace), internet, transporte e aplicação. Alguns livros (Kurose) usam 5 camadas, separando física e enlace.',
      'Encapsulamento: cada camada acrescenta o próprio cabeçalho ao descer; ao subir, cada uma remove o seu.',
      'Unidades de dados (PDU): bit (física), quadro (enlace), pacote ou datagrama (rede), segmento (TCP) ou datagrama (UDP) e mensagem (aplicação).',
      'Equipamentos: hub (camada 1), switch (2), roteador e switch de camada 3 (3), proxy e WAF (7).',
    ],
    atencao: [
      'Associar TCP à camada de rede, ou IP à de transporte, é pegadinha comum.',
      'No modelo TCP/IP, as funções de sessão e apresentação ficam na camada de aplicação.',
    ],
    fontes: [['Kurose e Ross, Redes de Computadores e a Internet, cap. 1', null], ['RFC 1122 (requisitos de hosts na internet)', rfc(1122)]],
  },
  'redes.enlace': {
    resumo: [
      'Endereço MAC: 48 bits. Os 24 primeiros identificam o fabricante (OUI).',
      'Quadro Ethernet (IEEE 802.3): MAC de destino e de origem, tipo, dados e FCS (CRC para detectar erros).',
      'Switch: aprende os MACs de origem por porta, encaminha para a porta certa e inunda quadros de broadcast ou com destino desconhecido.',
      'Domínios: um hub forma um único domínio de colisão; o switch separa colisões por porta, mas mantém um só domínio de broadcast; o roteador separa domínios de broadcast.',
      'VLAN (IEEE 802.1Q): tag de 4 bytes com VLAN ID de 12 bits (até 4094 VLANs utilizáveis). Porta access pertence a uma VLAN; porta trunk carrega várias. Comunicação entre VLANs exige roteamento.',
      'STP (IEEE 802.1D) evita loops em redes com caminhos redundantes. CSMA/CD só se aplica a half-duplex.',
    ],
    atencao: [
      'VLAN separa domínios de broadcast, não cifra tráfego.',
      'Switch comum não encaminha entre VLANs; para isso é preciso roteador ou switch de camada 3.',
    ],
    fontes: [['Kurose e Ross, cap. 6 (camada de enlace)', null]],
  },
  'redes.ipv4': {
    resumo: [
      'Endereço IPv4: 32 bits em 4 octetos. A notação CIDR /n indica quantos bits são de rede.',
      'Hosts utilizáveis = 2^(32−n) − 2. Valores mais cobrados: /24 = 254; /25 = 126; /26 = 62; /27 = 30; /28 = 14; /29 = 6; /30 = 2.',
      'Tamanho do bloco = 256 − valor da máscara no octeto que muda. Exemplo: /26 (máscara 192) tem blocos de 64: .0, .64, .128, .192.',
      'Endereço de rede: bits de host todos em 0. Broadcast: bits de host todos em 1.',
      'Faixas privadas (RFC 1918): 10.0.0.0/8, 172.16.0.0/12 (até 172.31.255.255) e 192.168.0.0/16. Loopback: 127.0.0.0/8. Link-local (APIPA): 169.254.0.0/16. CGNAT: 100.64.0.0/10.',
      'Classes (só histórico): A 1–126, B 128–191, C 192–223, D (multicast) 224–239, E 240–255.',
    ],
    atencao: [
      '172.32.x.x não é privado (a faixa vai só até 172.31).',
      'Para achar a sub-rede de um host, veja em qual bloco o último octeto cai (ex.: .70 em /26 → bloco .64).',
    ],
    fontes: [['RFC 1918 (endereços privados)', rfc(1918)], ['RFC 4632 (CIDR)', rfc(4632)]],
  },
  'redes.subnet-ipv6': {
    resumo: [
      'Para criar 2^k sub-redes, empreste k bits da parte de host. Exemplo: /24 dividida em 4 → empresta 2 bits → /26.',
      'IPv6: 128 bits em 8 grupos de 16 bits, em hexadecimal. Zeros à esquerda de cada grupo podem ser omitidos, e uma sequência de grupos de zeros pode virar "::" uma única vez.',
      'Tipos: unicast global (2000::/3), link-local (fe80::/10), unique local (fc00::/7), multicast (ff00::/8) e anycast. Não existe broadcast. Loopback: ::1.',
      'Cabeçalho fixo de 40 bytes, sem checksum. Fragmentação só na origem.',
      'Neighbor Discovery (ICMPv6) substitui o ARP. SLAAC permite autoconfiguração de endereço. O prefixo típico de sub-rede é /64.',
    ],
    atencao: [
      '"::" duas vezes no mesmo endereço é inválido.',
      'IPv6 tem multicast e anycast, mas não broadcast.',
    ],
    fontes: [['RFC 4291 (endereçamento IPv6)', rfc(4291)], ['RFC 5952 (representação em texto)', rfc(5952)], ['RFC 8200 (IPv6)', rfc(8200)]],
  },
  'redes.transporte': {
    resumo: [
      'ARP: descobre o MAC a partir do IPv4 na rede local, com pergunta em broadcast e resposta unicast.',
      'ICMP: Echo Request (tipo 8) e Echo Reply (tipo 0) são usados pelo ping; Destination Unreachable (3); Time Exceeded (11), usado pelo traceroute.',
      'TCP: orientado à conexão, confiável e ordenado, com controle de fluxo (janela) e de congestionamento. Conexão: SYN, SYN-ACK, ACK. Encerramento com FIN e ACK; RST aborta.',
      'UDP: sem conexão, sem garantia de entrega nem de ordem, cabeçalho de 8 bytes. Usado em DNS, DHCP, VoIP, streaming e SNMP.',
      'Portas mais cobradas: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 161 SNMP, 443 HTTPS, 587 submissão de e-mail, 993 IMAPS, 995 POP3S, 3389 RDP. Portas bem conhecidas: 0 a 1023.',
    ],
    atencao: [
      'UDP "garante entrega" ou "é orientado à conexão": errado.',
      'Telnet (23) e FTP (21) trafegam sem cifra; SSH (22) é a alternativa segura.',
    ],
    fontes: [['RFC 9293 (TCP)', rfc(9293)], ['RFC 768 (UDP)', rfc(768)], ['RFC 792 (ICMP)', rfc(792)], ['RFC 826 (ARP)', rfc(826)]],
  },
  'redes.aplicacao': {
    resumo: [
      'DNS: sistema hierárquico de nomes. Registros: A (IPv4), AAAA (IPv6), MX (e-mail), CNAME (apelido), NS (servidor de nomes), PTR (reverso), TXT (usado por SPF, DKIM, DMARC) e SOA. Porta 53, UDP na maioria das consultas e TCP em transferências de zona e respostas grandes.',
      'DHCP: atribui IP, máscara, gateway, DNS e tempo de concessão. Troca DORA (Discover, Offer, Request, Acknowledge). UDP 67 (servidor) e 68 (cliente).',
      'HTTP: protocolo sem estado (cookies mantêm sessão). Métodos: GET, POST, PUT, PATCH, DELETE, HEAD. Códigos: 1xx informação, 2xx sucesso, 3xx redirecionamento, 4xx erro do cliente (404 não encontrado, 403 proibido), 5xx erro do servidor.',
      'HTTPS é HTTP sobre TLS (porta 443). HTTP/2 multiplexa requisições; HTTP/3 roda sobre QUIC (UDP).',
      'E-mail: SMTP envia (25 entre servidores, 587 na submissão pelo cliente); POP3 (110) baixa as mensagens; IMAP (143) sincroniza a caixa no servidor.',
      'FTP usa portas 20 (dados) e 21 (controle), sem cifra. SFTP roda sobre SSH; FTPS usa TLS.',
    ],
    atencao: [
      'SMTP é para enviar; POP3 e IMAP, para ler. Inverter é pegadinha clássica.',
      '401 é "não autenticado"; 403 é "autenticado, mas sem permissão".',
    ],
    fontes: [['RFC 1035 (DNS)', rfc(1035)], ['RFC 2131 (DHCP)', rfc(2131)], ['RFC 9110 (semântica HTTP)', rfc(9110)], ['RFC 5321 (SMTP)', rfc(5321)]],
  },
  'redes.firewall': {
    resumo: [
      'Filtro de pacotes estático (stateless): decide pelos cabeçalhos (IPs, portas, protocolo), pacote a pacote.',
      'Stateful: mantém tabela de estados das conexões e libera automaticamente o tráfego de retorno.',
      'Proxy ou gateway de aplicação: atua na camada 7 e entende o protocolo. NGFW: acrescenta identificação de aplicações, IPS e usuários. WAF: protege aplicações web (riscos do OWASP Top 10).',
      'Regras são avaliadas em ordem. Boa prática: política padrão de negar tudo e liberar só o necessário.',
      'DMZ: rede intermediária para serviços acessados pela internet (web, e-mail), isolada da rede interna.',
      'Proxy (direto) atende os clientes internos; proxy reverso fica à frente dos servidores (balanceamento, terminação TLS, cache, ocultação da topologia).',
      'NAT/PAT traduz endereços privados em públicos. Esconde a rede interna, mas não cifra e não é controle de segurança por si só.',
    ],
    atencao: [
      'NAT não cifra o tráfego.',
      'O firewall stateless não sabe se um pacote pertence a uma conexão já estabelecida.',
    ],
    fontes: [['NIST SP 800-41 Rev. 1 (firewalls)', nist('sp/800/41/r1')], ['RFC 3022 (NAT)', rfc(3022)]],
  },
  'redes.ids-vpn': {
    resumo: [
      'IDS detecta e alerta; costuma receber uma cópia do tráfego (porta espelhada ou TAP). IPS fica em linha (inline) e pode bloquear. NIDS monitora a rede; HIDS monitora um host.',
      'Detecção por assinatura: eficaz contra ataques conhecidos, com poucos falsos positivos, mas falha com ataques inéditos (zero-day). Por anomalia: detecta comportamentos novos, com mais falsos positivos.',
      'Falso positivo: tráfego legítimo tratado como ataque. Falso negativo: ataque não detectado (mais grave).',
      'VPN: túnel cifrado sobre rede pública. Pode ser site a site (entre redes) ou de acesso remoto (usuário para a rede).',
      'IPsec: AH garante integridade e autenticação, sem cifrar (e é incompatível com NAT); ESP garante confidencialidade, integridade e autenticação; IKE negocia as associações de segurança (SAs).',
      'Modo transporte protege só a carga útil (mantém o cabeçalho original). Modo túnel encapsula o pacote inteiro com novo cabeçalho IP (típico de VPN entre gateways).',
      'VPN SSL/TLS e WireGuard são alternativas comuns para acesso remoto.',
    ],
    atencao: [
      'AH não cifra. Quem cifra no IPsec é o ESP.',
      'IDS bloqueando ataque: errado (quem bloqueia é o IPS).',
    ],
    fontes: [['NIST SP 800-94 (IDS/IPS)', nist('sp/800/94')], ['RFC 4301 (arquitetura IPsec)', rfc(4301)], ['RFC 4303 (ESP)', rfc(4303)]],
  },
};

/** Fontes gerais por disciplina, para tópicos ainda sem resumo. */
export const FONTES_DISCIPLINA = {
  port: [['Gramática de referência (Bechara ou Cegalla)', null]],
  const: [['Constituição Federal', CF]],
  adm: [['Constituição Federal, arts. 37 a 41', CF], ['Lei 9.784/1999', L9784]],
  ce: [['LC estadual 63/1990 (ALERJ)', LC63], ['Portal do TCE-RJ', TCERJ], ['Portal do TCU', TCU]],
  leg: [['Lei de Acesso à Informação', LAI]],
  si: [['Cartilha de Segurança para Internet (CERT.br)', CERT], ['Normas ISO gratuitas (inclui a 27000)', ISO_GRATIS]],
  redes: [['RFC Editor (todas as RFCs)', 'https://www.rfc-editor.org/']],
};
