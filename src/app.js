const { Client, Partials, IntentsBitField, WebhookClient, EmbedBuilder, Colors } = require("discord.js");
const { default: chalk } = require("chalk");
const { readdirSync } = require("fs");
const fs = require('fs');
const SteamUser = require("steam-user");
require("dotenv").config();
const db = require('croxydb');

const client = new Client({
    intents: Object.values(IntentsBitField.Flags),
    partials: Object.values(Partials)
});

global.client = client;
client.commands = (global.commands = []);

readdirSync("./src/commands").forEach((category) => {
    readdirSync(`./src/commands/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const command = require(`./commands/${category}/${file}`);
        const { name, description, type, options, dm_permissions } = command;

        client.commands.push({
            name,
            description,
            type: type ? type : 1,
            options,
            dm_permissions
        });

        console.log(chalk.red("[COMMANDS]"), chalk.white(`The command named ${name} is loaded!`));
    });
});

readdirSync("./src/events").forEach((category) => {
    readdirSync(`./src/events/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const event = require(`./events/${category}/${file}`);
        const eventName = event.name || file.split(".")[0];

        client.on(eventName, (...args) => event.run(client, ...args));

        console.log(chalk.blue("[EVENTS]"), chalk.white(`Event named ${eventName} has been loaded!`));
    });
});

const accountFilePath = './accounts.json';

const steamClients = {};
let previousAccounts = {};

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!guard ")) {
        const steamGuardCode = message.content.split(" ")[1];
        const data = db.get(message.author.id)
        const steamClient = steamClients[data.username];

        if (message.guildId) return message.reply("Bu komutu sadece özel mesajda kullanabilirsin")

        if (steamClient && steamClient.steamGuardCallback) {

            try {
                steamClient.steamGuardCallback(steamGuardCode);

                steamClient.once('loggedOn', () => {
                    message.reply("Steam Guard kodu başarıyla iletildi ve giriş yapıldı!");
                });

                steamClient.once('error', (err) => {
                    console.error("Giriş işlemi sırasında bir hata oluştu:", err);
                    message.reply("Giriş işlemi sırasında bir hata oluştu.```"+err.message+"```");
                });

            } catch (error) {
                console.error("Steam Guard kodu iletilirken bir hata oluştu:", error);
                message.reply("Steam Guard kodu iletilirken bir hata oluştu.```"+error+"```");
            }
        } else {
            console.error(`Kullanıcıya ait SteamClient veya SteamGuardCallback bulunamadı: ${message.author.username}`);
            message.reply("Steam Guard kodu iletilirken bir hata oluştu.");
        }
    }
});


const handleAccountLogin = async (accounts) => {
    for (const account in accounts) {
        const { username, password } = accounts[account].details;
        let { title, games } = accounts[account].settings;
        const data = db.get(username);

        title = Array.isArray(title) ? title : [title];
        games = Array.isArray(games) ? games : [games];

        if (steamClients[username]) continue;

        const steamClient = new SteamUser();
        steamClient.accountName = username;
        steamClient.password = password;

        steamClient.logOn({
            accountName: username,
            password: password
        });

        steamClient.on("steamGuard", (domain, callback) => {
            const user = client.users.cache.get(data.id);
            if (user) {
                user.send("Steam Guard kodunu lütfen bu komutu kullanarak gönderin: `!guard kod`");
                steamClient.steamGuardCallback = callback;
            } else {
                console.error(`Kullanıcı ${data.id} bulunamadı.`);
            }
        });

        steamClient.on("loggedOn", async () => {
            await steamClient.setPersona(SteamUser.EPersonaState.Online);
            await steamClient.gamesPlayed([...title, ...games]);

            console.log(`${username} adlı hesaba giriş yapıldı ve oyunlar başlatıldı.`);
        });

        steamClient.on("error", (err) => {
            const wb = new WebhookClient({ url: process.env.WEBHOOK_URL });
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Bir hata oluştu!")
                .setDescription(`${username} adlı hesaba giriş yapılırken bir hata oluştu!` + "```" + err.message + "```");

            wb.send({
                embeds: [embed]
            });
            console.error(`Hata: ${username} hesabına giriş yapılırken bir hata oluştu.`, err);
        });

        steamClients[username] = steamClient;
    }
};

const handleAccountLogoff = async (accounts) => {
    for (const account in steamClients) {
        if (!accounts[account]) {
            const steamClient = steamClients[account];
            steamClient.logOff();
            delete steamClients[account];
            console.log(`${account} adlı hesaptan çıkış yapıldı.`);
        }
    }
};

const loadAccounts = () => {
    fs.readFile(accountFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading accounts.json file:', err);
            return;
        }
        const accs = JSON.parse(data);

        if (!accs.accounts) {
            console.error('Error: accounts key is missing in accounts.json');
            return;
        }

        const newAccounts = {};
        for (const account in accs.accounts) {
            if (!previousAccounts[account]) {
                newAccounts[account] = accs.accounts[account];
            }
        }

        const removedAccounts = {};
        for (const account in previousAccounts) {
            if (!accs.accounts[account]) {
                removedAccounts[account] = previousAccounts[account];
            }
        }

        previousAccounts = accs.accounts;

        if (Object.keys(newAccounts).length > 0) {
            handleAccountLogin(newAccounts);
        }

        if (Object.keys(removedAccounts).length > 0) {
            handleAccountLogoff(removedAccounts);
        }
    });
};

fs.watchFile(accountFilePath, (curr, prev) => {
    console.log('accounts.json file changed, reloading accounts...');
    loadAccounts();
});

loadAccounts();

client.login(process.env.TOKEN);