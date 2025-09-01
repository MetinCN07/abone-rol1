
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const croxydb = require('croxydb');

client.commands = new Collection();
const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

client.once('ready', async () => {
    console.log('Bot hazır!');

    try {
        console.log('Slash komutları yükleniyor...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Slash komutları başarıyla yüklendi!');
    } catch (error) {
        console.error('Slash komutları yüklenirken bir hata oluştu:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client, croxydb);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
    }
});


client.login(token);

// Sunucu oluşturma ve proje aktivitesi sağlama.
const express = require('express');
const app = express();
const port = 13000;

// Web sunucu
app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log('Sunucu ${port} numaralı bağlantı noktasında yürütülüyor.`);
});

client.login(process.env.token)
