const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const premiumSchema = require('../../Models/Premium');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('Premium system!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('Get a list of premium users!')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('add an user to premium!')
                .addUserOption((options) =>
                    options
                        .setName('user')
                        .setDescription('add an user!')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove premium from the user!')
                .addUserOption((options) =>
                    options
                        .setName('user')
                        .setDescription('user you want to delete!')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('<:no:1047525631195357184> Mistake!')
            .setDescription(`You are not the owner of the bot!`)
            .setColor(`#FF0000`)
            .setTimestamp()
        if (interaction.user.id !== '770613024129417256') return interaction.reply({ embeds: [errorEmbed] });

        const { options } = interaction;

        const subcommand = options.getSubcommand();
        const user = options.getUser('user');

        if (subcommand === 'list') {
            premiumSchema.find({}, async (err, data) => {
                if (err) throw err;
                if (data) {
                    const embed = new EmbedBuilder()
                        .setTitle('📋・List Premium!')
                        .setDescription(`<:square:1071758776836829185> ${data.map((d) => `<@${d.userId}> \`${d.userId}\``).join('\n <:square:1071758776836829185>') || '\` No premium users found! \`'}`)
                        .setColor(`Random`)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })
                }
            })
        }

        if (subcommand === 'add') {
            premiumSchema.findOne({ userId: user.id }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    premiumSchema.create({
                        userId: interaction.user.id
                    })
                    const embed2 = new EmbedBuilder()
                        .setTitle('<:yes:1047525625746960404>・added Premium!')
                        .setDescription(`Successfully added ${user} to premium list!`)
                        .setColor(`Random`)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed2] });
                }
                const embed3 = new EmbedBuilder()
                    .setTitle('<:no:1047525631195357184>・Błąd!')
                    .setDescription(`${user} posiada premium!`)
                    .setColor(`#FF0000`)
                    .setTimestamp()
                if (data) return interaction.reply({ embeds: [embed3] })
            })
        }

        if (subcommand === 'remove') {
            await premiumSchema.findOneAndDelete({ userId: user.id }, async (err, data) => {
                if (err) throw err;
                const embed4 = new EmbedBuilder()
                    .setTitle('<:yes:1047525625746960404>・Premium removed!')
                    .setDescription(`Successfully removed ${user} from premium list!`)
                    .setColor(`Random`)
                    .setTimestamp()

                const embed5 = new EmbedBuilder()
                    .setTitle('<:no:1047525631195357184>・Mistake!')
                    .setDescription(`${user} does not have a premium!`)
                    .setColor(`#FF0000`)
                    .setTimestamp()
                if (!data) return interaction.reply({ embeds: [embed5] });
                if (data) interaction.reply({ embeds: [embed4] });
            })
        }
    }
}