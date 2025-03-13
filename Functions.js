// Fonction qui réfléchit et génère des réponses intelligentes
function generateIntelligentResponse(question, database) {
    let lowerQuestion = question.toLowerCase();

    // Vérifier si la question correspond à un élément du JSON
    for (let category in database) {
        for (let key in database[category]) {
            if (lowerQuestion.includes(key.toLowerCase())) {
                return `📖 Voici ce que je sais sur **${key}** : ${database[category][key]}`;
            }
        }
    }

    // Générer une réponse plus avancée
    if (lowerQuestion.includes("meilleur combattant")) {
        return "Le meilleur combattant dépend du contexte. Borrak est redoutable en duel, mais certains dieux comme Damballah possèdent des pouvoirs bien supérieurs.";
    }
    
    if (lowerQuestion.includes("quelle compétence choisir")) {
        let skills = Object.keys(database["compétences"]);
        let randomSkill = skills[Math.floor(Math.random() * skills.length)];
        return `Je te conseille de développer la compétence **${randomSkill}** : ${database["compétences"][randomSkill]}`;
    }

    if (lowerQuestion.includes("invente une histoire")) {
        return `Il était une fois un pirate sanguinaire nommé Borrak. Lors d'une bataille contre un équipage maudit, il dut affronter un spectre légendaire...`;
    }

    return "🤔 Je ne connais pas encore cette information, mais je continue d'apprendre !";
}
