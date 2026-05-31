# Mikuficator

Transformez n'importe quelle image en Hatsune Miku

## Fonctionnalites

- Upload d'image par glisser-deposer ou clic
- Ajout des twin-tails de Miku via l'IA Gemini (modele `gemini-2.5-flash-image`)
- Compression automatique des images cote client
- Historique des transformations (stocke en localStorage)
- Mode sombre
- Exemples precharges pour tester
- Design Claymorphism responsive

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Google Gemini API** (generation d'image)
- **Lucide React** (icones)

## Installation

```bash
git clone https://github.com/Hmksenpai/mikuficator.git
cd mikuficator
npm install
```

## Configuration

Copiez le fichier d'environnement et ajoutez votre cle API Gemini :

```bash
cp .env.example .env
```

Editez `.env` et remplacez par votre cle :

```
VITE_GEMINI_API_KEY=AIza...
```

> Obtenez une cle gratuite sur [aistudio.google.com](https://aistudio.google.com/apikey) (sans carte bancaire, ~1500 requetes/jour).

## Lancer en developpement

```bash
npm run dev
```

Ouvrez `http://localhost:5173` dans votre navigateur.

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

N'oubliez pas d'ajouter la variable d'environnement `VITE_GEMINI_API_KEY` dans les parametres de votre hebergeur.

## Auteur

by **[Hmksenpai](https://github.com/Hmksenpai)**

## Licence

MIT
