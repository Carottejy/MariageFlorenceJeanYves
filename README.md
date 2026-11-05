# Mariage de Florence & Jean-Yves

Site des invités — **samedi 23 octobre 2027, 14h30, Domaine des Mylords (Tarascon)**.
Thème : *marché automnal du XVIIIᵉ siècle*.

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Invitation : date, heure, lieu, adresse, point GPS, carte, compte à rebours |
| `rsvp.html` | Questionnaire de confirmation (nom, prénom, adultes / +12 ans, enfants −12 ans…) |
| `costumes.html` | Inspirations de costumes XVIIIᵉ (Europe & Amériques), hommes / femmes |
| `hebergements.html` | Hôtels, chambres d'hôtes, gîtes et liens Airbnb à moins de 20 min |

Tout est en HTML/CSS/JS statique : aucun outil à installer.

## Mettre le site en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**, branche `main`, dossier `/ (root)` → **Save**.
3. Après une minute, le site est disponible à l'adresse
   `https://carottejy.github.io/MariageFlorenceJeanYves/`.

## Recevoir les réponses du questionnaire

Tous les réglages sont dans **`js/config.js`**.

- **Par défaut** : le bouton « Envoyer » ouvre la messagerie de l'invité avec un e-mail pré-rempli
  adressé à `emailContact`. Simple, mais l'invité doit cliquer sur *Envoyer* dans sa messagerie.
- **Recommandé — Formspree** (gratuit jusqu'à 50 réponses/mois) :
  1. Créez un compte sur <https://formspree.io> et un nouveau formulaire.
  2. Copiez l'adresse fournie (ex. `https://formspree.io/f/abcdwxyz`).
  3. Collez-la dans `formEndpoint` dans `js/config.js`.
  Les réponses arrivent alors par e-mail et sont consultables / exportables (CSV) sur Formspree.
- **Variante Google Sheets** : créez un Google Form ou un script Apps Script publié en « application Web »
  qui accepte un POST JSON, puis mettez son URL dans `formEndpoint`.

## Modifier les contenus

- Date limite de réponse, e-mail, coordonnées GPS : `js/config.js`
- Couleurs et polices : variables en haut de `css/style.css`
- Hébergements : chaque établissement est un bloc `<article class="logement">` dans `hebergements.html`
  (attribut `data-type` = `hotel`, `chambre` ou `gite` pour les filtres).
- Costumes : blocs `<article class="costume">` dans `costumes.html`
  (attribut `data-zone` = `europe`, `ameriques` et/ou `marche`).
