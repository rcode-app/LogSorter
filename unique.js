console.log("==========================================")
console.log("💻 Developer: RCode");
console.log("🔗 Profile: https://zelenka.guru/rcode");
console.log("🔗 Website: https://rcode.app/")
console.log("==========================================\n")

const fs = require('fs');

const logs = fs.readdirSync("./result");

for (let index = 0; index < logs.length; index++) {
    const log_path = "./result/"+logs[index];
    const log = fs.readFileSync(log_path, "utf-8").split(/\r?\n/);
    const unique = log.filter((value, idx) => log.indexOf(value) === idx);
    fs.writeFileSync(log_path, unique.join("\n"));
}