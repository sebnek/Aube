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
                    
                    return `📖 Voici ce que je sais sur **${key}** :<br><br> ${fileContent}`;
                }
            }
        }
        
        console.log("❌ Aucune correspondance trouvée.");
        return "Je ne connais pas encore cette information.";
    }

    async function getFileContent(filePath) {
        try {
            console.log("📂 Tentative de chargement :", filePath);
            let response = await fetch(filePath);
            
            if (!response.ok) throw new Error(`Erreur HTTP ${response.status} sur ${filePath}`);

            let text = await response.text();
            console.log("📜 Fichier chargé avec succès :", text);
            return text;
        } catch (error) {
            console.error("❌ ERREUR :", error);
            return `Impossible de récupérer les données. Erreur : ${error.message}`;
        }
    }

    function generateAdventure(message) {
        let character = null;

        // Vérifier si un personnage connu est mentionné
        for (let key in database["personnages"]) {
            if (message.toLowerCase().includes(key.toLowerCase())) {
                character = key;
                break;
            }
        }

        if (!character) {
            return "Je ne connais pas ce personnage, mais je peux inventer une aventure si tu me donnes un nom connu !";
        }

        let adventureTemplates = [
            `Un jour, **${character}** découvrit une mystérieuse île peuplée de créatures anciennes. Seul son courage et son intelligence lui permirent de survivre...`,
            `Alors qu'il naviguait en quête de gloire, **${character}** se retrouva face à un navire fantôme. S'engagea alors un duel contre un capitaine maudit...`,
            `Dans une taverne obscure, **${character}** entendit parler d'un trésor caché sous les ruines d'une cité engloutie. Son instinct de guerrier le poussa à partir immédiatement...`,
            `Une nuit, **${character}** fit un rêve étrange où une ancienne prophétie annonçait son destin. Le lendemain, il trouva une carte mystérieuse...`
        ];

        let randomIndex = Math.floor(Math.random() * adventureTemplates.length);
        return adventureTemplates[randomIndex];
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
