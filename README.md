# Mariage de Florence & Jean-Yves

Site des invités — **samedi 23 octobre 2027, 14h30, Domaine des Mylords (Tarascon)**.
Thème : *marché automnal du XVIIIᵉ siècle*.

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Invitation : date, heure, lieu, adresse, point GPS, carte, compte à rebours |
| `rsvp.html` | Questionnaire de confirmation (nom, prénom, adultes / +12 ans, enfants −12 ans…) |
| `costumes.html` | Galerie d'inspirations XVIIIᵉ (vêtements et tableaux d'époque), Messieurs / Mesdames |
| `hebergements.html` | Hôtels, chambres d'hôtes, gîtes et liens Airbnb à moins de 20 min |

Tout est en HTML/CSS/JS statique : aucun outil à installer.

## Mettre le site en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**, branche `main`, dossier `/ (root)` → **Save**.
3. Après une minute, le site est disponible à l'adresse
   `https://carottejy.github.io/MariageFlorenceJeanYves/`.

## Recevoir les réponses du questionnaire dans Google Sheets

Les réponses sont ajoutées automatiquement, une ligne par foyer, dans le Google Sheet
**« Mariage Florence & Jean-Yves — Réponses RSVP »** (Google Drive de lucarelli.jy).
Le lien entre le site et la feuille est un petit script Google Apps Script, à installer une seule fois :

1. Ouvrir le Google Sheet, menu **Extensions → Apps Script**.
2. Effacer le contenu de `Code.gs`, puis coller le contenu de [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Enregistrer (icône disquette).
3. **Déployer → Nouveau déploiement** → roue dentée → **Application Web**.
   - *Exécuter en tant que* : **Moi**
   - *Qui a accès* : **Tout le monde**
4. **Déployer**, puis **Autoriser l'accès** (choisir son compte Google → *Paramètres avancés* → *Accéder au projet* → *Autoriser*).
5. Copier l'**URL de l'application Web** (elle se termine par `/exec`) et la coller dans `formEndpoint` du fichier `js/config.js`.

Tant que `formEndpoint` est vide, le bouton « Envoyer » ouvre un e-mail pré-rempli à la place.

## Modifier les contenus

- Date limite de réponse, e-mail, coordonnées GPS : `js/config.js`
- Couleurs et polices : variables en haut de `css/style.css`
- Hébergements : chaque établissement est un bloc `<article class="logement">` dans `hebergements.html`
  (attribut `data-type` = `hotel`, `chambre` ou `gite` pour les filtres).
- Costumes : blocs `<figure class="tableau">` dans `costumes.html`
  (attribut `data-zone` = `europe`, `ameriques` et/ou `marche`). Images dans `images/`,
  œuvres du domaine public / CC0 issues de Wikimedia Commons.
