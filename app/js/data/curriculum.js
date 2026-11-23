// Disciplinas, tópicos e trilhas do plano (design.md, seções A1, A3, A4 e B13).
// Os minutos de cada trilha foram calibrados para terminar no fim do mês 8 com a semana-modelo padrão:
//   Trilha B : 4 meses × 720 + 4 meses × 600 = 5280 min
//   Trilha T1: 4 meses × 540 + 4 meses × 480 = 4080 min
//   Trilha T2: 4 meses × 640 + 4 meses × 560 = 4800 min

/** @typedef {{id:string, nome:string, grupo:'basica'|'ti', horasAno:number}} Disciplina */
/** @typedef {{id:string, disciplinaId:string, nome:string, trilha:'B'|'T1'|'T2', ordem:number, minutos:number, mes:number}} Topico */

/** @type {Disciplina[]} */
export const DISCIPLINAS = [
  { id: 'si', nome: 'Segurança da Informação', grupo: 'ti', horasAno: 110 },
  { id: 'redes', nome: 'Redes de Computadores', grupo: 'ti', horasAno: 60 },
  { id: 'gov', nome: 'Governança de TI', grupo: 'ti', horasAno: 50 },
  { id: 'aud', nome: 'Auditoria de TI', grupo: 'ti', horasAno: 45 },
  { id: 'ctr', nome: 'Contratações de TI', grupo: 'ti', horasAno: 30 },
  { id: 'bd', nome: 'Banco de Dados', grupo: 'ti', horasAno: 30 },
  { id: 'eng', nome: 'Eng. de Software e Projetos', grupo: 'ti', horasAno: 35 },
  { id: 'infra', nome: 'Nuvem, Infra e Dados/IA', grupo: 'ti', horasAno: 40 },
  { id: 'port', nome: 'Língua Portuguesa', grupo: 'basica', horasAno: 60 },
  { id: 'adm', nome: 'Direito Administrativo', grupo: 'basica', horasAno: 60 },
  { id: 'const', nome: 'Direito Constitucional', grupo: 'basica', horasAno: 45 },
  { id: 'ce', nome: 'Controle Externo', grupo: 'basica', horasAno: 45 },
  { id: 'afo', nome: 'AFO / Direito Financeiro', grupo: 'basica', horasAno: 30 },
  { id: 'rlm', nome: 'Raciocínio Lógico e Estatística', grupo: 'basica', horasAno: 20 },
  { id: 'leg', nome: 'Legislação (LGPD, LAI etc.)', grupo: 'basica', horasAno: 15 },
];

// [id, nome, minutos, mês previsto]
const TRILHA_B = [
  // Mês 1 (12 × 60)
  ['port.interpretacao', 'Português: interpretação de texto', 60, 1],
  ['const.principios', 'Constitucional: princípios fundamentais (arts. 1º a 4º)', 60, 1],
  ['port.coesao', 'Português: tipologia textual e coesão', 60, 1],
  ['const.direitos', 'Constitucional: direitos e garantias (art. 5º)', 60, 1],
  ['port.concordancia', 'Português: concordância verbal e nominal', 60, 1],
  ['const.adm-publica', 'Constitucional: Administração Pública (arts. 37 a 41)', 60, 1],
  ['const.fiscalizacao', 'Constitucional: fiscalização (arts. 70 a 75)', 60, 1],
  ['ce.conceitos', 'Controle Externo: conceitos, tipos e competências', 60, 1],
  ['ce.lc63-1', 'Controle Externo: LC 63/1990 (parte 1)', 60, 1],
  ['adm.principios', 'Administrativo: princípios e regime jurídico', 60, 1],
  ['port.regencia-crase', 'Português: regência e crase', 60, 1],
  ['adm.poderes', 'Administrativo: poderes administrativos', 60, 1],
  // Mês 2 (720)
  ['adm.atos', 'Administrativo: atos administrativos', 120, 2],
  ['ce.lc63-2', 'Controle Externo: LC 63/1990 (parte 2)', 60, 2],
  ['port.pontuacao', 'Português: pontuação', 60, 2],
  ['adm.agentes', 'Administrativo: agentes públicos', 60, 2],
  ['rlm.proposicoes', 'RLM: proposições e conectivos', 60, 2],
  ['port.reescrita', 'Português: reescrita de frases', 60, 2],
  ['adm.improbidade', 'Administrativo: improbidade (Lei 8.429/92)', 60, 2],
  ['rlm.equivalencias', 'RLM: equivalências e negações', 60, 2],
  ['const.organizacao-estado', 'Constitucional: organização do Estado', 60, 2],
  ['adm.responsabilidade', 'Administrativo: responsabilidade civil do Estado', 60, 2],
  ['port.semantica', 'Português: semântica e vocabulário', 60, 2],
  // Mês 3 (720)
  ['adm.lic-principios', 'Lei 14.133: princípios, agentes e definições', 60, 3],
  ['adm.lic-planejamento', 'Lei 14.133: fase preparatória, ETP e TR', 120, 3],
  ['adm.lic-modalidades', 'Lei 14.133: modalidades e critérios de julgamento', 120, 3],
  ['adm.lic-contratacao-direta', 'Lei 14.133: dispensa e inexigibilidade', 60, 3],
  ['adm.lic-contratos', 'Lei 14.133: contratos administrativos', 120, 3],
  ['adm.lic-sancoes', 'Lei 14.133: sanções e controle', 60, 3],
  ['ce.regimento', 'Controle Externo: Regimento Interno do TCE-RJ', 120, 3],
  ['ce.constituicao-rj', 'Controle Externo: Constituição do Estado do RJ', 60, 3],
  // Mês 4 (720)
  ['leg.lgpd', 'LGPD (Lei 13.709/2018)', 180, 4],
  ['leg.lai', 'Lei de Acesso à Informação (Lei 12.527/2011)', 60, 4],
  ['leg.marco-civil', 'Marco Civil da Internet (Lei 12.965/2014)', 60, 4],
  ['const.poderes', 'Constitucional: Poderes Legislativo, Executivo e Judiciário', 120, 4],
  ['port.ortografia', 'Português: ortografia e acentuação', 60, 4],
  ['rlm.argumentacao', 'RLM: lógica de argumentação', 60, 4],
  ['ce.controle-interno-social', 'Controle Externo: controle interno e social', 60, 4],
  ['adm.servicos-publicos', 'Administrativo: serviços públicos', 60, 4],
  ['adm.controle', 'Administrativo: controle da Administração', 60, 4],
  // Mês 5 (600)
  ['afo.principios', 'AFO: princípios orçamentários', 120, 5],
  ['afo.ciclo', 'AFO: PPA, LDO, LOA e ciclo orçamentário', 120, 5],
  ['afo.lei4320', 'AFO: Lei 4.320/1964', 120, 5],
  ['port.colocacao', 'Português: colocação pronominal', 60, 5],
  ['rlm.combinatoria', 'RLM: análise combinatória', 120, 5],
  ['ce.jurisprudencia', 'Controle Externo: jurisprudência do STF sobre TCs', 60, 5],
  // Mês 6 (600)
  ['afo.receita', 'AFO: receita pública', 120, 6],
  ['afo.despesa', 'AFO: despesa pública', 120, 6],
  ['afo.lrf', 'AFO: Lei de Responsabilidade Fiscal (LC 101/2000)', 180, 6],
  ['rlm.probabilidade', 'RLM: probabilidade', 120, 6],
  ['port.redacao-oficial', 'Português: redação oficial', 60, 6],
  // Mês 7 (600)
  ['rlm.estatistica', 'Estatística descritiva', 120, 7],
  ['leg.governo-digital', 'Lei do Governo Digital (Lei 14.129/2021)', 60, 7],
  ['adm.processo', 'Administrativo: processo administrativo (Lei 9.784/99)', 120, 7],
  ['port.discursiva', 'Português: técnicas de discursiva', 60, 7],
  ['afo.creditos', 'AFO: créditos adicionais e restos a pagar', 120, 7],
  ['const.revisao', 'Constitucional: revisão geral', 120, 7],
  // Mês 8 (600)
  ['adm.revisao', 'Administrativo: revisão geral', 180, 8],
  ['ce.revisao', 'Controle Externo: revisão geral', 120, 8],
  ['adm.lic-revisao', 'Lei 14.133: revisão geral', 120, 8],
  ['port.revisao', 'Português: revisão geral', 60, 8],
  ['leg.revisao', 'LGPD e legislação: revisão geral', 120, 8],
];

const TRILHA_T1 = [
  // Mês 1 (12 × 45)
  ['si.pilares', 'SI: pilares (CID, autenticidade, não repúdio)', 45, 1],
  ['si.ameaca-risco', 'SI: ameaça, vulnerabilidade, risco e tipos de controle', 45, 1],
  ['si.politica', 'SI: política de segurança e classificação da informação', 45, 1],
  ['si.cripto-simetrica', 'SI: criptografia simétrica', 45, 1],
  ['si.cripto-assimetrica', 'SI: criptografia assimétrica', 45, 1],
  ['si.hash-assinatura', 'SI: hash, HMAC e assinatura digital', 45, 1],
  ['si.pki', 'SI: certificação digital, PKI e ICP-Brasil', 45, 1],
  ['si.iso27001', 'SI: ISO/IEC 27001:2022', 45, 1],
  ['si.iso27002', 'SI: ISO/IEC 27002:2022', 45, 1],
  ['si.malware', 'SI: malware e engenharia social', 45, 1],
  ['si.ataques', 'SI: ataques (DoS/DDoS, MITM, spoofing, sniffing)', 45, 1],
  ['si.riscos', 'SI: gestão de riscos (ISO 27005 e ISO 31000)', 45, 1],
  // Mês 2 (540)
  ['si.iam', 'SI: IAM, MFA e SSO', 90, 2],
  ['si.oauth-saml', 'SI: OAuth 2.0, OpenID Connect e SAML', 90, 2],
  ['si.tls', 'SI: TLS e HTTPS', 90, 2],
  ['si.owasp', 'SI: OWASP Top 10', 135, 2],
  ['si.dev-seguro', 'SI: desenvolvimento seguro (SAST, DAST)', 45, 2],
  ['si.backup', 'SI: backup e recuperação', 45, 2],
  ['si.fisica', 'SI: segurança física e do ambiente', 45, 2],
  // Mês 3 (540)
  ['si.siem-soc', 'SI: SIEM e SOC', 90, 3],
  ['si.incidentes', 'SI: gestão de incidentes (ISO 27035, NIST SP 800-61)', 135, 3],
  ['si.forense', 'SI: forense computacional', 90, 3],
  ['si.continuidade', 'SI: continuidade de negócios (ISO 22301)', 90, 3],
  ['si.iso27701', 'SI: ISO/IEC 27701 (privacidade)', 45, 3],
  ['si.dlp-hardening', 'SI: DLP e hardening', 90, 3],
  // Mês 4 (540)
  ['gov.conceitos', 'Governança: conceitos de governança e gestão de TI', 45, 4],
  ['gov.cobit-principios', 'COBIT 2019: princípios e sistema de governança', 90, 4],
  ['gov.cobit-objetivos', 'COBIT 2019: objetivos de governança e gestão', 135, 4],
  ['gov.cobit-design', 'COBIT 2019: fatores de design e capacidade', 90, 4],
  ['gov.cobit-implementacao', 'COBIT 2019: implementação', 45, 4],
  ['gov.iso31000', 'Governança: ISO 31000 aplicada', 90, 4],
  ['gov.iso38500', 'Governança: ISO/IEC 38500', 45, 4],
  // Mês 5 (480)
  ['gov.itil-conceitos', 'ITIL 4: conceitos, SVS e cadeia de valor', 120, 5],
  ['gov.itil-praticas', 'ITIL 4: práticas de gerenciamento', 160, 5],
  ['gov.pdti', 'Governança: PDTI e PETI', 80, 5],
  ['gov.bsc', 'Governança: Balanced Scorecard', 40, 5],
  ['gov.iso20000', 'Governança: ISO/IEC 20000', 40, 5],
  ['gov.sisp-egd', 'Governança: SISP e Estratégia de Governo Digital', 40, 5],
  // Mês 6 (480)
  ['aud.normas', 'Auditoria: NBASP e ISSAI', 120, 6],
  ['aud.planejamento', 'Auditoria: planejamento', 80, 6],
  ['aud.evidencias', 'Auditoria: evidências e papéis de trabalho', 80, 6],
  ['aud.achados', 'Auditoria: matriz de achados e relatório', 80, 6],
  ['aud.controles', 'Auditoria de TI: controles gerais e de aplicação', 80, 6],
  ['aud.caat', 'Auditoria de TI: CAAT e análise de dados', 40, 6],
  // Mês 7 (480)
  ['ctr.lei14133-ti', 'Contratações: Lei 14.133 aplicada a TI', 80, 7],
  ['ctr.in94-planejamento', 'Contratações: IN SGD 94/2022 (planejamento)', 120, 7],
  ['ctr.in94-gestao', 'Contratações: IN SGD 94/2022 (seleção e gestão)', 120, 7],
  ['ctr.fiscalizacao', 'Contratações: fiscalização de contratos de TI', 80, 7],
  ['ctr.jurisprudencia', 'Contratações: jurisprudência do TCU em TI', 80, 7],
  // Mês 8 (480)
  ['si.nist-csf', 'SI: NIST Cybersecurity Framework 2.0', 120, 8],
  ['si.cis', 'SI: CIS Controls v8', 80, 8],
  ['si.zero-trust', 'SI: Zero Trust', 80, 8],
  ['si.pnciber', 'SI: PNCiber e legislação de cibersegurança', 80, 8],
  ['si.nuvem', 'SI: segurança em nuvem', 80, 8],
  ['si.ia', 'SI: riscos de IA', 40, 8],
];

const TRILHA_T2 = [
  // Mês 1 (8 × 80)
  ['redes.osi', 'Redes: modelos OSI e TCP/IP', 80, 1],
  ['redes.enlace', 'Redes: enlace, Ethernet, switches e VLAN', 80, 1],
  ['redes.ipv4', 'Redes: IPv4, sub-redes e CIDR', 80, 1],
  ['redes.subnet-ipv6', 'Redes: exercícios de sub-redes e IPv6', 80, 1],
  ['redes.transporte', 'Redes: ICMP, ARP e camada de transporte', 80, 1],
  ['redes.aplicacao', 'Redes: camada de aplicação (DNS, DHCP, HTTP, e-mail)', 80, 1],
  ['redes.firewall', 'Redes: firewall, DMZ, proxy e NAT', 80, 1],
  ['redes.ids-vpn', 'Redes: IDS/IPS e VPN', 80, 1],
  // Mês 2 (640)
  ['redes.roteamento', 'Redes: roteamento (OSPF, BGP)', 160, 2],
  ['redes.wifi', 'Redes: Wi-Fi e WPA2/WPA3', 80, 2],
  ['redes.sdn-qos', 'Redes: SDN e QoS', 80, 2],
  ['redes.dnssec', 'Redes: segurança de DNS (DNSSEC)', 80, 2],
  ['redes.email', 'Redes: segurança de e-mail (SPF, DKIM, DMARC)', 80, 2],
  ['redes.monitoramento', 'Redes: monitoramento (SNMP, NetFlow)', 80, 2],
  ['redes.revisao', 'Redes: revisão', 80, 2],
  // Mês 3 (640)
  ['bd.relacional', 'BD: modelo relacional e modelagem ER', 160, 3],
  ['bd.normalizacao', 'BD: normalização', 80, 3],
  ['bd.sql-ddl-dml', 'BD: SQL (DDL e DML)', 160, 3],
  ['bd.sql-joins', 'BD: SQL (joins, subconsultas, agregação)', 160, 3],
  ['bd.sql-exercicios', 'BD: exercícios de SQL', 80, 3],
  // Mês 4 (640)
  ['bd.transacoes', 'BD: transações e ACID', 80, 4],
  ['bd.indices', 'BD: índices e otimização', 80, 4],
  ['bd.nosql', 'BD: NoSQL', 80, 4],
  ['bd.seguranca', 'BD: segurança de banco de dados', 80, 4],
  ['eng.ciclos', 'Eng. Software: ciclos de vida e processos', 80, 4],
  ['eng.requisitos', 'Eng. Software: requisitos', 80, 4],
  ['eng.uml', 'Eng. Software: UML', 80, 4],
  ['eng.testes', 'Eng. Software: testes', 80, 4],
  // Mês 5 (560)
  ['eng.arquitetura', 'Eng. Software: arquitetura, microsserviços e APIs REST', 140, 5],
  ['eng.devops', 'Eng. Software: DevOps e CI/CD', 140, 5],
  ['eng.devsecops', 'Eng. Software: DevSecOps', 70, 5],
  ['eng.pmbok', 'Projetos: PMBOK 7ª edição', 140, 5],
  ['eng.scrum', 'Projetos: Scrum', 70, 5],
  // Mês 6 (560)
  ['eng.kanban', 'Projetos: Kanban e Lean', 70, 6],
  ['eng.portfolio', 'Projetos: gestão de portfólio', 70, 6],
  ['infra.linux', 'Infra: Linux', 140, 6],
  ['infra.windows-ad', 'Infra: Windows Server e Active Directory', 70, 6],
  ['infra.virtualizacao', 'Infra: virtualização', 70, 6],
  ['infra.conteineres', 'Infra: contêineres (Docker, Kubernetes)', 140, 6],
  // Mês 7 (560)
  ['infra.nuvem', 'Nuvem: modelos de serviço e implantação', 140, 7],
  ['infra.nuvem-servicos', 'Nuvem: serviços e responsabilidade compartilhada', 70, 7],
  ['infra.dw', 'Dados: data warehouse e OLAP', 140, 7],
  ['infra.etl', 'Dados: ETL e qualidade de dados', 70, 7],
  ['infra.mineracao', 'Dados: mineração de dados', 140, 7],
  // Mês 8 (560)
  ['infra.ml', 'Dados: aprendizado de máquina (conceitos)', 140, 8],
  ['infra.python', 'Dados: Python para análise de dados', 140, 8],
  ['infra.ia-generativa', 'Dados: IA generativa', 70, 8],
  ['infra.big-data', 'Dados: big data', 70, 8],
  ['infra.bi', 'Dados: BI e visualização', 70, 8],
  ['redes.revisao-final', 'Redes: revisão final', 70, 8],
];

function montar(trilha, lista) {
  return lista.map(([id, nome, minutos, mes], ordem) => ({
    id,
    disciplinaId: id.split('.')[0],
    nome,
    trilha,
    ordem,
    minutos,
    mes,
  }));
}

/** @type {Topico[]} */
export const TOPICOS = [
  ...montar('B', TRILHA_B),
  ...montar('T1', TRILHA_T1),
  ...montar('T2', TRILHA_T2),
];

export const TRILHAS = {
  B: 'Básicas',
  T1: 'TI principal',
  T2: 'TI secundária',
};

export const INICIO_PADRAO = '2026-11-23';
