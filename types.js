module.exports = {
    "url": (value) => {
        if(!value || typeof value !== "string") {
            return false;
        }

        const regex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
        const url = value.toLowerCase().trim();

        return regex.test(url) 
            ? new URL(url).hostname.replace("www.", "") 
            : false;
    },
    "email": (value) => {
        if(!value || typeof value !== "string") {
            return false;
        }

        const regex = /^\S+@\S+\.\S+$/;
        const email = value.toLowerCase().trim();

        return regex.test(email) ? email : false;
    },
    "string": (value) => {
        if(!value || typeof value !== "string") {
            return false;
        }

        return value;
    }
}