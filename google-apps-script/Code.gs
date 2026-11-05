/**
 * Réception des réponses RSVP du site du mariage → Google Sheet.
 * Déployer : Déployer > Nouveau déploiement > Application Web
 *   - Exécuter en tant que : Moi
 *   - Qui a accès : Tout le monde
 * Puis copier l'URL (…/exec) dans js/config.js (formEndpoint).
 */
var SHEET_ID = "1XkbPiairzdLqFWm6-SRKgimp7sciZ9t-fFAMUfmlL7s";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents || "{}");
    if (d.website) return reponse({ ok: true }); // pot de miel anti-robots
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    var a = parseInt(d.adultes_et_plus_de_12_ans, 10) || 0;
    var en = parseInt(d.enfants_moins_de_12_ans, 10) || 0;
    sheet.appendRow([
      new Date(),
      propre(d.nom), propre(d.prenom), propre(d.presence),
      a, en, a + en,
      propre(d.email), propre(d.telephone), propre(d.message)
    ]);
    return reponse({ ok: true });
  } catch (err) {
    return reponse({ ok: false, erreur: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return reponse({ ok: true, message: "Service RSVP actif" });
}

// Empêche l'injection de formules (=, +, -, @) dans la feuille.
function propre(v) {
  v = String(v == null ? "" : v).slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
