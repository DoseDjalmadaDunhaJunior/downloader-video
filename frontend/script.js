/* script.js – Lógica de interação com a API de download */

const form = document.getElementById('downloadForm');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = 'Processando... Por favor, aguarde.';
  
  // Limpa animações anteriores
  statusDiv.style.color = 'var(--color-primary)';

  // Coleta dos dados do formulário
  const url = document.getElementById('urlInput').value.trim();
  const format = document.querySelector('input[name="format"]:checked').value;
  const quality = document.getElementById('qualitySelect').value;

  const payload = { url, format, quality };

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro ${response.status}: ${err}`);
    }

    // O backend devolve o arquivo como blob
    const blob = await response.blob();
    
    // Tenta extrair o nome do arquivo do cabeçalho Content-Disposition
    const disposition = response.headers.get('Content-Disposition');
    let filename = 'download_concluido';
    if (disposition && disposition.includes('filename=')) {
      // Remove aspas e caracteres especiais do nome
      filename = disposition.split('filename=')[1].replace(/["']/g, '').trim();
    } else {
      // Fallback de nome baseado no formato
      filename += (format === 'audio' ? '.mp3' : '.mp4');
    }

    // Cria link de download temporário no navegador
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Limpeza
    setTimeout(() => {
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    }, 100);

    statusDiv.textContent = 'Download concluído e salvo com sucesso!';
    statusDiv.style.color = '#2ecc71'; // Verde de sucesso
  } catch (err) {
    console.error('Erro no cliente:', err);
    statusDiv.textContent = `Falha: ${err.message}`;
    statusDiv.style.color = '#e74c3c'; // Vermelho de erro
  }
});
