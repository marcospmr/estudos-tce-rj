# Design: App de Estudos TCE-RJ (Auditor de Controle Externo, TI)

Baseado em [requirements.md](./requirements.md). Este documento tem duas partes:

- **Parte A: plano de estudos estruturado para 14 h semanais.** É o conteúdo que o app executa. Também pode ser usado sem o app.
- **Parte B: design técnico do app.**

---

# Parte A: Plano de estudos (14 h/semana)

## A1. Orçamento de horas

Com 14 h por semana durante cerca de 48 semanas efetivas (descontando cerca de 4 semanas de folga e imprevistos), o total é de **aproximadamente 670 horas**. Isso basta para ver todo o conteúdo e fazer uma fase de questões, desde que o escopo seja priorizado. Os tópicos de menor peso ficam mais enxutos do que no plano de 22 h.

| Grupo | Disciplina | Horas no ano | % |
|---|---|---|---|
| **TI (60%)** | Segurança da Informação | 110 | 16% |
| | Redes de Computadores | 60 | 9% |
| | Governança de TI (COBIT 2019, ITIL 4, riscos) | 50 | 7% |
| | Auditoria de TI e Auditoria Governamental | 45 | 7% |
| | Contratações de TI (Lei 14.133 aplicada, IN SGD 94/2022) | 30 | 4% |
| | Banco de Dados e SQL | 30 | 4% |
| | Eng. de Software e Gestão de Projetos | 35 | 5% |
| | Nuvem, Infraestrutura, Dados/BI/IA | 40 | 6% |
| **Básicas (40%)** | Língua Portuguesa | 60 | 9% |
| | Direito Administrativo (com a Lei 14.133) | 60 | 9% |
| | Direito Constitucional | 45 | 7% |
| | Controle Externo (LC 63/1990, RI, CE-RJ) | 45 | 7% |
| | AFO / Direito Financeiro | 30 | 4% |
| | Raciocínio Lógico e Estatística | 20 | 3% |
| | Legislação (LGPD, LAI, Marco Civil, Governo Digital) | 15 | 2% |
| **Total** | | **675** | 100% |

As horas incluem teoria, questões e revisão.

## A2. Semana-modelo (840 min)

Para o tempo render, o plano usa **três trilhas** paralelas que avançam em sequência:

- **Trilha B (Básicas):** Português, Constitucional, Administrativo, Controle Externo, AFO, Raciocínio Lógico e Legislação, intercaladas.
- **Trilha T1 (TI principal):** Segurança da Informação, depois Governança, Auditoria de TI e Contratações.
- **Trilha T2 (TI secundária):** Redes, depois Banco de Dados, Eng. de Software/Projetos, Nuvem/Infra e Dados/IA.

| Dia | Bloco 1 | Bloco 2 | Bloco 3 | Total |
|---|---|---|---|---|
| Seg | Teoria B (60) | Teoria T1 (45) | Questões do dia (15) | 120 |
| Ter | Teoria T2 (80) | Questões T2 + revisões vencidas (40) | | 120 |
| Qua | Teoria B (60) | Teoria T1 (45) | Questões do dia (15) | 120 |
| Qui | Teoria T2 (80) | Questões T2 + revisões vencidas (40) | | 120 |
| Sex | Teoria B (60) | Teoria T1 (45) | Questões do dia (15) | 120 |
| Sáb | Caderno de erros (60) | Questões mistas da semana (120) | Recuperação: tópico com pior % (60) | 240 |
| Dom | **Folga** (opcional: 10 min de revisões no app, sem contar nas 14 h) | | | 0 |

**Resumo semanal:** 180 min de teoria básica, 295 min de teoria de TI, 245 min de questões, 60 min de caderno de erros e 60 min de recuperação, total de 840 min.

**Meta de questões por fase** (cerca de 2,5 min por questão):

| Fase | Meses | Questões/semana | Média/dia útil |
|---|---|---|---|
| 1: Base | 1 a 4 | cerca de 100 | 15 |
| 2: Aprofundamento | 5 a 8 | cerca de 150 | 25 |
| 3: Questões e simulados | 9 a 12 | cerca de 250 | 40 |

Na Fase 2, a semana-modelo troca 40 min de teoria por questões. Na Fase 3, a proporção passa a ser cerca de 30% teoria e 70% questões e revisão, e o sábado vira dia de simulado.

## A3. Mês 1 detalhado (14 h)

### Semana 1: fundamentos e diagnóstico

| Dia | Trilha B (60) | Trilha T1 (45) | Trilha T2 (80) |
|---|---|---|---|
| Seg | Português: interpretação de texto | SI: pilares (CID, autenticidade, não repúdio) | |
| Ter | | | Redes: modelos OSI e TCP/IP |
| Qua | Constitucional: princípios fundamentais (arts. 1º a 4º) | SI: ameaça, vulnerabilidade, risco, tipos de controle | |
| Qui | | | Redes: enlace, Ethernet, switches, VLAN |
| Sex | Português: tipologia textual e coesão | SI: política de segurança e classificação da informação | |
| Sáb | **Diagnóstico:** prova antiga de TCE na área de TI (3 h) e correção (1 h) | | |

### Semana 2: criptografia e endereçamento

| Dia | Trilha B (60) | Trilha T1 (45) | Trilha T2 (80) |
|---|---|---|---|
| Seg | Constitucional: direitos e garantias (art. 5º) | SI: criptografia simétrica (AES, 3DES, modos de operação) | |
| Ter | | | Redes: IPv4, sub-redes e CIDR |
| Qua | Português: concordância verbal e nominal | SI: criptografia assimétrica (RSA, ECC, Diffie-Hellman) | |
| Qui | | | Redes: exercícios de sub-redes; IPv6 |
| Sex | Constitucional: Administração Pública (arts. 37 a 41) | SI: hash, HMAC, assinatura digital | |
| Sáb | Caderno de erros, questões mistas e recuperação | | |

### Semana 3: normas e controle externo

| Dia | Trilha B (60) | Trilha T1 (45) | Trilha T2 (80) |
|---|---|---|---|
| Seg | Constitucional: fiscalização (arts. 70 a 75), com lei seca | SI: certificação digital, PKI e ICP-Brasil | |
| Ter | | | Redes: ICMP, ARP e camada de transporte (TCP/UDP, portas) |
| Qua | Controle Externo: conceitos, tipos e competências dos TCs | SI: ISO/IEC 27001:2022 (SGSI, cláusulas 4 a 10) | |
| Qui | | | Redes: camada de aplicação (DNS, DHCP, HTTP/HTTPS, e-mail) |
| Sex | Controle Externo: LC 63/1990, parte 1 | SI: ISO/IEC 27002:2022 (4 temas e 93 controles) | |
| Sáb | Caderno de erros, questões mistas e recuperação | | |

### Semana 4: ataques, defesa e primeiro simulado

| Dia | Trilha B (60) | Trilha T1 (45) | Trilha T2 (80) |
|---|---|---|---|
| Seg | Administrativo: princípios e regime jurídico-administrativo | SI: malware e engenharia social | |
| Ter | | | Redes: firewall, DMZ, proxy, NAT |
| Qua | Português: regência e crase | SI: ataques (DoS/DDoS, MITM, spoofing, sniffing) | |
| Qui | | | Redes: IDS/IPS e VPN (IPSec, SSL/TLS) |
| Sex | Administrativo: poderes administrativos | SI: gestão de riscos (ISO 27005 e ISO 31000) | |
| Sáb | **Simulado 1** (3 h) e correção (1 h). Compare com o diagnóstico da semana 1. | | |

**Fim do mês 1:** cerca de 400 questões resolvidas e linha de base registrada por disciplina.

## A4. Meses 2 a 12

| Mês | Trilha B | Trilha T1 | Trilha T2 | Marcos |
|---|---|---|---|---|
| **Fase 1: Base** | | | | |
| 2 | Administrativo (atos, agentes, improbidade, responsabilidade civil); LC 63/1990 parte 2; Português (pontuação, reescrita, semântica); RLM (proposições, equivalências); Constitucional (organização do Estado) | SI: IAM (MFA, SSO), OAuth 2.0/OIDC/SAML, TLS, OWASP Top 10, desenvolvimento seguro, backup, segurança física | Redes: roteamento (OSPF, BGP), Wi-Fi (WPA2/WPA3), SDN e QoS, DNSSEC, segurança de e-mail (SPF, DKIM, DMARC), monitoramento | 1 simulado |
| 3 | Lei 14.133 completa; Controle Externo (Regimento Interno e Constituição do RJ) | SI: SIEM e SOC, incidentes (ISO 27035, NIST SP 800-61), forense, continuidade (ISO 22301), ISO 27701, DLP e hardening | Banco de Dados: modelo relacional, normalização, SQL (DDL, DML, joins, subconsultas) | 1 simulado + 1ª discursiva |
| 4 | LGPD, LAI, Marco Civil; Constitucional (Poderes); Português (ortografia); RLM (argumentação); controle interno e social; serviços públicos; controle da Administração | Governança: conceitos, COBIT 2019 completo, ISO 31000, ISO 38500 | BD: transações, índices, NoSQL, segurança de BD; Eng. de Software: ciclos de vida, requisitos, UML, testes | 1 simulado + 1 discursiva |
| **Fase 2: Aprofundamento** | | | | |
| 5 | AFO: princípios orçamentários, PPA/LDO/LOA, Lei 4.320; RLM (combinatória); Português (colocação pronominal); jurisprudência do STF sobre TCs | Governança: ITIL 4, PDTI/PETI, BSC, ISO 20000, SISP e Estratégia de Governo Digital | Eng. de Software: arquitetura e APIs, DevOps/CI-CD, DevSecOps; Projetos: PMBOK 7, Scrum | 2 simulados + 2 discursivas |
| 6 | AFO: receita, despesa, LRF; RLM (probabilidade); redação oficial | Auditoria de TI: NBASP/ISSAI, planejamento, evidências e papéis de trabalho, matriz de achados, controles gerais e de aplicação, CAAT | Projetos: Kanban e Lean, portfólio; Infra: Linux, Windows/AD, virtualização, contêineres | 2 simulados + 2 discursivas |
| 7 | Estatística descritiva; Lei do Governo Digital; processo administrativo (Lei 9.784); técnicas de discursiva; créditos adicionais e restos a pagar; revisão de Constitucional | Contratações de TI: Lei 14.133 aplicada, IN SGD 94/2022, fiscalização de contratos, jurisprudência do TCU | Nuvem (modelos e serviços); Dados: DW/OLAP, ETL e qualidade, mineração | 2 simulados + 2 discursivas |
| 8 | Revisão de Administrativo, Controle Externo, Lei 14.133, Português e LGPD | SI: NIST CSF 2.0, CIS Controls v8, Zero Trust, PNCiber e legislação, segurança em nuvem, riscos de IA | Dados: ML (conceitos), Python, IA generativa, big data, BI | **Simulado diagnóstico completo** |
| **Fase 3: Questões e simulados** | | | | |
| 9 | Segunda passada nas disciplinas com menos de 70% de acerto | SI em profundidade (detalhes da 27002, cifras, protocolos) | Redes em profundidade | 1 simulado/semana |
| 10 | Questões da banca provável | Governança, Auditoria e Contratações, com jurisprudência do TCU | Revisão de BD e Eng. de Software | 1 simulado/semana + 1 discursiva/semana |
| 11 | Caderno de erros e lei seca | Caderno de erros | Caderno de erros | 1 simulado/semana + 1 discursiva/semana |
| 12 | Revisão final | Revisão final | Revisão final | Simulados no horário da prova |

**Quando o edital sair:** o app reordena as trilhas para a data da prova (seção B5.2). Nas 2 últimas semanas, faça só revisão e simulados.

## A5. Metas de acerto por fase

| Fase | Meta |
|---|---|
| 1 (meses 1 a 4) | 60% ou mais |
| 2 (meses 5 a 8) | 70% ou mais |
| 3 (meses 9 a 12) | 80% ou mais |

Se uma disciplina ficar abaixo da meta por 2 semanas, ela passa a ocupar o bloco de recuperação de sábado.

---

# Parte B: Design técnico do app

## B1. Decisões principais

| Decisão | Escolha | Alternativas consideradas | Por quê |
|---|---|---|---|
| Tipo de app | **PWA** (site instalável que funciona offline), **projetado para celular** | App nativo (Android/iOS); Anki + planilha | Instala na tela inicial sem loja de apps e sem custo. O Anki não tem cronograma nem simulado. |
| Armazenamento | **IndexedDB no dispositivo**, acessado diretamente | Backend com banco (Supabase/Firebase); biblioteca Dexie.js | Funciona offline, não exige conta nem servidor e não tem custo. O uso é só no celular, então não é preciso sincronizar. |
| Front-end | **JavaScript puro (módulos ES), HTML e CSS, sem dependências e sem build** | React + Vite + Tailwind | O app é publicado como uma pasta de arquivos estáticos que pode ser enviada direto ao Netlify Drop, sem etapa de build. O ambiente de desenvolvimento também não tem acesso ao npm. Os tipos são documentados com JSDoc e verificados com `tsc --checkJs`. |
| Gráficos | SVG gerado à mão | Recharts, Chart.js | Só são necessários gráficos simples de barra e de linha |
| Hospedagem | **Netlify Drop** (envio de um `.zip`, gratuito, com HTTPS) | GitHub Pages (exige conta no GitHub, que o usuário não tem); Cloudflare Pages | O envio é feito pelo navegador, sem precisar de conta. Para que o site não expire, o usuário cria uma conta gratuita no Netlify (e-mail ou Google) e "reivindica" o site. |
| Testes | `node:test` (embutido no Node) com testes de propriedade usando gerador aleatório próprio | Vitest + fast-check | Não exige dependências |

### B1.1 Uso só no celular

O usuário vai estudar apenas no celular, então não há sincronização entre dispositivos. O backup em arquivo (B7) serve para **proteger os dados** (troca ou perda do aparelho, limpeza do navegador) e pode ser compartilhado para o Google Drive ou WhatsApp pelo menu de compartilhamento do celular. O app lembra do backup a cada 7 dias.

### B1.2 Banco de questões e direitos autorais

As questões de Qconcursos e TecConcursos são protegidas e não serão copiadas. O app terá:
1. **Questões autorais** escritas para o app, cobrindo os tópicos do mês 1 (meta inicial de cerca de 150, com cerca de 8 a 10 por tópico). Cada uma traz comentário e referência à fonte primária (artigo de lei, seção de norma, documento do NIST/OWASP/TCU) para que você possa conferir.
2. **Importação** de questões suas (JSON/CSV), por exemplo as que você transcrever de provas antigas para uso pessoal.
3. **Cadastro manual** pelo próprio app.

O app complementa um banco comercial, não o substitui. Para ter volume na Fase 3, continue usando Qconcursos ou TecConcursos e registre no app as que errar.

## B2. Arquitetura

```
┌──────────────────────── Navegador (celular ou PC) ────────────────────────┐
│                                                                            │
│  Interface (React)                                                         │
│  Hoje · Questões · Revisão · Simulados · Cronograma · Desempenho · Ajustes │
│         │                                                                  │
│         ▼                                                                  │
│  Lógica de domínio (TypeScript puro, sem dependência de interface)        │
│  ├─ scheduler.ts   gera o cronograma a partir das trilhas e da semana-modelo│
│  ├─ review.ts      agenda as revisões espaçadas (1 → 7 → 30 dias)           │
│  ├─ scoring.ts     calcula nota (múltipla escolha e certo/errado)          │
│  ├─ stats.ts       percentuais, metas, evolução                            │
│  └─ importer.ts    valida e importa JSON/CSV                               │
│         │                                                                  │
│         ▼                                                                  │
│  Repositório (db.js) ──▶ IndexedDB (dados locais e persistentes)           │
│                                                                            │
│  Service worker (sw.js) ──▶ cache dos arquivos do app (modo offline)       │
└────────────────────────────────────────────────────────────────────────────┘
          ▲  arquivos estáticos (uma vez, depois só atualizações)
          │
     Netlify (site enviado pelo Netlify Drop)
```

A lógica de domínio fica separada da interface, o que permite testá-la sem navegador.

## B3. Modelo de dados

```ts
type Grupo = 'basica' | 'ti';
type Trilha = 'B' | 'T1' | 'T2';
type Formato = 'ME' | 'CE';            // múltipla escolha | certo/errado
type Origem = 'autoral' | 'importada' | 'manual';

interface Disciplina {
  id: string;                           // 'seg-info'
  nome: string;
  grupo: Grupo;
  horasAno: number;                     // tabela A1
  ativa: boolean;                       // Req. 8.1
}

interface Topico {
  id: string;                           // 'seg-info.cripto-simetrica'
  disciplinaId: string;
  nome: string;
  trilha: Trilha;
  ordem: number;                        // posição na trilha
  minutosEstimados: number;             // tempo de teoria
  ativo: boolean;
}

interface Questao {
  id: string;                           // UUID
  topicoId: string;
  formato: Formato;
  enunciado: string;
  alternativas?: string[];              // ME: 4 ou 5; CE: ausente
  gabarito: number | boolean;           // ME: índice; CE: true = Certo
  comentario: string;
  referencia: string;                   // 'CF/88, art. 71, II'
  origem: Origem;
  estilo?: 'FGV' | 'Cebraspe' | 'FCC' | 'IBFC';
  criadaEm: string;                     // ISO 8601
}

interface Tentativa {
  id: string;
  questaoId: string;
  data: string;
  resposta: number | boolean | null;    // null = em branco (simulado)
  correta: boolean;
  tempoMs: number;
  modo: 'treino' | 'revisao' | 'simulado';
  simuladoId?: string;
}

interface ItemRevisao {                 // caderno de erros
  questaoId: string;                    // chave
  caixa: 1 | 2 | 3;                     // 1 = 1 dia, 2 = 7 dias, 3 = 30 dias
  vencimento: string;                   // data (AAAA-MM-DD)
  dominada: boolean;
  tipoErro?: 'nao-sabia' | 'desatencao' | 'chute';
  anotacao?: string;
}

interface Sessao {
  id: string;
  data: string;                         // AAAA-MM-DD
  tipo: 'teoria' | 'questoes' | 'revisao' | 'recuperacao' | 'simulado';
  trilha?: Trilha;
  topicoIds: string[];
  minutosPlanejados: number;
  minutosRealizados?: number;
  concluidaEm?: string;
}

interface Simulado {
  id: string;
  criadoEm: string;
  config: { questoes: number; disciplinaIds: string[]; formato: Formato | 'misto'; tempoMin: number };
  questaoIds: string[];
  finalizadoEm?: string;
  resultado?: ResultadoSimulado;
}

interface Configuracoes {
  inicioPlano: string;                  // data da 1ª segunda-feira
  semanaModelo: SlotSemana[];           // tabela A2, editável (Req. 1.6)
  banca?: 'FGV' | 'Cebraspe' | 'FCC' | 'IBFC' | 'outra';
  dataProva?: string;
  ultimoBackup?: string;
  schemaVersion: number;
}

interface SlotSemana {
  diaSemana: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = domingo
  tipo: Sessao['tipo'];
  trilha?: Trilha;
  minutos: number;
}
```

**Índices no IndexedDB:** `questoes` por `topicoId` e `formato`; `tentativas` por `questaoId` e `data`; `revisao` por `vencimento`; `sessoes` por `data`.

## B4. Telas

| Tela | Conteúdo | Requisitos |
|---|---|---|
| **Hoje** (inicial) | Sessões do dia com botão "concluir", revisões vencidas, questões feitas/meta, horas da semana/14 h, pendências da semana anterior, aviso de backup | 1.3, 1.4, 1.5, 3.5, 5.2, 7.6 |
| **Questões** | Filtros, uma questão por vez; ao confirmar, mostra acerto/erro, gabarito destacado, comentário e referência | 2.1 a 2.6 |
| **Revisão** | Fila de revisões vencidas, classificação do erro, anotação | 3.1 a 3.7 |
| **Simulados** | Montagem, prova com cronômetro (sem correção até o fim), resultado por disciplina e revisão questão a questão | 4.1 a 4.6 |
| **Cronograma** | Visão semanal e mensal, edição da semana-modelo | 1.1, 1.2, 1.6 |
| **Desempenho** | % por disciplina e tópico (com destaque abaixo da meta), horas por semana, evolução dos simulados | 5.1 a 5.5 |
| **Ajustes** | Banca, data da prova, ativar ou desativar disciplinas e tópicos, importar questões, exportar e importar backup | 6.3 a 6.5, 7.5, 8.1 a 8.5 |

Navegação: barra inferior no celular e menu lateral no desktop. Na tela de questões, os botões de resposta têm no mínimo 44 px de altura para uso com o polegar.

## B5. Algoritmos

### B5.1 Geração do cronograma (`scheduler.ts`)

**Entradas:** data de início, semana-modelo, tópicos ativos ordenados por trilha e data da prova (opcional).

1. Para cada semana, a partir da data de início, percorre os slots da semana-modelo.
2. Slot de **teoria** com trilha X: consome minutos do próximo tópico pendente da trilha X. Se o tópico precisa de mais minutos do que o slot tem, ele continua no próximo slot da mesma trilha. Se sobrar tempo no slot, o próximo tópico começa no mesmo slot.
3. Slot de **questões**: usa os tópicos de teoria já vistos na semana (ou na trilha, no caso de ter/qui).
4. Slot de **revisão/recuperação** (sábado): não tem tópico fixo. O tópico de recuperação é escolhido na hora: o de pior % de acerto entre os já estudados, com no mínimo 5 tentativas.
5. A fase de cada semana (1, 2 ou 3) define a proporção teoria/questões (seção A2). Na Fase 3, os slots de teoria viram questões, exceto 30% deles.
6. **Quando as trilhas acabam antes da Fase 3**, os slots de teoria viram questões mais cedo.

O cronograma é **recalculado apenas para datas futuras**. Sessões passadas e concluídas nunca são alteradas (Req. 1.5 e 8.5). Os minutos estimados dos tópicos são calibrados para que o resultado reproduza o mês 1 da seção A3. Esse mês serve de caso de teste.

### B5.2 Ajuste à data da prova

Quando o usuário informa a data da prova:
1. O app calcula `semanasRestantes`.
2. A Fase 3 passa a ocupar as últimas `max(4, 33% de semanasRestantes)` semanas. As 2 últimas são só revisão e simulado.
3. Se os minutos de teoria pendentes não couberem até o início da Fase 3, o app mostra os tópicos que ficariam de fora, ordenados pelo peso da disciplina (tabela A1). O usuário escolhe o que desativar. O app não corta nada sozinho.

### B5.3 Revisão espaçada (`review.ts`)

```
INTERVALO = { 1: 1 dia, 2: 7 dias, 3: 30 dias }

ao errar (em qualquer modo):
  item.caixa = 1; item.vencimento = hoje + 1; item.dominada = false

ao acertar em revisão:
  se item.caixa == 3: item.dominada = true        // sai da fila
  senão: item.caixa += 1; item.vencimento = hoje + INTERVALO[item.caixa]

ao acertar fora da revisão (treino/simulado) uma questão que está na fila:
  nada muda (a revisão só avança quando vence)
```

Exemplo: errou em 01/02, revisa em 02/02 (acertou), em 09/02 (acertou) e em 11/03 (acertou), e a questão é dominada.

### B5.4 Notas (`scoring.ts`)

- **Múltipla escolha:** `acertos / total`.
- **Certo/errado:** `bruto = certas / total` e `liquido = (certas - erradas) / total`. Questões em branco valem 0. A nota líquida pode ser negativa e é mostrada assim.
- **Simulado misto:** as duas notas são calculadas por formato e mostradas separadas, e o resultado também é quebrado por disciplina.

## B6. Importação de questões (`importer.ts`)

**JSON:** uma lista de objetos com os campos de `Questao`, exceto `id`, `origem` e `criadaEm`, que o app preenche. `topicoId` deve existir no app. Também é aceito `disciplina` + `topico` por nome, que o app tenta casar.

```json
[
  {
    "topicoId": "seg-info.cripto-assimetrica",
    "formato": "CE",
    "enunciado": "Na criptografia assimétrica, a confidencialidade é obtida cifrando a mensagem com a chave pública do destinatário.",
    "gabarito": true,
    "comentario": "Só o destinatário possui a chave privada correspondente para decifrar.",
    "referencia": "Stallings, Criptografia e Segurança de Redes, cap. 9"
  }
]
```

**CSV** (separador `;`, UTF-8): `topicoId;formato;enunciado;altA;altB;altC;altD;altE;gabarito;comentario;referencia`. Em questões de certo/errado, as alternativas ficam vazias e o gabarito é `C` ou `E`. Em múltipla escolha, o gabarito vai de `A` a `E`.

**Validação por registro:** campos obrigatórios, formato coerente com as alternativas, gabarito dentro do intervalo e tópico existente. Os registros válidos são importados. Os inválidos aparecem em um relatório com o número da linha e o motivo (Req. 6.4).

O conteúdo importado é exibido apenas como texto, nunca interpretado como HTML, para evitar a execução de scripts embutidos em arquivos.

## B7. Offline, persistência e backup

- **Offline:** o service worker guarda em cache todos os arquivos do app no primeiro acesso. Quando sai uma versão nova, o app avisa: "Nova versão disponível, recarregar".
- **Persistência:** no primeiro uso, o app chama `navigator.storage.persist()` para pedir ao navegador que não apague os dados.
- **Atenção no iPhone:** o Safari pode apagar os dados de sites usados pelo navegador após 7 dias sem acesso. **Instale o app na tela inicial** ("Compartilhar" e depois "Adicionar à Tela de Início") e mantenha o backup em dia. O lembrete de 7 dias (Req. 7.6) existe por isso.
- **Backup:** exporta um arquivo `tce-rj-backup-AAAA-MM-DD.json` com todas as tabelas e o `schemaVersion`. Na importação, o app valida o arquivo, **gera automaticamente um backup dos dados atuais** e só então substitui. Se o `schemaVersion` for mais antigo, o app aplica as migrações.

## B8. Estrutura do projeto

```
estudos-tce-rj/
├─ app/                 pasta publicada (é ela que vai no .zip)
│  ├─ index.html, manifest.webmanifest, sw.js, icons/
│  ├─ css/app.css
│  └─ js/
│     ├─ domain/        dates, scheduler, review, scoring, stats, importer (sem DOM)
│     ├─ data/          curriculum.js (disciplinas, tópicos, trilhas), questoes-*.js (seed)
│     ├─ db.js          IndexedDB e migrações
│     ├─ backup.js
│     ├─ pages/         hoje, questoes, revisao, simulados, cronograma, desempenho, ajustes
│     ├─ ui.js          utilitários de interface
│     └─ main.js        roteamento por hash (#/hoje, #/questoes...)
├─ tests/               node:test para js/domain
└─ scripts/             gerar ícones e empacotar o .zip
```

## B9. Propriedades de corretude

Estas regras serão verificadas com testes automatizados, incluindo testes de propriedade com entradas aleatórias:

1. **Orçamento semanal:** para qualquer semana-modelo válida, a soma dos minutos planejados da semana fica entre 825 e 855 (Req. 1.1).
2. **Histórico imutável:** recalcular o cronograma (nova data de prova, tópicos desativados, semana-modelo editada) não altera nenhuma sessão com data anterior a hoje nem nenhuma sessão concluída (Req. 1.5, 8.5).
3. **Ordem das trilhas:** dentro de cada trilha, os tópicos aparecem no cronograma na ordem definida, e todo tópico ativo aparece pelo menos uma vez antes da Fase 3 (ou é listado como "não coube").
4. **Revisão:** para qualquer sequência de acertos e erros, a caixa fica sempre entre 1 e 3, o vencimento é sempre posterior à data da resposta, e uma questão só é dominada depois de 3 acertos seguidos em revisão (Req. 3.1 a 3.4).
5. **Nota de certo/errado:** `liquido = (certas - erradas) / total`, com `-1 ≤ liquido ≤ bruto ≤ 1` (Req. 4.4).
6. **Gabarito oculto:** nenhuma tela mostra o gabarito de uma questão antes de existir uma tentativa confirmada (treino) ou antes de o simulado terminar (Req. 2.6, 4.2).
7. **Backup ida e volta:** exportar e importar o backup reproduz exatamente os mesmos dados (Req. 7.5).
8. **Importação parcial:** em um arquivo com N registros, dos quais K são inválidos, o app importa N − K questões e lista exatamente os K inválidos (Req. 6.4).
9. **Mês 1 de referência:** com a semana-modelo padrão e a data de início do plano, o cronograma gerado para as semanas 1 a 4 corresponde à seção A3.

## B10. Estratégia de testes

- **Unitários e de propriedade (`node --test`):** todo o diretório `js/domain/`, cobrindo as propriedades 1 a 5, 8 e 9.
- **Navegador (Playwright, em tela de celular):** fluxo de questões (propriedade 6), simulado, backup (propriedade 7) e funcionamento offline.
- **Manual, pelo usuário:** instalação na tela inicial e uso em modo avião.
- **Conteúdo:** cada questão autoral passa por uma checagem da referência. Questões sem referência verificável não entram no seed.

## B11. Riscos

| Risco | Mitigação |
|---|---|
| Erro de conteúdo em questão autoral | Toda questão tem referência para conferência. O usuário pode editar ou excluir qualquer questão. |
| Perda de dados no celular | PWA instalado, `storage.persist()`, lembrete de backup e backup automático antes de importar |
| Banco inicial pequeno para a Fase 3 | Importação, cadastro manual e uso paralelo de um banco comercial |
| Edital muda o conteúdo | Ativação e desativação de tópicos e recálculo para a data da prova (Req. 8) |

## B12. Decisões do usuário (22/11/2026)

1. **Hospedagem:** sem conta no GitHub, então o app será publicado pelo Netlify Drop (B1).
2. **Dispositivo:** somente celular, sem sincronização (B1.1).
3. **Semana-modelo:** sábado com 4 h e folga no domingo, como na seção A2.
4. **Início do plano:** segunda-feira, 23/11/2026.

## B13. Calendário do plano

- O plano tem **48 semanas** (12 meses de 4 semanas). O mês do plano é `floor(semana / 4) + 1`. As semanas restantes do ano ficam de folga para imprevistos (seção A1).
- **Fases:** semanas 1 a 16 são a Fase 1, 17 a 32 a Fase 2 e 33 a 48 a Fase 3. Depois da semana 48, sem data de prova, o app continua em Fase 3.
- **Transformação da semana-modelo por fase:** cada slot de teoria é multiplicado por um fator e arredondado para múltiplos de 5 min. Os minutos retirados vão para o slot de questões do mesmo dia, de modo que o total da semana não muda.

| Fase | Fator | Slot de 60 | Slot de 45 | Slot de 80 |
|---|---|---|---|---|
| 1 | 1,0 | 60 | 45 | 80 |
| 2 | 0,85 | 50 | 40 | 70 |
| 3 | 0,5 | 30 | 25 | 40 |

- **Sábado de simulado:** o dia de maior carga vira simulado (180 min) mais correção e caderno de erros (60 min). Isso acontece na semana 1 (diagnóstico), na última semana de cada mês da Fase 1, nas semanas 2 e 4 de cada mês da Fase 2 e em todas as semanas da Fase 3.
- **Últimas 2 semanas antes da prova:** só questões, revisão e simulado, sem teoria.
- **Trilhas:** os minutos estimados dos tópicos (`curriculum.js`) foram calibrados para que as trilhas terminem exatamente no fim do mês 8 com a semana-modelo padrão. Na Fase 3, como não há tópico novo, os slots de teoria viram questões.
