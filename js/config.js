/*
 * Réglages du site — à modifier ici uniquement.
 *
 * RSVP : deux façons de recevoir les réponses du questionnaire.
 *
 * 1) Recommandé : un service de formulaire gratuit (ex. https://formspree.io).
 *    Créez un formulaire, copiez son adresse (du type https://formspree.io/f/abcdwxyz)
 *    et collez-la dans `formEndpoint`. Les réponses arrivent alors par e-mail
 *    automatiquement, sans que l'invité ait à ouvrir sa messagerie.
 *    (Voir le README pour une variante Google Sheets.)
 *
 * 2) Par défaut (si `formEndpoint` est vide) : le bouton « Envoyer » ouvre la
 *    messagerie de l'invité avec un e-mail pré-rempli adressé à `emailContact`.
 */
window.MARIAGE_CONFIG = {
  // Laisser vide pour utiliser l'envoi par e-mail pré-rempli.
  formEndpoint: "",

  // Adresse qui reçoit les réponses (assemblée en deux morceaux pour limiter le spam).
  emailContact: ["lucarelli.jy", "gmail.com"].join("@"),

  // Date limite de réponse affichée sur la page RSVP.
  dateLimiteReponse: "1er juillet 2027",

  // Date et heure de la cérémonie (heure de Paris).
  dateCeremonie: "2027-10-23T14:30:00+02:00",

  // Coordonnées GPS du Domaine des Mylords.
  gps: { lat: 43.772285, lng: 4.667647 }
};
