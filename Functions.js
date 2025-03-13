async function getResponse(userMessage) {
    try {
        const databaseResponse = await fetch("database.json");
        if (!databaseResponse.ok) throw new Error("Impossible de charger la base de données.");
        const database = await databaseResponse.json();

        let lowerMessage = userMessage.toLowerCase();
        let response = "📖 Je ne connais pas encore cette information.";

        // Vérification pour chaque catégorie
        response = checkCategory(database.personnages, lowerMessage, "personnage") ||
                   checkCategory(database.dieux, lowerMessage, "dieu") ||
                   checkCategory(database.compétences, lowerMessage, "compétence") ||
                   checkCategory(database.lieux, lowerMessage, "lieu") ||
                   checkCategory(database.navires, lowerMessage, "navire") ||
                   response;

        return response;
    } catch (error) {
        return "❌ Erreur lors de la récupération des informations.";
    }
}

// Fonction de recherche dans une catégorie
function checkCategory(category, query, type) {
    for (const key in category) {
        if (query.includes(key.toLowerCase())) {
            return `📜 Voici ce que je sais sur **${key}** (${type}) :<br>${formatData(category[key])}`;
        }
    }
    return null;
}

// Formattage des données
function formatData(data) {
    if (typeof data === "string") {
        return data; // Pour les dieux et les lieux qui sont de simples descriptions
    }

    let formattedText = "";
    for (const key in data) {
        formattedText += `<b>${key} :</b> ${Array.isArray(data[key]) ? data[key].join(", ") : data[key]}<br>`;
    }
    return formattedText;
}
