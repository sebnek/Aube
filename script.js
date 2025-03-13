document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database = {};

    // Charger database.json
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
        console.log("🔍 Recherche de :", message);
        let lowerMessage = message.toLowerCase();

        // Vérifier si la demande est une aventure
        if (lowerMessage.includes("aventure") || lowerMessage.includes("histoire") || lowerMessage.includes("quête")) {
            return generateAdventure(message);
        }

        // Vérifier si la demande concerne un personnage, un lieu ou un dieu
        for (let category in database) {
            for (let key in database[category]) {
                if (lowerMessage.includes(key.toLowerCase())) {
                    console.log("✅ Correspondance trouvée :", key);
                    
                    let filePath = database[category][key];
                    let fileContent = await getFileContent(filePath);
                    
                    return `📖 Voici ce que je sais sur **${key}** : ${fileContent}`;
                }
            }
        }
        
        console.log("❌ Aucune correspondance trouvée.");
        return "Je ne connais pas encore cette information.";
    }

    async function getFileContent(filePath) {
        try {
            console.log("📂
