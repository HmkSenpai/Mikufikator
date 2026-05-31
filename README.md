# Mikuficator

Mikufiez n'importe quelle image avec les couettes iconiques de Hatsune Miku, via l'IA.

## Fonctionnalites

- Upload d'image par glisser-deposer ou clic
- Mikufication via le modele Qwen-Image-Edit-2509 (hebergement HF ZeroGPU)
- Compression automatique des images cote client
- Historique des mikufications (stocke en localStorage)
- Mode sombre
- Exemples precharges pour tester
- Design Claymorphism responsive

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **@gradio/client** (appel API au HF Space)
- **Qwen-Image-Edit-2509** (modele de vision-editing)
- **Lucide React** (icones)

## Installation

```bash
git clone https://github.com/Hmksenpai/mikuficator.git
cd mikuficator
npm install
```

> Sur Windows, executez l'installation depuis **cmd** ou **PowerShell** (pas WSL).

## Configuration

Aucune cle API requise — l'app utilise un Space HF public.

Optionnellement pour dupliquer le Space en prive :

```bash
cp .env.example .env
# Decommentez VITE_HF_API_KEY si besoin
```

## Lancer en developpement

```bash
npm run dev
```

Ouvrez `http://localhost:5173` dans votre navigateur.

> **Note :** le premier appel peut prendre ~30s (cold start du GPU ZeroGPU).
> Les appels suivants sont plus rapides.

## Build production

```bash
npm run build
```

Les fichiers statiques sont generes dans le dossier `dist/`.

## Deploiement

Le projet produit un build 100% statique. Deployez `dist/` sur :

- [Vercel](https://vercel.com) (recommande)
- [Netlify](https://netlify.com)
- GitHub Pages
- Tout hebergement statique

## Auteur

by **[Hmksenpai](https://github.com/Hmksenpai)**

## Licence

MIT
