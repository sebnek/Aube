document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database;

    // Charger database.json et afficher son contenu dans la console
    try {
        let response = await fetch("database.json");
        if (!response.ok) throw new Error("Impossible de charger database.json");
        database = await response.json();
        console.log("✅ Base de données chargée avec succès :", database);
    } catch (error) {
        console.error("❌ ERREUR : ", error);
        addMessage("Erreur : Impossible de charger la base de données.", "bot-message");
        return;
    }

    async function sendMessage() {
        let message = userInput.value.trim();
        if (message === "") return;

        addMessage("Vous : " + message, "user-message");

        let response = await getResponse(message);
        setTimeout(() => addMessage(response, "bot-message"), 500);

        userInput.value = "";
    }

    async function getResponse(message) {
        console.log("🔍 Recherche de : ", message);

        // Vérification dans toutes les catégories de la base
        for (let category in database) {
            if (database[category][message]) {
                console.log("📜 Correspondance trouvée :", database[category][message]);
                return await getFileContent(database[category][message]);
            }
        }
        
        console.log("❌ Aucune correspondance trouvée.");
        return "Je ne connais pas encore cette information.";
    }

    async function getFileContent(filePath) {
        try {
            console.log("📂 Chargement du fichier :", filePath);
            let response = await fetch(filePath);
            if (!response.ok) throw new Error("Impossible de lire le fichier : " + filePath);
            return await response.text();
        } catch (error) {
            console.error("❌ ERREUR : ", error);
            return "Impossible de récupérer les données.";
        }
    }

    function addMessage(text, className) {
        let msg = document.createElement("p");
        msg.className = className;
        msg.innerHTML = text;
        chatbox.appendChild(msg);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    window.sendMessage = sendMessage;
});
