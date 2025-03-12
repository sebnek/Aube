document.addEventListener("DOMContentLoaded", function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    function sendMessage() {
        let message = userInput.value.trim();
        if (message === "") return;

        addMessage("Vous : " + message, "user-message");

        let response = getResponse(message);
        setTimeout(() => addMessage(response, "bot-message"), 500);

        userInput.value = "";
    }

    function addMessage(text, className) {
        let msg = document.createElement("p");
        msg.className = className;
        msg.innerHTML = text;
        chatbox.appendChild(msg);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function getResponse(message) {
        let responses = {
            "Damballah": "Damballah est un puissant dieu-serpent de la sagesse et de la création.",
            "Derketo": "Derketo est la déesse de la luxure et de la mer, adorée par les pirates et les sorciers.",
            "Dagon": "Dagon est un dieu des profondeurs, adoré par des cultes marins dans les régions côtières.",
            "Ymir": "Ymir est le dieu de la glace et de la guerre, vénéré par les Vanaheimiens.",
            "Aquilonie": "L'Aquilonie est un puissant royaume de l'ouest, dominé par une noblesse stricte.",
            "Zembabwei": "Le Zembabwei est un royaume mystique connu pour ses rites occultes et ses guerriers féroces."
        };

        return responses[message] || "Je ne connais pas encore cette information.";
    }

    window.sendMessage = sendMessage;
});
