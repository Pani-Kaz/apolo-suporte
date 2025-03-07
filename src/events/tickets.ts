import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle, ThreadChannel } from "discord.js";
import { addMessageToThread } from "../handlers/handleComplaint";
import prisma from "../common/config/prisma";
import { ticketsOpened } from "../common/templates/ticketsOpened";
import { generateTranscriptData } from "../utils/transcriptUtils";
import { client } from "../common/config/client";
import { config } from "../common/config/bot";

export const name = "interactionCreate";
export const once = false;
export async function execute(interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) {
        if (interaction.isButton()) {
            if (interaction.customId === "ticket_close") {
                await interaction.deferUpdate();
                const data = await prisma.tickets.findFirst({
                    where: {
                        channel_id: interaction.channelId
                    }
                });
                if (!data) return await interaction.channel?.delete();


                const transcript = await generateTranscriptData(data.user_id, data.channel_id);
                await prisma.tickets.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        status: 'resolved',
                        transcript_data: transcript
                    }
                });
                await interaction.message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('Ticket')
                            .setFooter({
                                text: 'Suite do Apolo',
                                iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png'
                            })
                            .setDescription(`O ticket foi fechado por <@${interaction.user.id}>`)
                    ]
                });
                await (interaction.channel as ThreadChannel)?.setLocked(true);
                await (interaction.channel as ThreadChannel)?.setArchived(true);
                const user = await client.users.fetch(data.user_id).catch(() => {
                    return null;
                })
                const channel = interaction.channel as TextChannel;
                if (user) {
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setAuthor({
                            iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png',
                            name: 'Suite do Apolo'
                        })
                        .setTitle('Ticket Fechado')
                        .addFields(
                            {
                                name: `🆔 Id da denuncia`,
                                value: `${data.id}`,
                                inline: true,
                            },
                            {
                                name: `<:BVM_acertou2:1120062554941702254> Ticket de`,
                                value: `<@${data.user_id}>`,
                                inline: true,
                            },
                            {
                                name: `<:error:1096580230870732920> Fechado por`,
                                value: `<@${interaction.user.id || client.user?.id}>`,
                                inline: true,
                            },
                            {
                                name: `<:funcionrio_apolo:1129509892785447096> Aberto em`,
                                value: `<t:${channel.createdTimestamp}:F>`,
                                inline: true,
                            },
                        );
                    const transcriptButton = new ActionRowBuilder<ButtonBuilder>()
                        .setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel('Ir para o transcript')
                                .setURL(`${config.TICKETS_DATA}/${data.id}`)
                                .setEmoji('1129505065934278796')
                        );

                    (interaction.guild?.channels.cache.get(config.TICKETS_CLOSED || "") as TextChannel)?.send({
                        embeds: [
                            embed
                        ],
                        components: [transcriptButton]
                    })
                    user.send({
                        embeds: [
                            embed
                        ],
                        components: [transcriptButton]
                    }).catch(err => { })
                };
                const ticketsOpenedLogs = interaction.guild?.channels.cache.get(config.TICKETS_OPENED || "") as TextChannel;
                let message: any;
                const staffId = data?.staff_id;
                if (staffId) {
                    const msg = await ticketsOpenedLogs.messages.fetch(staffId).catch(() => {
                        return null
                    });
                    message = msg
                } else {
                    const message = null;
                };
                if(message) {
                    message.delete().catch(() => {})
                }
            }
        };
        return;
    };
    const { customId } = interaction;
    if (customId === "tickets_menu") {
        const ticketsOpenedToUser = await prisma.tickets.findFirst({
            where: {
                user_id: interaction.user.id,
                status: 'opened'
            }
        });
        if(ticketsOpenedToUser) return await interaction.reply({ content: 'Voce possui um ticket aberto, feche-o para abrir um novo!', flags: "Ephemeral" });

        await interaction.deferReply({ flags: "Ephemeral" });
        const category = interaction.values[0];
        const channel = interaction.channel as TextChannel;

        const thread = await channel.threads.create({
            name: `📨 ${interaction.user.username} - ${category}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
        });

        const closeButton = new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Fechar ticket")
            .setEmoji('1096580230870732920')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

        const welcome = await thread.send({
            content: `${interaction.user.toString()} <@&${config.SUPPORT_ID}>`,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Atendimento - ${category}`)
                    .setDescription(ticketsOpened.replace('{user}', interaction.user.toString()).replace('{category}', category))
                    .setColor('Yellow')
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setAuthor({
                        name: `Suite do Apolo`,
                        iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png'
                    })
                    .setTimestamp()
            ],
            components: [row]
        });
        await welcome.pin();
        await interaction.message.edit({});

        const joinTicket = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Ir para a thread')
                    .setURL(thread.url)
            )

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor({
                        name: 'Suite do Apolo',
                        iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png'
                    })
                    .setTitle('Ticket aberto com sucesso')
                    .setDescription(`Seu ticket foi aberto em <#${thread.id}>! Vá para ele utilizando o botão abaixo`)
                    .setFooter({
                        text: `Lembre-se de seguir as regras no ticket.`
                    })
            ],
            components: [
                joinTicket
            ]
        });
        const ticketsOpenedLogs = interaction.guild?.channels.cache.get(config.TICKETS_OPENED || "") as TextChannel;
        const msgLogs = await ticketsOpenedLogs.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTitle(`Um novo ticket foi aberto!`)
                    .addFields(
                        {
                            name: '<:detetive_apolo:1180578023104331868> Usuário',
                            value: `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: '🆔 Id',
                            value: `${interaction.user.id}`,
                            inline: true
                        },
                        {
                            name: '<:mensagem_apolo:1129505065934278796>  Categoria',
                            value: `${category}`,
                            inline: true
                        },
                    )
                    .setFooter({
                        text: `Vá para o ticket utilizando o botão abaixo.`
                    })
            ],
            components: [
                joinTicket
            ]
        })
        await prisma.tickets.create({
            data: {
                id: thread.id,
                user_id: interaction.user.id,
                channel_id: thread.id,
                type: category,
                staff_id: msgLogs.id,
                status: 'opened',
                transcript_data: ''
            }
        })

    }
}
