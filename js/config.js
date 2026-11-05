/*
 * Réglages du site — à modifier ici uniquement.
 *
 * RSVP : les réponses sont écrites dans le Google Sheet
 * « Mariage Florence & Jean-Yves — Réponses RSVP » via un petit script
 * Google Apps Script (voir google-apps-script/Code.gs et le README).
 * Collez dans `formEndpoint` l'URL du script déployé (elle finit par /exec).
 *
 * Tant que `formEndpoint` est vide, le bouton « Envoyer » ouvre la messagerie
 * de l'invité avec un e-mail pré-rempli adressé à `emailContact`.
 */
window.MARIAGE_CONFIG = {
  // URL de l'application Web Google Apps Script (…/exec).
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
