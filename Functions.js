async function getResponse(userMessage) {
    try {
        const chatbox = document.getElementById("chatbox");

        // Charger la base de données
        const databaseResponse = await fetch("database.json");
        if (!databaseResponse.ok) {
            chatbox.innerHTML += "<p class='bot-message'>❌ Erreur : Impossible de charger la base de données.</p>";
            return;
        }
        const database = await databaseResponse.json();

        let lowerMessage = userMessage.toLowerCase();
        let found = false;
        let response = "📖 Je ne connais pas encore cette information.";

        for (const [key, file] of Object.entries(database)) {
            if (lowerMessage.includes(key.toLowerCase())) {
                chatbox.innerHTML += `<p class='bot-message'>🔍 Recherche du fichier : ${file}</p>`;

                // Charger le fichier correspondant
                const fileResponse = await fetch(file);
                if (!fileResponse.ok) {
                    chatbox.innerHTML += `<p class='bot-message'>❌ Erreur : Fichier introuvable (${file})</p>`;
                    continue;
                }

                const fileText = await fileResponse.text();
                response = extractRelevantInfo(lowerMessage, fileText);
                found = true;
                break;
            }
        }

        if (!found) chatbox.innerHTML += "<p class='bot-message'>⚠️ Aucune correspondance trouvée.</p>";
        chatbox.innerHTML += `<p class='bot-message'>${response}</p>`;

    } catch (error) {
        chatbox.innerHTML += "<p class='bot-message'>🚨 Erreur interne, vérifiez la console.</p>";
    }
}

// Fonction qui extrait les infos demandées
function extractRelevantInfo(query, fileText) {
    let lines = fileText.split("\n");
    let result = "";

    for (let line of lines) {
        if (query.includes("âge") && line.toLowerCase().includes("âge")) {
            result += line + "<br>";
        }
        if (query.includes("devise") && line.toLowerCase().includes("devise")) {
            result += line + "<br>";
        }
        if (query.includes("compétence") && line.toLowerCase().includes("compétence")) {
            result += line + "<br>";
        }
        if (query.includes("parle moi de") || query.includes("présente moi")) {
            result += fileText;
            break;
        }
    }

    if (result === "") {
        result = "📖 Aucune information spécifique trouvée. Voici tout le fichier :<br>" + fileText;
    }

    return result;
}
