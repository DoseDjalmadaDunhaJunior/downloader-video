// server.js – API de download usando yt-dlp (compatível com Windows)

const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware para arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json());

let isDownloading = false;

// Função para descobrir o IP local
function getLocalIp() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

function getFormatOption(format, quality) {
  if (format === 'audio') return 'bestaudio/best';
  const height = parseInt(quality, 10);
  if (isNaN(height)) return 'bestvideo+bestaudio/best';

  // Prioriza a melhor qualidade de vídeo disponível até a altura solicitada + melhor áudio.
  // Se o FFmpeg estiver presente, ele une os dois. 
  // Se não estiver, virá apenas o vídeo (mas na resolução correta pedida).
  return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
}

app.post('/api/download', (req, res) => {
  if (isDownloading) {
    return res.status(429).send('Já existe um download em andamento.');
  }

  const { url, format, quality } = req.body;
  if (!url || !format || !quality) {
    return res.status(400).send('Parâmetros ausentes.');
  }

  // Diretório de destino (Sempre pasta temporária para streaming)
  const home = process.env.HOME || process.env.USERPROFILE;
  const downloadDir = path.join(home, 'Downloads', 'yt-temp');
  
  fs.mkdirSync(downloadDir, { recursive: true });

  const outputTemplate = path.join(downloadDir, '%(title)s.%(ext)s');
  const formatOption = getFormatOption(format, quality);

  // Detecta se está em Windows para usar yt-dlp.exe
  const ytDlpCmd = process.platform === 'win32' ? path.join(__dirname, 'yt-dlp.exe') : 'yt-dlp';

  const args = [url, '-f', formatOption, '-o', outputTemplate, '--quiet'];

  const yt = spawn(ytDlpCmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  isDownloading = true;
  let stderr = '';
  yt.stderr.on('data', (data) => { stderr += data.toString(); });

  yt.on('error', (err) => {
    isDownloading = false;
    console.error('Erro ao iniciar yt-dlp:', err);
    return res.status(500).send('Falha ao iniciar o downloader.');
  });

  yt.on('close', (code) => {
    isDownloading = false;
    if (code !== 0) {
      console.error('yt-dlp saiu com código', code, stderr);
      return res.status(500).send(`Erro ao baixar. Detalhes: ${stderr}`);
    }
    // Busca o arquivo mais recente no diretório de download
    const files = fs.readdirSync(downloadDir)
      .map(f => ({ name: f, time: fs.statSync(path.join(downloadDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);
    if (!files.length) return res.status(500).send('Arquivo não encontrado.');
    const latestFile = path.join(downloadDir, files[0].name);
    const filename = files[0].name;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const readStream = fs.createReadStream(latestFile);
    readStream.pipe(res);
    readStream.on('close', () => {
      fs.unlink(latestFile, (err) => {
        if (err) console.warn('Erro ao remover arquivo temporário:', err);
      });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`\n🚀 Servidor de Elite Rodando!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Na rede: http://${ip}:${PORT}\n`);
  console.log(`Acesse o endereço da rede pelo seu celular para baixar vídeos diretamente nele!`);
});
