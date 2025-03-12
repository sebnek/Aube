async function getFileContent(filePath) {
    try {
        let response = await fetch(filePath);
        if (!response.ok) throw new Error("Fichier introuvable");
        return await response.text();
    } catch (error) {
        return "Je ne trouve pas cette information.";
    }
}
