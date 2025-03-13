document.addEventListener("DOMContentLoaded", function() {
    
    // Fonction pour récupérer le contenu d'un fichier texte
    async function getFileContent(filePath) {
        try {
            let response = await fetch(filePath);
            if (!response.ok) throw new Error("Fichier introuvable");
            return await response.text();
        } catch (error) {
            console.error("Erreur lors de la récupération du fichier:", error);
            return "Impossible de récupérer les informations.";
        }
    }

    // Fonction de recherche avancée dans un fichier .txt
    async function searchInFile(filePath, keyword) {
        let content = await getFileContent(filePath);
        if (!content) return "Je ne trouve aucune information sur ce sujet.";

        // Diviser le fichier en lignes pour traiter chaque ligne séparément
        let lines = content.split("\n");

        // Filtrer les lignes contenant le mot-clé (insensible à la casse)
        let result = lines.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));

        // Vérifier si des résultats ont été trouvés
        if (result.length > 0) {
            return result.join("<br>"); // Retourne uniquement les lignes correspondantes
        } else {
            return `Aucune information spécifique trouvée pour "${keyword}".`;
        }
    }

    // Fonction principale qui analyse la question de l'utilisateur et recherche la bonne info
    async function handleUserQuery(query) {
        let lowerQuery = query.toLowerCase();

        // Vérification si la question concerne une compétence
        if (lowerQuery.includes("agilité") || lowerQuery.includes("force") || lowerQuery.includes("combat")) {
            return await searchInFile("compétences.txt", lowerQuery);
        }

        // Vérification si la question concerne un personnage
        if (lowerQuery.includes("borrak") || lowerQuery.includes("hilda") || lowerQuery.includes("sigvard")) {
            return await searchInFile(`fichiers/Personnage_${query}.txt`, query);
        }

        // Vérification si la question concerne un dieu
        if (lowerQuery.includes("ymir") || lowerQuery.includes("damballah") || lowerQuery.includes("derketo")) {
            return await searchInFile("dieux.txt", lowerQuery);
        }

        // Vérification si la question concerne un lieu
        if (lowerQuery.includes("aquilonie") || lowerQuery.includes("zembabwei")) {
            return await searchInFile("lieux.txt", lowerQuery);
        }

        return "Je ne connais pas encore cette information.";
    }

    // Fonction qui gère l'affichage des réponses
    async function sendMessage() {
        let inputElem = document.getElementById("user-input");
        let chatboxElem = document.getElementById("chatbox");
        let query = inputElem.value.trim();

        if (query === "") return;

        // Afficher la question de l'utilisateur
        chatboxElem.innerHTML += `<p class="user-message">Vous : ${query}</p>`;

        // Obtenir la réponse intelligente
        let answer = await handleUserQuery(query);
        chatboxElem.innerHTML += `<p class="bot-message">${answer}</p>`;

        // Faire défiler le chat vers le bas
        chatboxElem.scrollTop = chatboxElem.scrollHeight;
        inputElem.value = "";
    }

    // Attacher la fonction sendMessage au clic du bouton
    let sendButton = document.getElementById("sendButton");
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }

    // Permettre l'envoi via la touche "Enter"
    let userInput = document.getElementById("user-input");
    if (userInput) {
        userInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                sendMessage();
                event.preventDefault();
            }
        });
    }
});
