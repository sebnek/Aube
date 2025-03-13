document.addEventListener("DOMContentLoaded", function() {
    
    // Fonction pour récupérer le contenu d'un fichier texte via fetch
    async function getFileContent(filePath) {
        try {
            let response = await fetch(filePath);
            if (!response.ok) throw new Error("Fichier introuvable");
            return await response.text();
        } catch (error) {
            console.error("Erreur lors de la récupération du fichier:", error);
            return null;
        }
    }

    // Fonction pour rechercher dans le fichier "compétences.txt" les informations liées à un mot-clé
    async function searchCompetence(keyword) {
        let content = await getFileContent("compétences.txt");
        if (!content) return "Impossible de récupérer les informations.";
        
        // Diviser le contenu en lignes
        let lines = content.split("\n");
        // Filtrer les lignes contenant le mot-clé (insensible à la casse)
        let result = lines.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
        
        if (result.length > 0) {
            return result.join("<br>");
        } else {
            return `Aucune information trouvée concernant "${keyword}".`;
        }
    }

    // Fonction qui analyse la question utilisateur et détermine quelle information chercher
    async function handleUserQuery(query) {
        let lowerQuery = query.toLowerCase();
        
        // Exemple : si la question mentionne "agilité", on cherche dans compétences.txt
        if (lowerQuery.includes("agilité")) {
            return await searchCompetence("agilité");
        }
        
        // Vous pouvez ajouter ici d'autres conditions pour d'autres catégories (personnages, lieux, etc.)
        
        return "Je ne connais pas encore cette information.";
    }

    // Fonction pour envoyer le message et afficher la réponse dans le chat
    async function sendMessage() {
        let inputElem = document.getElementById("user-input");
        let chatboxElem = document.getElementById("chatbox");
        let query = inputElem.value.trim();
        if (query === "") return;
        
        // Afficher la question de l'utilisateur
        chatboxElem.innerHTML += `<p class="user-message">Vous : ${query}</p>`;
        
        // Obtenir la réponse en fonction de la question
        let answer = await handleUserQuery(query);
        chatboxElem.innerHTML += `<p class="bot-message">${answer}</p>`;
        
        // Faire défiler le chat vers le bas
        chatboxElem.scrollTop = chatboxElem.scrollHeight;
        inputElem.value = "";
    }

    // Attacher la fonction sendMessage au clic du bouton
    let sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", sendMessage);
    
    // Permettre l'envoi via la touche "Enter"
    let userInput = document.getElementById("user-input");
    userInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
            event.preventDefault();
        }
    });
});
