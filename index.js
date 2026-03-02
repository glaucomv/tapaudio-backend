// tapaudio-backend/index.js

const express = require('express');
const youtubedl = require('youtube-dl-exec');
const app = express();

// Porta que o Render vai fornecer, ou 3000 localmente
const PORT = process.env.PORT || 3000;

app.get('/api/live/:id', async (req, res) => {
    const videoId = req.params.id;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`Processando requisição para: ${url}`);

    try {
        // Pede ao yt-dlp para nos dar apenas a URL direta do melhor áudio
        const output = await youtubedl(url, {
            getUrl: true,
            format: 'bestaudio',
            noWarnings: true,
        });

        // O output é a URL limpa da stream
        res.json({ hlsUrl: output });
        console.log(`✅ Sucesso! URL extraída para o vídeo ${videoId}`);
    } catch (error) {
        console.error(`❌ Erro ao extrair:`, error);
        res.status(500).json({ error: 'Falha ao extrair a URL da Live' });
    }
});

// Rota de teste para ver se o servidor está online
app.get('/', (req, res) => {
    res.send('TapAudio Backend está rodando perfeitamente! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
