const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('test-premium')
        .setDescription('null'),
        async execute(interaction) {
            interaction.reply({ content: `You are a premium`, ephemeral: true })
        }
}