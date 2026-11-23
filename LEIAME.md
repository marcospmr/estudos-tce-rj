# Estudos TCE-RJ: app de estudos (PWA)

App para celular com o plano de 14 h semanais, questões com correção na hora, caderno de erros com revisão espaçada (1, 7 e 30 dias), simulados cronometrados e painel de desempenho. Funciona sem internet depois do primeiro acesso. Os dados ficam só no celular.

Requisitos e design: `../.kiro/specs/estudos-tce-rj/`.

## 1. Publicar (uma vez, grátis)

O arquivo `estudos-tce-rj.zip` contém o app pronto.

1. Baixe `estudos-tce-rj.zip` para o celular ou computador.
2. Abra **https://app.netlify.com/drop** no navegador.
3. Toque em "browse to upload" (ou arraste o arquivo) e escolha o `.zip`. Em alguns segundos aparece um endereço `https://algum-nome.netlify.app`.
4. **Reivindique o site:** o Netlify oferece criar uma conta gratuita (e-mail ou Google) para manter o site. Sem isso, o site enviado de forma anônima expira.
5. Opcional: no painel do Netlify, troque o nome do site em *Site configuration → Change site name* (ex.: `meu-tce-rj.netlify.app`).

## 2. Instalar no celular

- **Android (Chrome):** abra o endereço, toque no menu de três pontos e depois em "Instalar app" (ou "Adicionar à tela inicial").
- **iPhone (Safari):** abra o endereço, toque em Compartilhar e depois em "Adicionar à Tela de Início".

Use sempre pelo ícone instalado. No iPhone isso é importante: o Safari pode apagar dados de sites abertos só pelo navegador depois de 7 dias sem uso.

## 3. Uso diário

- **Hoje:** mostra as sessões do dia. Toque em "Concluir" ao terminar e informe os minutos estudados. Os atalhos levam às questões dos tópicos da sessão.
- **Questões:** depois de confirmar a resposta, o app mostra o gabarito, o comentário e a fonte. Cada erro entra no caderno, e você pode marcar o tipo de erro e escrever uma anotação.
- **Revisão:** reúne as questões que vencem no dia. Errou: a questão volta amanhã. Acertou: volta em 7 dias, depois em 30 dias, e então sai do caderno.
- **Simulados:** a correção só aparece no final. Para certo/errado, o app mostra também a nota líquida (certas menos erradas).
- **Mais:** dá acesso ao Cronograma (com troca de dias da semana-modelo), ao Desempenho e aos Ajustes.

## 4. Backup

Vá em **Mais → Ajustes → Backup → Salvar backup** e guarde o arquivo no Google Drive, no e-mail ou no WhatsApp. O app lembra você se o último backup tiver mais de 7 dias. Para restaurar (por exemplo, em um celular novo), use "Restaurar backup". Antes de substituir os dados, o app salva um backup dos dados atuais.

## 5. Quando o edital sair

Em **Ajustes → Edital e prova**, informe a banca e a data. O app recalcula as semanas futuras sem apagar o histórico:
- a Fase 3 passa a ocupar a reta final;
- as 2 últimas semanas ficam só com questões e simulados;
- o formato de questão padrão segue a banca (certo/errado para o Cebraspe).

Se algum tópico não couber até a prova, o Cronograma mostra a lista. Em **Conteúdo do edital**, desmarque o que não cai.

## 6. Adicionar questões

O app vem com 160 questões autorais, cada uma com fonte, cobrindo todos os tópicos do mês 1. Para ter volume, continue usando um banco comercial (Qconcursos, TecConcursos). Você pode cadastrar as suas questões em **Ajustes → Questões**, uma a uma ("Nova questão") ou por arquivo CSV/JSON ("Importar arquivo"). O formato do arquivo e os códigos dos tópicos estão descritos na própria tela.

## 7. Desenvolvimento

Não há dependências nem etapa de build.

```bash
npm test             # testes de domínio (node --test)
npm run icons        # gera os ícones PNG
npm run zip          # gera o service worker e o estudos-tce-rj.zip
npm run serve        # servidor local em http://localhost:8080
```

`tests/e2e/fluxo.js` é o roteiro ponta a ponta (Playwright, tela de 390×844) usado para validar questões, caderno, simulado com recarga, backup e data da prova.

Para atualizar o app publicado: gere o `.zip` de novo e, no painel do site no Netlify, use *Deploys → Deploy manually* com o novo arquivo. O app no celular mostra "Nova versão disponível".
