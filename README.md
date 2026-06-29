# Colágeno da Bexiga

PWA instalável — React + Vite + TailwindCSS.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Editar conteúdo

Todos os textos ficam em `src/data/`:

- `chas.js` — chás (ingredientes, preparo, aviso, URL do vídeo)
- `receitas.js` — receitas e lista "O que evitar"
- `exercicios.js` — etapas e instruções dos treinos
- `ritual.js` — tarefas do ritual de 7 dias e frases

## Adicionar vídeos

Em qualquer arquivo de `src/data/`, preencha o campo `videoUrl`:

```js
videoUrl: 'https://www.youtube.com/watch?v=ID_DO_VIDEO'
```

Suporta YouTube, Vimeo ou URL direta de arquivo de vídeo.

## Build de produção

```bash
npm run build
```

Hospede a pasta `dist/` em Vercel, Netlify ou qualquer serviço de hospedagem estática.
