module.exports = {
    find: "Passwords.txt",
    format: {
        separator: ":",
        keys: {
            "URL": "url",
            "Username": "email",
            "Password": "string"
        },
        save: `Username{SEP}Password`,
        // save: `Username{SEP}Password{SEP}URL`,
        sortSave: `Username{SEP}Password`
    }
}