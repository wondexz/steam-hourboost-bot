const { EmbedBuilder, Colors, WebhookClient } = require("discord.js");
const db = require('croxydb');
const { deleteAccount } = require('../../functions/account');

module.exports = {
    name: "hesap-sil",
    description: "Hourboost sistemi için hesap siler.",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {

        const xEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Zaten bir hesap eklememişsiniz.")
        if (!db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Hesabınız silindi!")


        const data = db.get(interaction.user.id)
        deleteAccount(data.username)

        interaction.reply({ embeds: [embed] });
    }
};