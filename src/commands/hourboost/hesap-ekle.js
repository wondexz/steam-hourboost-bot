const { EmbedBuilder, Colors, WebhookClient } = require("discord.js");
const db = require('croxydb');

module.exports = {
    name: "hesap-ekle",
    description: "Hourboost sistemi için hesap ekler.",
    options: [
        {
            type: 3,
            name: "kullanici-adi",
            description: "Steam kullanıcı adınızı yazınız.",
            required: true
        },
        {
            type: 3,
            name: "sifre",
            description: "Steam şifrenizi yazınız.",
            required: true
        },
        {
            type: 3,
            name: "oyun",
            description: "Steam üzerinden oynanacak oyunu seçiniz.",
            required: true,
            choices: [
                {
                    "name": "Counter Strike 2 (CS2)",
                    "value": "730"
                },
                {
                    "name": "Grand Theft Auto V (GTA 5)",
                    "value": "271590"
                },
                {
                    "name": "Forza Horizon 5",
                    "value": "1551360"
                },
                {
                    "name": "Forza Horizon 4",
                    "value": "1293830"
                },
                {
                    "name": "Rust",
                    "value": "252490"
                },
                {
                    "name": "Euro Truck Simulator 2 (ETS2)",
                    "value": "227300"
                },
                {
                    "name": "Team Fortress 2 (TF2)",
                    "value": "440"
                },
                {
                    "name": "Dota 2",
                    "value": "570"
                },
                {
                    "name": "PUBG: BATTLEGROUNDS",
                    "value": "578080"
                },
                {
                    "name": "Garry's Mod",
                    "value": "4000"
                },
                {
                    "name": "The Finals",
                    "value": "2073850"
                },
                {
                    "name": "Mortal Kombat 11",
                    "value": "976310"
                },
                {
                    "name": "Zula Türkiye",
                    "value": "714210"
                },
                {
                    "name": "Ready or Not",
                    "value": "1144200"
                },
                {
                    "name": "Counter Strike (CS 1.6)",
                    "value": "10"
                },
                {
                    "name": "Tom Clancy's Rainbow Six Siege (R6)",
                    "value": "359550"
                },
                {
                    "name": "Apex Legends",
                    "value": "1172470"
                },
                {
                    "name": "PAYDAY 3",
                    "value": "1272080"
                },
                {
                    "name": "Assetto Corsa",
                    "value": "244210"
                },
                {
                    "name": "Dying Light",
                    "value": "239140"
                },
                {
                    "name": "Cyberpunk 2077",
                    "value": "1091500"
                },
                {
                    "name": "Battlefield 1",
                    "value": "1238840"
                },
                {
                    "name": "Battlefield V",
                    "value": "1238810"
                },
                {
                    "name": "Battlefield 2042",
                    "value": "1517290"
                },
                {
                    "name": "7 Days to Die",
                    "value": "251570"
                }
            ]
        }
    ],
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        const username = interaction.options.getString("kullanici-adi");
        const password = interaction.options.getString("sifre");
        const gameString = interaction.options.getString("oyun");
        const game = parseFloat(gameString);

        const xEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Zaten bir hesap eklemişsin hesabını değiştirmek istersen `/hesap-sil` komutunu kullanarak hesabını silebilirsin.")
        if (db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Hesabınız başarıyla eklendi `/panel` komutuyla başlatma ve durdurma işlemlerini yapabilirsiniz")

        db.set(interaction.user.id, {
            username,
            password,
            game
        });

        db.set(username, {
            id: interaction.user.id,
            password,
            game
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
