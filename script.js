document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database = {};

    // Charger database.json et vérifier s'il est bien accessible
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

        let response = getResponse(message);
        setTimeout(() => addMessage(response, "bot-message"), 500);

        userInput.value = "";
    }

    function getResponse(message) {
        console.log("🔍 Recherche de :", message);

        for (let category in database) {
            for (let key in database[category]) {
                if (message.toLowerCase().includes(key.toLowerCase())) {
                    console.log("✅ Correspondance trouvée :", key);
                    return `📖 Voici ce que je sais sur **${key}** : ${database[category][key]}`;
                }
            }
        }
        
        console.log("❌ Aucune correspondance trouvée.");
        return "Je ne connais pas encore cette information.";
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
