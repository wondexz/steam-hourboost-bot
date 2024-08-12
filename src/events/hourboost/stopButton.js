const { EmbedBuilder, Colors } = require("discord.js");
const { deleteAccount } = require('../../functions/account');
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
        if (interaction.customId === "stop") {

            const xEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .setDescription("Henüz bir hesap eklememişsiniz `/hesap-ekle` komutunu kullanarak bir hesap oluşturun.")
            if (!db.has(interaction.user.id)) return interaction.reply({ embeds: [xEmbed], ephemeral: true })

                const { username } = db.get(interaction.user.id)

                deleteAccount(username)

                db.delete(`${interaction.user.id}_status`)

            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                .setDescription("Hesabınız kapatıldı!")

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}