const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
const db = require('croxydb');

module.exports = {
    name: "panel",
    description: "Steam hesap panelini gösterir.",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        const xEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Henüz bir hesap eklememişsiniz `/hesap-ekle` komutunu kullanarak bir hesap oluşturun.")
        if (!db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor("#222cb9")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription("Aşağıdaki butonlardan hesabınızı kontrol edebilirsiniz.")

            const startButton = new ButtonBuilder()
            .setCustomId('start')
            .setLabel('Hourboost\'u başlat')
            .setStyle(ButtonStyle.Success)

            const stopButton = new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('Hourboost\'u kapat')
            .setStyle(ButtonStyle.Success)

            const statusButton = new ButtonBuilder()
            .setCustomId('status')
            .setLabel("Hesap Durumu")
            .setStyle(ButtonStyle.Success)

            const row = new ActionRowBuilder()
            .addComponents(startButton, stopButton, statusButton)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};