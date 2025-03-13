async function getResponse(userMessage) {
    try {
        // Charger la base de données JSON
        const databaseResponse = await fetch("database.json");
        if (!databaseResponse.ok) {
            throw new Error("Impossible de charger la base de données.");
        }
        const database = await databaseResponse.json();

        let lowerMessage = userMessage.toLowerCase();
        let found = false;
        let response = "📖 Je ne connais pas encore cette information.";

        // Vérifier si un mot clé correspond à un fichier de la base de données
        for (const [key, file] of Object.entries(database)) {
            if (lowerMessage.includes(key.toLowerCase())) {
                const fileResponse = await fetch(file);
                if (fileResponse.ok) {
                    const fileText = await fileResponse.text();

                    // Extraire les informations pertinentes en fonction de la demande
                    response = extractRelevantInfo(lowerMessage, fileText);
                    found = true;
                    break;
                }
            }
        }

        return response;
    } catch (error) {
        return "❌ Erreur : " + error.message;
    }
}

// Fonction pour extraire les informations spécifiques à partir du fichier texte
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
        result = "📖 Aucune information spécifique trouvée, voici tout le fichier :<br>" + fileText;
    }

    return result;
}
