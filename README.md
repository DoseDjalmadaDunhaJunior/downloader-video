# 🎥 Downloader de Vídeos e Áudios de Elite

Esta aplicação permite baixar vídeos e áudios de diversas plataformas (como YouTube) diretamente no seu dispositivo, seja ele um PC, celular ou tablet, desde que estejam na mesma rede Wi-Fi.

## 🚀 Guia de Início Rápido (Qualquer Sistema)

### 1. Pré-requisitos
- **Node.js** instalado (v18 ou superior).
- **FFmpeg** (Obrigatório para som em qualidades 1080p ou superior).
  - *Windows:* `winget install FFmpeg` (no PowerShell como Admin).
  - *Linux/Mac:* Use o gerenciador de pacotes do seu sistema (ex: `sudo apt install ffmpeg`).

### 2. Instalação e Execução
1. Abra o terminal na pasta do projeto e entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências necessárias:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

### 3. Acesso Multi-dispositivo 📱💻
Ao iniciar o servidor, ele exibirá dois endereços no console:
- **Local:** `http://localhost:3000` (Use no próprio PC).
- **Na rede:** `http://192.168.X.X:3000` (Use no seu Celular ou outros PCs na mesma rede).

**Para baixar no Celular:**
- Digite o endereço "Na rede" no navegador do seu celular.
- Insira o link do vídeo, escolha a qualidade e clique em "Baixar".
- O arquivo será baixado diretamente na pasta de downloads do seu celular!

---

## 🛠️ Mudanças Realizadas (Equipe de Elite)
- **Interface Simplificada:** Removemos a necessidade de digitar caminhos manuais. Agora o seu próprio navegador decide onde salvar (pasta padrão de Downloads).
- **Estética Aprimorada:** As opções de resolução agora possuem cores contrastantes para melhor visibilidade.
- **Servidor Estático:** O backend agora serve o frontend automaticamente. Não é mais necessário abrir o arquivo `index.html` manualmente; basta acessar o endereço IP.
- **Correção de Áudio:** Implementamos lógica para garantir a melhor qualidade possível, unindo áudio e vídeo automaticamente se o FFmpeg estiver presente.

---

## 📋 Resumo Técnico
- **Backend:** Node.js + Express + yt-dlp.
- **Frontend:** HTML5 + CSS3 (Glassmorphism) + Vanilla JS.
- **Porta padrão:** 3000.
- **Acesso Externo:** Habilitado para `0.0.0.0`.

#
