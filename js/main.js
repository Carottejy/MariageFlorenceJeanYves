(function () {
  "use strict";

  var CONFIG = window.MARIAGE_CONFIG || {};

  /* ---------- Compte à rebours ---------- */
  function compteARebours() {
    var zone = document.getElementById("compte-a-rebours");
    if (!zone || !CONFIG.dateCeremonie) return;
    var cible = new Date(CONFIG.dateCeremonie).getTime();
    function maj() {
      var reste = cible - Date.now();
      if (reste <= 0) {
        zone.innerHTML = "<p class='chapeau'>Le grand jour est arrivé&nbsp;!</p>";
        return;
      }
      zone.querySelector("[data-j]").textContent = Math.floor(reste / 86400000);
      zone.querySelector("[data-h]").textContent = Math.floor((reste % 86400000) / 3600000);
      zone.querySelector("[data-m]").textContent = Math.floor((reste % 3600000) / 60000);
    }
    maj();
    setInterval(maj, 30000);
  }

  /* ---------- Questionnaire de confirmation ---------- */
  function formulaireRSVP() {
    var form = document.getElementById("rsvp");
    if (!form) return;

    var limite = document.getElementById("date-limite");
    if (limite && CONFIG.dateLimiteReponse) limite.textContent = CONFIG.dateLimiteReponse;

    var adultes = form.querySelector("#adultes");
    var enfants = form.querySelector("#enfants");
    var blocNombres = document.getElementById("bloc-nombres");
    var total = document.getElementById("total-convives");
    var retour = document.getElementById("message-retour");

    form.querySelectorAll(".compteur button").forEach(function (b) {
      b.addEventListener("click", function () {
        var champ = document.getElementById(b.dataset.cible);
        var v = (parseInt(champ.value, 10) || 0) + (b.dataset.pas === "+" ? 1 : -1);
        champ.value = Math.max(parseInt(champ.min, 10) || 0, Math.min(parseInt(champ.max, 10) || 20, v));
        majTotal();
      });
    });

    function presence() {
      var c = form.querySelector("input[name='presence']:checked");
      return c ? c.value : "";
    }
    function majTotal() {
      var t = (parseInt(adultes.value, 10) || 0) + (parseInt(enfants.value, 10) || 0);
      total.textContent = t ? "Soit " + t + " convive" + (t > 1 ? "s" : "") + " au total." : "";
    }
    function majPresence() {
      var vient = presence() !== "Non";
      blocNombres.classList.toggle("masque", !vient);
      adultes.min = vient ? 1 : 0;
      if (vient && (parseInt(adultes.value, 10) || 0) < 1) adultes.value = 1;
      majTotal();
    }
    form.querySelectorAll("input[name='presence']").forEach(function (r) { r.addEventListener("change", majPresence); });
    adultes.addEventListener("input", majTotal);
    enfants.addEventListener("input", majTotal);
    majPresence();

    function afficher(html, erreur) {
      retour.innerHTML = html;
      retour.classList.add("visible");
      retour.classList.toggle("erreur", !!erreur);
      retour.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;

      var vient = presence() !== "Non";
      var d = {
        nom: form.nom.value.trim(),
        prenom: form.prenom.value.trim(),
        presence: presence(),
        adultes_et_plus_de_12_ans: vient ? adultes.value : "0",
        enfants_moins_de_12_ans: vient ? enfants.value : "0",
        email: form.email.value.trim(),
        telephone: form.telephone.value.trim(),
        message: form.message.value.trim(),
        website: form.website ? form.website.value : ""
      };
      var bouton = form.querySelector("button[type='submit']");
      var merci = vient
        ? "<h3>Grand merci, " + echapper(d.prenom) + "&nbsp;!</h3><p>Votre réponse est bien enregistrée. Il nous tarde de vous retrouver au marché.</p>"
        : "<h3>Merci, " + echapper(d.prenom) + ".</h3><p>Votre réponse est bien enregistrée. Vous nous manquerez&nbsp;!</p>";

      if (CONFIG.formEndpoint) {
        bouton.disabled = true;
        bouton.textContent = "Envoi en cours…";
        // Google Apps Script : envoi en text/plain + no-cors (pas de pré-requête CORS).
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(d)
        })
          .then(function () {
            form.reset();
            majPresence();
            afficher(merci);
          })
          .catch(function () {
            afficher("<p>L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou écrivez-nous à <a href='mailto:" + CONFIG.emailContact + "'>" + CONFIG.emailContact + "</a>.</p>", true);
          })
          .then(function () {
            bouton.disabled = false;
            bouton.textContent = "Envoyer ma réponse";
          });
        return;
      }

      // Repli tant que le service n'est pas branché : e-mail pré-rempli.
      var corps = [
        "Nom : " + d.nom, "Prénom : " + d.prenom, "Présence : " + d.presence,
        "Adultes et enfants de plus de 12 ans : " + d.adultes_et_plus_de_12_ans,
        "Enfants de moins de 12 ans : " + d.enfants_moins_de_12_ans,
        "E-mail : " + (d.email || "—"), "Téléphone : " + (d.telephone || "—"), "", "Message : " + (d.message || "—")
      ].join("\n");
      var lien = "mailto:" + CONFIG.emailContact + "?subject=" + encodeURIComponent("RSVP mariage — " + d.prenom + " " + d.nom) + "&body=" + encodeURIComponent(corps);
      window.location.href = lien;
      afficher("<h3>Presque fini&nbsp;!</h3><p>Votre messagerie vient de s'ouvrir avec votre réponse&nbsp;: il ne reste qu'à cliquer sur <strong>Envoyer</strong>.</p>");
    });
  }

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Filtres ---------- */
  function filtres(selBoutons, selElements, attribut) {
    var boutons = document.querySelectorAll(selBoutons);
    if (!boutons.length) return;
    var elements = document.querySelectorAll(selElements);
    boutons.forEach(function (b) {
      b.addEventListener("click", function () {
        boutons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var v = b.dataset.filtre;
        elements.forEach(function (el) {
          var ok = v === "tous" || (el.getAttribute(attribut) || "").split(" ").indexOf(v) !== -1;
          el.classList.toggle("masque", !ok);
        });
      });
    });
  }

  /* ---------- Visionneuse des tableaux ---------- */
  function visionneuse() {
    var v = document.getElementById("visionneuse");
    if (!v) return;
    var img = v.querySelector("img");
    var leg = v.querySelector("figcaption");
    function fermer() { v.classList.remove("ouverte"); img.removeAttribute("src"); }
    document.querySelectorAll(".tableau button").forEach(function (b) {
      b.addEventListener("click", function () {
        img.src = b.dataset.grand;
        img.alt = b.querySelector("img").alt;
        leg.innerHTML = b.dataset.legende + " — <a href='" + b.dataset.page + "' target='_blank' rel='noopener'>source</a>";
        v.classList.add("ouverte");
        v.querySelector(".fermer").focus();
      });
    });
    v.addEventListener("click", function (e) { if (e.target === v || e.target.classList.contains("fermer")) fermer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    compteARebours();
    formulaireRSVP();
    filtres(".filtres button", ".logement", "data-type");
    filtres(".onglets button", ".tableau", "data-zone");
    visionneuse();
  });
})();
