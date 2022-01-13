module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
}