async function chercher() {
    const requete = document.getElementById('requete').value;
    const reponseDiv = document.getElementById('reponse');

    // Lire le fichier texte
    const response = await fetch('data/informations.txt');
    const text = await response.text();

    // Rechercher la réponse (simple exemple)
    const reponse = text.includes(requete) ? "Information trouvée !" : "Aucune information trouvée.";

    reponseDiv.innerHTML = `<h2>Réponse :</h2><p>${reponse}</p>`;
}
