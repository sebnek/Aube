async function chercher() {
    const requete = document.getElementById('requete').value.toLowerCase();
    const reponseDiv = document.getElementById('reponse');
    let informationsGlobales = "";

    try {
        // Lire tous les fichiers texte dans le dossier data
        const response = await fetch('data/');
        const fichiers = await response.text();

        // Parcourir chaque fichier
        const fichiersList = fichiers.split('\n').filter(fichier => fichier.endsWith('.txt'));

        for (const fichier of fichiersList) {
            const fichierResponse = await fetch(`data/${fichier}`);
            const texteFichier = await fichierResponse.text();
            informationsGlobales += texteFichier + "\n";
        }

        // Rechercher la réponse
        const lignes = informationsGlobales.toLowerCase().split('\n');
        const reponse = lignes.find(ligne => ligne.includes(requete)) || "Aucune information trouvée.";

        reponseDiv.innerHTML = `<h2>Réponse :</h2><p>${reponse}</p>`;
    } catch (error) {
        reponseDiv.innerHTML = `<h2>Erreur :</h2><p>Impossible de charger les informations.</p>`;
    }
}
