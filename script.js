document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database;

    // Charger database.json et afficher une erreur si ça ne marche pas
    try {
        let response = await fetch("database.json");
        if (!response.ok) throw new Error("Impossible de charger database.json");
        database = await response.json();
        console.log("📜 Base de données chargée :", database);
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
        for (let category in database) {
            if (database[category][message]) {
                console.log("🔗 Chargement de :", database[category][message]);
                return await getFileContent(database[category][message]);
            }
        }
        return "Je ne connais pas encore cette information.";
    }

    async function getFileContent(filePath) {
        try {
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
