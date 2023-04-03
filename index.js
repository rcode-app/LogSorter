console.log("==========================================")
console.log("💻 Developer: RCode");
console.log("🔗 Profile: https://zelenka.guru/rcode");
console.log("🔗 Website: https://rcode.app/")
console.log("==========================================\n")

const config = require("./config");
const fs = require("fs");
const path = require("path");
const types = require('./types');

const FORMAT = config.format.keys;
const FORMAT_VALUES = Object.values(config.format.keys);
const FORMAT_KEYS = Object.keys(config.format.keys);
const HAS_HOST = FORMAT_VALUES.includes("url");

if(!fs.existsSync("./result/") || !fs.existsSync("./input/")) {
    if(!fs.existsSync("./result/")) fs.mkdirSync("./result/");
    if(!fs.existsSync("./input/")) {
        fs.mkdirSync("./input/");
        console.log("⛔ Insert your logs folder into 📂 './input'");
        process.exit();
    }
}

function findNeedleFiles(directory) {
	const files = fs.readdirSync(directory);
	let foundFiles = [];

	for (const file of files) {
		const filePath = path.join(directory, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			foundFiles = foundFiles.concat(findNeedleFiles(filePath));
		} else if (file.indexOf(config.find) === 0) {
			foundFiles.push(filePath);
		}
	}

	return foundFiles;
}

function readFindedFile(filePath) {

    const file = fs.readFileSync(filePath, "utf-8")
        .split(/\r?\n/)
        .filter(str => str.trim())
        .filter(str => new RegExp(`\\b^[a-zA-Z0-9]+${config.format.separator} .+$\\b`, 'gi').test(str));


    for (let index = 0; index < file.length; index++) {
        const line = parseLine(file[index]);
        if(!line) continue;
        
        /* Если есть тип ключа как url */
        if(HAS_HOST && line.type === 'url' && (index + 2) < file.length) {
            const hostname = line;
            const username = parseLine(file[index + 1]);
            const password = parseLine(file[index + 2]);
            if(hostname && username && password) {
                const save_string = config.format.save
                    .replace(hostname.key, hostname.value)
                    .replace(username.key, username.value)
                    .replace(password.key, password.value)
                    .replace(/{SEP}/ig, config.format.separator)
                fs.appendFileSync("./result/all.txt", save_string+"\n");

                const save_sort_string = config.format.sortSave
                    .replace(username.key, username.value)
                    .replace(password.key, password.value)
                    .replace(/{SEP}/ig, config.format.separator);

                fs.appendFileSync(`./result/${hostname.value}.txt`, save_sort_string+"\n");

            }

        }

    }
}

function parseLine(line) {
    line = line.split(new RegExp(`\\b${config.format.separator}\\s+\\b`));
    if(line.length <= 1) return null;
    const [key, value] = line;
    if(!types.hasOwnProperty(FORMAT[key])) return null;
    if(key in FORMAT) {
        const type = types[FORMAT[key]](value);
        if(type) {
            return {
                key,
                value: type,
                type: FORMAT[key]
            }
        }
    }

    return null;
}

(async () => {
    const filesList = findNeedleFiles(path.join(__dirname, "input"));
    
    if(!filesList.length) {
        console.log("⛔ Files not found");
        process.exit();
    }

    console.log(`✅ Founded files: ${filesList.length}`);

    for(let path of filesList) {
        readFindedFile(path);
    }
})()