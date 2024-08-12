const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Botun pingini gösterir.",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
            .setDescription(`${client.ws.ping.toString()}ms`)

        interaction.reply({ embeds: [embed] });
    }
};