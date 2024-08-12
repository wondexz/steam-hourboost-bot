const { EmbedBuilder, Colors, WebhookClient } = require("discord.js");
const { addAccount } = require('../../functions/account');
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
        if (interaction.customId === "start") {

            const xEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .setDescription("Henüz bir hesap eklememişsiniz `/hesap-ekle` komutunu kullanarak bir hesap oluşturun.")
            if (!db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true })

            const { username, password, game } = db.get(interaction.user.id)

            const acc = {
                username,
                password,
                game
            }
            addAccount(acc)

            db.set(`${interaction.user.id}_status`, true)

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .setDescription("Hesabınız başlatıldı!")

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}