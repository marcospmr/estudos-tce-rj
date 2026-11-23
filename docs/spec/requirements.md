# Requisitos: App de Estudos TCE-RJ (Auditor de Controle Externo, TI)

## Introdução

App pessoal de estudos para o concurso TCE-RJ (Auditor de Controle Externo, área de TI/Segurança da Informação). O app reúne quatro coisas: o plano de estudos estruturado para **14 horas semanais**, a resolução de questões com correção imediata, o caderno de erros com revisão espaçada e os simulados cronometrados. O app deve funcionar no celular e no computador, inclusive sem internet.

Base de conteúdo: `plano-estudos-tce-rj-ti.md`, ajustado de cerca de 22 h para 14 h por semana.

**Restrições:**
- A banca ainda não foi definida. O app precisa suportar os dois formatos de questão: múltipla escolha (FGV/FCC/IBFC) e certo/errado (Cebraspe).
- Questões de bancos comerciais (Qconcursos, TecConcursos) não podem ser copiadas para o app. O app vem com questões autorais e permite importar as questões do próprio usuário.
- Uso individual, sem custo de hospedagem.

## Glossário

- **Disciplina:** matéria do edital (ex.: Segurança da Informação).
- **Tópico:** assunto dentro de uma disciplina (ex.: Criptografia assimétrica).
- **Cronograma:** distribuição semanal das sessões de estudo ao longo dos 12 meses.
- **Sessão:** bloco de estudo planejado com disciplina, tópico, duração e tipo (teoria, questões, revisão ou simulado).
- **Caderno de erros:** conjunto das questões erradas, que voltam para revisão.
- **Revisão espaçada:** reapresentação de um item em intervalos crescentes (1, 7 e 30 dias).
- **Simulado:** prova cronometrada com questões de várias disciplinas.

---

## Requisito 1: Cronograma de 14 h semanais

**História:** Como candidato, quero um cronograma que caiba nas minhas 14 horas semanais, para saber o que estudar em cada dia sem precisar planejar.

**Critérios de aceitação:**
1. O app DEVE gerar um cronograma de 12 meses em que a soma das sessões de cada semana seja 14 h (840 min), com tolerância de ±15 min.
2. O app DEVE distribuir as horas entre as disciplinas conforme os pesos definidos no design (cerca de 60% TI e 40% básicas).
3. QUANDO o usuário abrir o app, o app DEVE mostrar as sessões do dia atual.
4. QUANDO o usuário marcar uma sessão como concluída, o app DEVE registrar a data e os minutos realizados.
5. SE o usuário não concluir uma sessão até o fim da semana, ENTÃO o app DEVE mostrá-la como pendente na semana seguinte. O cronograma futuro não deve ser alterado automaticamente.
6. O app DEVE permitir que o usuário altere a distribuição dos dias (por exemplo, trocar o dia de folga) mantendo o total de 14 h.

## Requisito 2: Resolução de questões com correção imediata

**História:** Como candidato, quero responder questões e saber na hora se acertei, com o comentário, para aprender com cada questão.

**Critérios de aceitação:**
1. O app DEVE suportar questões de múltipla escolha (de 4 a 5 alternativas) e de certo/errado.
2. QUANDO o usuário confirmar uma resposta, o app DEVE indicar acerto ou erro, destacar a alternativa correta e mostrar o comentário e a referência (lei, artigo ou norma).
3. O app DEVE permitir filtrar as questões por disciplina, tópico, formato, origem (autoral ou importada) e status (nunca respondida, errada, acertada).
4. O app DEVE registrar cada tentativa com data, resposta, resultado e tempo gasto.
5. QUANDO o usuário errar uma questão, o app DEVE incluí-la no caderno de erros.
6. O app NÃO DEVE mostrar o gabarito antes de o usuário confirmar a resposta.

## Requisito 3: Caderno de erros e revisão espaçada

**História:** Como candidato, quero que as questões que errei voltem nos momentos certos, para fixar o conteúdo.

**Critérios de aceitação:**
1. Uma questão errada DEVE ser agendada para revisão em 1 dia.
2. QUANDO o usuário acertar uma questão em revisão, o app DEVE avançá-la para o próximo intervalo: 1 dia, depois 7 dias, depois 30 dias.
3. QUANDO o usuário acertar a questão no intervalo de 30 dias, o app DEVE marcá-la como dominada e retirá-la da fila de revisão.
4. QUANDO o usuário errar uma questão em revisão, o app DEVE voltá-la ao intervalo de 1 dia.
5. A tela inicial DEVE mostrar quantas revisões vencem no dia.
6. O usuário DEVE poder escrever uma anotação pessoal em cada questão (por exemplo, o motivo do erro).
7. O usuário DEVE poder classificar o erro como "não sabia", "desatenção" ou "chute".

## Requisito 4: Simulados

**História:** Como candidato, quero fazer simulados cronometrados no formato da prova, para treinar tempo e acompanhar minha evolução.

**Critérios de aceitação:**
1. O usuário DEVE poder montar um simulado escolhendo o número de questões, as disciplinas, o formato e o tempo limite.
2. Durante o simulado, o app NÃO DEVE mostrar a correção das questões até que o simulado termine.
3. QUANDO o tempo acabar, o app DEVE encerrar o simulado e corrigi-lo automaticamente.
4. Para questões de certo/errado, o app DEVE calcular a nota líquida (certas menos erradas, com questões em branco valendo zero), além do percentual bruto.
5. Ao final, o app DEVE mostrar a nota geral, a nota por disciplina e a revisão de cada questão com o comentário.
6. As questões erradas no simulado DEVEM entrar no caderno de erros.

## Requisito 5: Painel de desempenho

**História:** Como candidato, quero ver minha evolução, para saber onde concentrar o estudo.

**Critérios de aceitação:**
1. O app DEVE mostrar o percentual de acerto por disciplina e por tópico.
2. O app DEVE mostrar as horas estudadas na semana em relação à meta de 14 h.
3. O app DEVE mostrar a evolução das notas dos simulados ao longo do tempo.
4. O app DEVE destacar as disciplinas abaixo da meta de acerto da fase atual (60% até o mês 4, 70% até o mês 8, 80% depois).
5. O app DEVE mostrar a quantidade de questões resolvidas por dia em relação à meta da fase.

## Requisito 6: Banco de questões e importação

**História:** Como candidato, quero começar com questões prontas e poder adicionar as minhas, para ter volume de treino.

**Critérios de aceitação:**
1. O app DEVE vir com um banco inicial de questões autorais cobrindo os tópicos do mês 1.
2. Toda questão autoral DEVE ter um comentário e uma referência verificável (lei e artigo, norma e seção ou documento oficial).
3. O usuário DEVE poder importar questões de um arquivo JSON ou CSV no formato documentado.
4. SE o arquivo importado tiver erros de formato, ENTÃO o app DEVE listar as linhas com erro e importar apenas as válidas.
5. O usuário DEVE poder cadastrar, editar e excluir questões pelo próprio app.

## Requisito 7: Acesso em qualquer lugar e funcionamento offline

**História:** Como candidato, quero estudar no celular e no computador, inclusive sem internet, para aproveitar qualquer tempo livre.

**Critérios de aceitação:**
1. O app DEVE funcionar em navegadores móveis e de desktop atuais (Chrome, Safari, Edge, Firefox), com layout adaptado a telas a partir de 360 px.
2. O app DEVE poder ser instalado na tela inicial do celular (PWA).
3. Depois do primeiro acesso, o app DEVE funcionar sem internet.
4. Os dados do usuário DEVEM ficar salvos no próprio dispositivo e não podem se perder ao fechar o navegador.
5. O usuário DEVE poder exportar todos os dados para um arquivo de backup e importá-lo em outro dispositivo.
6. O app DEVE lembrar o usuário de fazer backup se o último tiver mais de 7 dias.

## Requisito 8: Adaptação ao edital

**História:** Como candidato, quero ajustar o plano quando o edital sair, para focar no que vai cair.

**Critérios de aceitação:**
1. O usuário DEVE poder ativar ou desativar disciplinas e tópicos.
2. O usuário DEVE poder informar a banca e a data da prova.
3. QUANDO a data da prova for informada, o app DEVE recalcular as semanas restantes e mostrar a contagem regressiva.
4. QUANDO a banca for informada, o app DEVE priorizar o formato de questão correspondente nos filtros padrão e nos simulados (certo/errado para Cebraspe, múltipla escolha para as demais).
5. Ao recalcular o cronograma, o app NÃO DEVE apagar o histórico de sessões, tentativas ou revisões.
