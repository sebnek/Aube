document.addEventListener("DOMContentLoaded", async function() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");

    let database = await fetch("database.json").then(res => res.json());

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
                return await getFileContent(database[category][message]);
            }
        }
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
