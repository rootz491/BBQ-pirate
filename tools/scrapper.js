const cheerio = require('cheerio');
const request = require('request-promise');
require('dotenv').config();

module.exports = (client) => {
    request('http://h1.nobbd.de', (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
            const today = new Date().getDate();
            const reports = [];
    
            const reportsNode = $('#reports-all').children();
            reportsNode.each((i, data) => {
                const report = $(data);
                const date = report.find('.date').text();
                const reportData = $(data).children();
                const program = reportData.find('.company').text();
                const title = reportData.find('.title').text();
                const link = reportData.find('.title').attr('href');

                const repDate = date.split(' ')[0];
                if (!link || repDate != today) return;

                reports.push({
                    program,
                    title,
                    link,
                    date
                })
            });

            if (reports.length > 0) {
                //  construct a message
                let message = '';
                for (const report of reports) {
                    message += `***${report.program}***: ${report.title} \n(${report.date})\n${report.link}\n\n`;
                }
                //send message to channel
                const guild = client.guilds.cache.get(process.env.GUILD_ID);
                if (message.length > 2000) {
                    while(message.length > 2000) {
                        const part = message.substring(0, 2000);
                        message = message.substring(2000);
                        guild.channels.cache.find(channel => channel.id === "931264277510246400").send(part);
                    }
                } else {
                    guild.channels.cache.find(channel => channel.id === "931264277510246400").send(message);
                }

            } else {
                console.log('No new reports');
                guild.channels.cache.find(channel => channel.id === "931264277510246400").send("No new reports today!");
            }

        } else {
            console.log('error', error);
            return false;
        }
    });
}
