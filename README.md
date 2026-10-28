# Som em Camadas

Website educativo em português europeu, desenvolvido para a tarefa de Português de ASIR descrita em `mail.pdf`. HTML, CSS e JavaScript, sem dependências ou serviços externos necessários para funcionar.

## Abrir

Abre `dist/index.html` no navegador. Funciona também sem ligação à Internet. Clica em reproduzir para autorizar o áudio.

Se preferires servir a página por HTTP, executa na pasta deste projeto:

```sh
python3 -m http.server 8000 --directory dist
```

Depois abre `http://localhost:8000`.

## O que está implementado

- Quatro faixas independentes, com início agendado no mesmo instante do relógio Web Audio.
- Reproduzir, pausar, continuar e reiniciar o conjunto.
- Ativar ou silenciar cada instrumento sem alterar a sua posição musical.
- Volume individual, escuta a solo, reposição da mistura e repetição opcional.
- Linha do tempo comum com avanço e recuo.
- Importação das quatro faixas de uma só vez ou substituição individual.
- Reconhecimento dos nomes dos instrumentos, ilustrações adaptadas e nomes editáveis.
- Importação sem alterações parciais: se um ficheiro não puder ser lido, a mistura anterior é mantida.
- Ilustrações vetoriais originais, apresentação adaptável a telemóvel e animações que respeitam a preferência por movimento reduzido.
- Controlos com etiquetas acessíveis, navegação por teclado e mensagens de estado.
- Espaço para reproduzir/pausar e R para reiniciar, quando o foco está fora dos controlos.

## Levar a aplicação para o computador do professor

1. Extrai o ZIP e mantém a pasta `dist` completa, com todos os seus ficheiros.
2. Abre `dist/index.html` no navegador. Não precisas de instalar programas nem de uma ligação à Internet.
3. Clica em **Importar 4 faixas** e seleciona os quatro ficheiros de áudio no teu computador. Usa Ctrl ou Cmd para selecionar vários ficheiros na mesma janela.
4. Depois da mensagem de confirmação, prime reproduzir. Podes silenciar cada instrumento, ouvi-lo a solo, ajustar os volumes, pausar e reiniciar o conjunto.
5. Para trocar apenas uma pista, usa **Carregar faixa** no respetivo cartão.

O professor pode importar as suas próprias pistas. Os ficheiros são lidos localmente, não são enviados para um servidor e precisam de ser selecionados novamente depois de recarregar a página. Para usar as gravações do exercício noutro computador, leva também esses quatro ficheiros; o ZIP da aplicação não os inclui.

As pistas encontradas em Descargas são `Niv7piano.wav`, `Niv7guitarra.wav`, `Niv7cordas.wav` e `Niv7saxo.wav`. Os nomes são reconhecidos automaticamente, independentemente da ordem de seleção. Depois da importação, os cartões apresentam piano, guitarra, cordas e saxofone. Cada ficheiro tem cerca de 13,5 MB, dois canais a 44 100 Hz e uma duração de 40,19 segundos. Estes metadados foram verificados nos ficheiros locais. Os nomes de outros instrumentos também podem ser editados manualmente.

A página inclui uma composição de demonstração original, «Pequeno encontro», que pode ser usada antes da importação: oito compassos, 96 BPM, 20 segundos e quatro timbres sintetizados que representam piano, guitarra, baixo e bateria. A demonstração está identificada e não corresponde às gravações do exercício. Se importares apenas algumas pistas, a página indica claramente que as restantes ainda são da demonstração.

Os ficheiros devem estar alinhados musicalmente desde o início. A duração global é a da faixa mais longa; as mais curtas ficam em silêncio até ao fim. Na repetição, esse silêncio é incluído no ciclo comum para manter a sincronização. O limite de importação é de 60 MB e 10 minutos por ficheiro; os formatos dependem dos descodificadores do navegador.

## Estrutura

- `dist/index.html`: conteúdo, navegação, reprodutor e instruções.
- `dist/style.css`: identidade visual e apresentação adaptável.
- `dist/audio.js`: relógio de reprodução, mistura e geração da demonstração.
- `dist/app.js`: cartões dos instrumentos e interação.
- `dist/import.js`: validação, identificação e descodificação das faixas importadas.
- `dist/assets/favicon.svg`: ícone original.
- `tests/audio.test.cjs`: sete testes do motor de áudio.
- `tests/import.test.cjs`: seis testes da importação.
- `.github/workflows/pages.yml`: verificação e publicação automática no GitHub Pages.

## Verificação

```sh
node --check dist/audio.js
node --check dist/app.js
node --check dist/import.js
node tests/audio.test.cjs
node tests/import.test.cjs
```

Os sete testes verificam a geração de quatro sinais distintos e válidos, o início e a continuação sincronizados, o silêncio/solo sem reinício das fontes, a navegação temporal, o fim da reprodução, a repetição de ficheiros com durações diferentes e o avanço para além do fim de uma faixa curta. Os seis testes de importação verificam o reconhecimento dos nomes reais do exercício, a atribuição sem colisões, a substituição individual, a rejeição de seleções inválidas, a conclusão da descodificação de todas as faixas e a rejeição de ficheiros corrompidos ou demasiado longos. O relógio Web Audio e a descodificação são simulados nesses testes; não substituem uma audição no navegador.

A validação visual e sonora num navegador real ficou por realizar: o navegador instalado não arrancou devido às restrições de execução do ambiente. A revisão final deve incluir uma audição com as quatro pistas originais e uma verificação no computador e no telemóvel.

## Publicação no GitHub Pages

Repositório: https://github.com/a26raulcn/Tarefa-musica-HCLE

O workflow `.github/workflows/pages.yml` verifica o JavaScript, executa os 13 testes e publica apenas o conteúdo de `dist`. É executado a cada envio para `main` e pode também ser iniciado manualmente no separador Actions. A aplicação usa caminhos relativos, pelo que funciona sob o caminho do projeto no GitHub Pages.

Na primeira publicação:

1. Envia o código para o repositório: `git push -u origin main`.
2. Em **Settings → Pages → Build and deployment → Source**, seleciona **GitHub Actions**.
3. No separador **Actions**, abre **Publicar no GitHub Pages** e escolhe **Run workflow**. Se a primeira execução falhar por Pages ainda não estar ativo, inicia uma nova execução depois de o ativar.
4. Espera que os dois trabalhos terminem com sucesso e abre a ligação apresentada na publicação.

Endereço previsto, a confirmar após a publicação: https://a26raulcn.github.io/Tarefa-musica-HCLE/

Documentação oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Os ficheiros de áudio escolhidos no reprodutor não são enviados para o GitHub. O modo local continua disponível através de `dist/index.html`.
