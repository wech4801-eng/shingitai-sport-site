# Shingitai Sport — site de présentation

Site : https://wech4801-eng.github.io/shingitai-sport-site/

Ce dépôt contient uniquement le site vitrine public, pas le code de l’application mobile ni ses données.

## Développement
Node.js 22 :
```sh
npm ci
npm run dev
```

## Publication
Chaque push sur main compile et vérifie le site avant publication via GitHub Pages.
```sh
npm run build
node scripts/check-build.mjs
npm run preview
```

## Contenu
Running, musculation, nutrition. Le chapitre musculation présente les charges ajustables, l’enchaînement automatique des séries et le bilan de ressenti de fin de séance.
La direction existante est conservée : graphite/citron/papier, typographies Oswald et Manrope, triptyque de téléphones.

Les captures et les témoignages de démonstration sont identifiés comme tels. Les liens des stores restent en attente de publication effective. Aucun APK de test n’est exposé.

Le site est partageable par lien ; l’indexation par les moteurs est désactivée pendant la phase de présentation. Les informations légales de l’éditeur et les liens définitifs des stores restent à compléter avant lancement commercial. Les documents préparatoires privés ne sont pas publiés.

Les médias sont fournis pour ce projet. Aucune licence de réutilisation générale n’est accordée.
