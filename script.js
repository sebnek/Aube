document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const chatbox = document.getElementById("chatbox");
    const sendButton = document.querySelector("button");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        addMessage("Vous : " + message, "user-message");

        try {
            const response = await getResponse(message);
            addMessage(response, "bot-message");
        } catch (error) {
            addMessage("❌ Erreur : " + error.message, "bot-message");
        }

        userInput.value = "";
    }

    function addMessage(text, className) {
        const messageElement = document.createElement("p");
        messageElement.classList.add(className);
        messageElement.innerHTML = text;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
