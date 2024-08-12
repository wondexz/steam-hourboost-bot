const { EmbedBuilder, Colors } = require("discord.js");
const db = require('croxydb');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === "status") {
            const game = db.get(interaction.user.id).game.toString();
            
            const xEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .setDescription("Henüz bir hesap eklememişsiniz `/hesap-ekle` komutunu kullanarak bir hesap oluşturun.")
            if (!db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor(db.get(`${interaction.user.id}_status`) ? Colors.Green : Colors.Red)
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .addFields(
                    { name: "Durum", value: db.get(`${interaction.user.id}_status`) ? "Hesabınız aktif" : "Hesabınız deaktif", inline: true },
                    {
                        name: "Oyun", value: `[${game
                            .replaceAll('730', 'Counter Strike 2 (CS2)')
                            .replaceAll('271590', 'Grand Theft Auto V (GTA 5)')
                            .replaceAll('1551360', 'Forza Horizon 5')
                            .replaceAll('1293830', 'Forza Horizon 4')
                            .replaceAll('252490', 'Rust')
                            .replaceAll('227300', 'Euro Truck Simulator 2 (ETS2)')
                            .replaceAll('440', 'Team Fortress 2 (TF2)')
                            .replaceAll('570', 'Dota 2')
                            .replaceAll('578080', 'PUBG: BATTLEGROUNDS')
                            .replaceAll('4000', 'Garry\'s Mod')
                            .replaceAll('2073850', 'The Finals')
                            .replaceAll('976310', 'Mortal Kombat 11')
                            .replaceAll('714210', 'Zula Türkiye')
                            .replaceAll('1144200', 'Ready or Not')
                            .replaceAll('10', 'Counter Strike (CS 1.6)')
                            .replaceAll('359550', 'Tom Clancy\'s Rainbow Six Siege (R6)')
                            .replaceAll('1172470', 'Apex Legends')
                            .replaceAll('1272080', 'PAYDAY 3')
                            .replaceAll('244210', 'Assetto Corsa')
                            .replaceAll('239140', 'Dying Light')
                            .replaceAll('1091500', 'Cyberpunk 2077')
                            .replaceAll('1238840', 'Battlefield 1')
                            .replaceAll('1238810', 'Battlefield V')
                            .replaceAll('1517290', 'Battlefield 2042')
                            .replaceAll('251570', '7 Days to Die')
                            }](https://steamcommunity.com/app/${db.get(interaction.user.id).game})`
                    }
                )

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}
