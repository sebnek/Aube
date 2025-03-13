document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database = {};
    const OPENAI_API_KEY = "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"; // 🔴 Mets ta clé OpenAI ici
    const USE_GPT_MODEL = "gpt-3.5-turbo"; // 🔵 Change en "gpt-4-turbo" si besoin

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

        // Vérifier si la demande est une aventure ou une réflexion avancée
        if (lowerMessage.includes("aventure") || lowerMessage.includes("histoire") || lowerMessage.includes("quête") ||
            lowerMessage.includes("stratégie") || lowerMessage.includes("meilleur combattant") || lowerMessage.includes("arme")) {
            return await getOpenAIResponse(message);
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

    async function getOpenAIResponse(userMessage) {
        console.log("🧠 Envoi de la requête à OpenAI...");
        try {
            let payload = {
                model: USE_GPT_MODEL,
                messages: [
                    { role: "system", content: "Tu es un expert de l'univers de l'Aube Sanglante. Réponds uniquement avec les informations de la base de données et invente des histoires basées sur ses personnages." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300,
                temperature: 0.7
            };

            let response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Erreur OpenAI : ${response.status}`);

            let data = await response.json();
            let reply = data.choices[0].message.content;

            console.log("💬 Réponse OpenAI :", reply);
            return reply;
        } catch (error) {
            console.error("❌ ERREUR OpenAI :", error);
            return "Erreur dans la génération de la réponse. OpenAI n'est pas disponible.";
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
