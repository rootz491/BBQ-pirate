const path = require('path');
const fs = require('fs');
const cron = require('cron');
const scrapper = require('./tools/scrapper');
const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

/*
* Handling Events */
// read all files in the events directory (as each file is an event)
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/*
* CRON JOB to send `GM` everyday */
let scheduledMessage = new cron.CronJob('00 50 23 * * *', () => {
	//orderd in seconds- minutes- hours

    // scrape reports
    scrapper(client);
});

scheduledMessage.start();

// login to discord
client.login(process.env.BOT_TOKEN);