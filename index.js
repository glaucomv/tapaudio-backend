// tapaudio-backend/index.js

const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/live/:id', async (req, res) => {
    const videoId = req.params.id;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`Processando requisição para: ${url}`);

    try {
        // Puxa as informações do vídeo direto do YouTube
        const info = await ytdl.getInfo(url);
        
        // Em transmissões ao vivo, o YouTube sempre fornece uma URL de manifesto HLS
        const hlsUrl = info.formats.find(f => f.isHLS)?.url || info.player_response?.streamingData?.hlsManifestUrl;

        if (hlsUrl) {
            console.log(`✅ Sucesso! URL HLS extraída.`);
            res.json({ hlsUrl: hlsUrl });
        } else {
            console.error(`❌ Erro: O YouTube não retornou uma URL de Live para este vídeo.`);
            res.status(500).json({ error: 'Nenhuma URL HLS encontrada' });
        }
    } catch (error) {
        console.error(`❌ Erro interno do ytdl-core:`, error.message);
        res.status(500).json({ error: 'Falha ao extrair a URL da Live' });
    }
});

app.get('/', (req, res) => {
    res.send('TapAudio Backend V2 rodando liso! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
