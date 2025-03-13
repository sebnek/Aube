async function getResponse(userMessage) {
    try {
        const databaseResponse = await fetch("database.json");
        const database = await databaseResponse.json();

        let lowerMessage = userMessage.toLowerCase();
        let found = false;
        let response = "📖 Je ne connais pas encore cette information.";

        for (const [key, file] of Object.entries(database)) {
            if (lowerMessage.includes(key.toLowerCase())) {
                const fileResponse = await fetch(file);
                if (fileResponse.ok) {
                    const fileText = await fileResponse.text();
                    response = "📖 Voici ce que je sais sur **" + key + "** :<br>" + fileText;
                    found = true;
                    break;
                }
            }
        }

        return response;
    } catch (error) {
        return "❌ Erreur : Impossible de charger la base de données.";
    }
}
