let database = {};

async function loadDatabase() {
    try {
        let response = await fetch("database.json");
        if (!response.ok) throw new Error("Impossible de charger la base de données.");
        database = await response.json();
        console.log("Base de données chargée :", database);
    } catch (error) {
        console.error("Erreur : ", error);
    }
}

async function fetchFileContent(filePath) {
    try {
        let response = await fetch(filePath);
        if (!response.ok) throw new Error("Fichier introuvable");
        return await response.text();
    } catch (error) {
        return "Impossible de récupérer les données.";
    }
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    addMessage("Vous : " + userInput, "user-message");

    let response = await getResponse(userInput);
    addMessage(response, "bot-message");

    document.getElementById("user-input").value = "";
}

async function getResponse(query) {
    let words = query.toLowerCase().split(" ");
    let category = null;
    let target = null;

    for (let key in database) {
        for (let entry in database[key]) {
            if (words.includes(entry.toLowerCase())) {
                category = key;
                target = entry;
                break;
            }
        }
        if (category) break;
    }

    if (category && target) {
        let filePath = database[category][target];
        console.log("Chargement du fichier : ", filePath);
        let content = await fetchFileContent(filePath);

        if (content.includes("Impossible de récupérer les données")) {
            return `📖 Impossible de charger le fichier concernant **${target}**.`;
        }

        return `📖 Voici ce que je sais sur **${target}** :\n\n${content}`;
    }

    return "Je ne connais pas encore cette information.";
}

function addMessage(text, className) {
    let chatbox = document.getElementById("chatbox");
    let messageElement = document.createElement("p");
    messageElement.className = className;
    messageElement.innerHTML = text;
    chatbox.appendChild(messageElement);
}

// Vérifie que le DOM est bien chargé avant d’exécuter le script
document.addEventListener("DOMContentLoaded", function() {
    loadDatabase();
});
