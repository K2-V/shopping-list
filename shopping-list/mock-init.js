import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const DB_FILE = "./db.json";
const MOCK_FILE = "./src/data/mockData.json";

const USE_MOCK = process.env.USE_MOCK === "true";

function initDatabase() {
    if (USE_MOCK) {
        console.log("Loading mock data from data/mockData.json...");

        const mockData = JSON.parse(
            fs.readFileSync(path.join(__dirname, MOCK_FILE), "utf8")
        );

        fs.writeFileSync(DB_FILE, JSON.stringify(mockData, null, 2));
    } else {
        console.log("Starting with an empty database...");

        fs.writeFileSync(DB_FILE, JSON.stringify({
            shoppingLists: [],
        }, null, 2));
    }
}

initDatabase();