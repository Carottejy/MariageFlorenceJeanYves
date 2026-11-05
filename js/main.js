(function () {
  "use strict";

  var CONFIG = window.MARIAGE_CONFIG || {};

  /* ---------- Feuilles d'automne ---------- */
  function semerFeuilles() {
    var conteneur = document.createElement("div");
    conteneur.className = "feuilles";
    conteneur.setAttribute("aria-hidden", "true");
    var symboles = ["🍂", "🍁", "🍃", "🍂", "🍁"];
    var nombre = window.innerWidth < 700 ? 7 : 14;
    for (var i = 0; i < nombre; i++) {
      var f = document.createElement("span");
      f.className = "feuille";
      f.textContent = symboles[i % symboles.length];
      f.style.left = Math.random() * 100 + "vw";
      f.style.fontSize = 16 + Math.random() * 16 + "px";
      f.style.animationDuration = 14 + Math.random() * 16 + "s";
      f.style.animationDelay = -Math.random() * 30 + "s";
      conteneur.appendChild(f);
    }
    document.body.appendChild(conteneur);
  }

  /* ---------- Compte à rebours ---------- */
  function compteARebours() {
    var zone = document.getElementById("compte-a-rebours");
    if (!zone || !CONFIG.dateCeremonie) return;
    var cible = new Date(CONFIG.dateCeremonie).getTime();

    function maj() {
      var reste = cible - Date.now();
      if (reste <= 0) {
        zone.innerHTML = "<p class='sous-titre'>Le grand jour est arrivé&nbsp;!</p>";
        return;
      }
      var j = Math.floor(reste / 86400000);
      var h = Math.floor((reste % 86400000) / 3600000);
      var m = Math.floor((reste % 3600000) / 60000);
      zone.querySelector("[data-j]").textContent = j;
      zone.querySelector("[data-h]").textContent = h;
      zone.querySelector("[data-m]").textContent = m;
    }
    maj();
    setInterval(maj, 30000);
  }

  /* ---------- RSVP ---------- */
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

    // Boutons + / −
    form.querySelectorAll(".compteur button").forEach(function (b) {
      b.addEventListener("click", function () {
        var champ = document.getElementById(b.dataset.cible);
        var v = parseInt(champ.value, 10) || 0;
        v += b.dataset.pas === "+" ? 1 : -1;
        var min = parseInt(champ.min, 10) || 0;
        var max = parseInt(champ.max, 10) || 20;
        champ.value = Math.max(min, Math.min(max, v));
        majTotal();
      });
    });

    function presence() {
      var c = form.querySelector("input[name='presence']:checked");
      return c ? c.value : "";
    }

    function majTotal() {
      var a = parseInt(adultes.value, 10) || 0;
      var e = parseInt(enfants.value, 10) || 0;
      var t = a + e;
      total.textContent = t === 0 ? "" :
        "Soit " + t + " convive" + (t > 1 ? "s" : "") + " au total.";
    }

    function majPresence() {
      var vient = presence() !== "Non";
      blocNombres.classList.toggle("masque", !vient);
      adultes.min = vient ? 1 : 0;
      if (vient && (parseInt(adultes.value, 10) || 0) < 1) adultes.value = 1;
      majTotal();
    }

    form.querySelectorAll("input[name='presence']").forEach(function (r) {
      r.addEventListener("change", majPresence);
    });
    adultes.addEventListener("input", majTotal);
    enfants.addEventListener("input", majTotal);
    majPresence();

    function afficher(msg, erreur) {
      retour.innerHTML = msg;
      retour.classList.add("visible");
      retour.classList.toggle("erreur", !!erreur);
      retour.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;

      var vient = presence() !== "Non";
      var donnees = {
        nom: form.nom.value.trim(),
        prenom: form.prenom.value.trim(),
        presence: presence(),
        adultes_et_plus_de_12_ans: vient ? adultes.value : "0",
        enfants_moins_de_12_ans: vient ? enfants.value : "0",
        email: form.email.value.trim(),
        telephone: form.telephone.value.trim(),
        message: form.message.value.trim()
      };

      var bouton = form.querySelector("button[type='submit']");

      if (CONFIG.formEndpoint) {
        bouton.disabled = true;
        bouton.textContent = "Envoi en cours…";
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(Object.assign({ _subject: "RSVP mariage — " + donnees.prenom + " " + donnees.nom }, donnees))
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            form.reset();
            majPresence();
            afficher(vient
              ? "<h3>Grand merci, " + echapper(donnees.prenom) + "&nbsp;!</h3><p>Votre réponse est bien enregistrée. Nous avons hâte de vous retrouver au marché&nbsp;!</p>"
              : "<h3>Merci, " + echapper(donnees.prenom) + ".</h3><p>Votre réponse est bien enregistrée. Vous nous manquerez&nbsp;!</p>");
          })
          .catch(function () {
            afficher("<p>Oups, l'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous directement à <a href='mailto:" + CONFIG.emailContact + "'>" + CONFIG.emailContact + "</a>.</p>", true);
          })
          .then(function () {
            bouton.disabled = false;
            bouton.textContent = "Envoyer ma réponse";
          });
        return;
      }

      // Repli : e-mail pré-rempli
      var corps = [
        "Nom : " + donnees.nom,
        "Prénom : " + donnees.prenom,
        "Présence : " + donnees.presence,
        "Adultes et enfants de plus de 12 ans : " + donnees.adultes_et_plus_de_12_ans,
        "Enfants de moins de 12 ans : " + donnees.enfants_moins_de_12_ans,
        "E-mail : " + (donnees.email || "—"),
        "Téléphone : " + (donnees.telephone || "—"),
        "",
        "Message : " + (donnees.message || "—")
      ].join("\n");
      var lien = "mailto:" + CONFIG.emailContact +
        "?subject=" + encodeURIComponent("RSVP mariage — " + donnees.prenom + " " + donnees.nom) +
        "&body=" + encodeURIComponent(corps);
      window.location.href = lien;
      afficher("<h3>Presque fini&nbsp;!</h3><p>Votre messagerie vient de s'ouvrir avec votre réponse pré-remplie&nbsp;: il ne reste qu'à cliquer sur <strong>Envoyer</strong>.</p><p>Rien ne s'est ouvert&nbsp;? Écrivez-nous à <a href='" + lien + "'>" + CONFIG.emailContact + "</a>.</p>");
    });
  }

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Filtres (costumes & hébergements) ---------- */
  function filtres(selecteurBoutons, selecteurElements, attribut) {
    var boutons = document.querySelectorAll(selecteurBoutons);
    if (!boutons.length) return;
    var elements = document.querySelectorAll(selecteurElements);
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

  document.addEventListener("DOMContentLoaded", function () {
    semerFeuilles();
    compteARebours();
    formulaireRSVP();
    filtres(".filtres button", ".logement", "data-type");
    filtres(".onglets button", ".costume", "data-zone");
  });
})();
