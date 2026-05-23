const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const fs = require('fs');

/* ========= BOT CONFIG ========= */
/* PASTE YOUR NEW TOKEN BELOW */
const TOKEN = process.env.TOKEN;

/* YOUR CLIENT ID */
const CLIENT_ID = process.env.CLIENT_ID;

/* ========= CLIENT ========= */

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ========= DATABASE ========= */

let data = JSON.parse(fs.readFileSync('./data.json'));

function saveData() {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

/* ========= FUNCTIONS ========= */

function getColor(star) {
  if (star === 5) return 0x2ecc71;
  if (star === 4) return 0x27ae60;
  if (star === 3) return 0xf1c40f;
  if (star === 2) return 0xe67e22;
  return 0xe74c3c;
}

function starDisplay(star) {
  return "⭐".repeat(star);
}

/* ========= SLASH COMMANDS ========= */

const commands = [

  /* ADD MOD NAME */
  new SlashCommandBuilder()
    .setName('addmodname')
    .setDescription('Add a mod/product name')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Mod name')
        .setRequired(true)
    ),

  /* REVIEW */
  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a review')
    .addStringOption(option =>
      option
        .setName('mod')
        .setDescription('Select mod')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(option =>
      option
        .setName('star')
        .setDescription('1-5 stars')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addStringOption(option =>
      option
        .setName('review')
        .setDescription('Your review')
        .setRequired(true)
    ),

  /* SET CHANNEL */
  new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Set review channel')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel for reviews')
        .setRequired(true)
    ),

  /* RATING */
  new SlashCommandBuilder()
    .setName('rating')
    .setDescription('Check overall rating')
];

/* ========= REGISTER COMMANDS ========= */

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {

    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: commands.map(command => command.toJSON())
      }
    );

    console.log("Slash commands registered.");

  } catch (error) {
    console.error(error);
  }
})();

/* ========= BOT EVENTS ========= */

client.on('interactionCreate', async interaction => {

  const guildId = interaction.guildId;

  /* CREATE SERVER DATA */
  if (!data.servers[guildId]) {
    data.servers[guildId] = {
      reviewChannel: null,
      reviews: {},
      mods: []
    };

    saveData();
  }

  const server = data.servers[guildId];

  /* ========= AUTOCOMPLETE ========= */

  if (interaction.isAutocomplete()) {

    const focused = interaction.options.getFocused();

    const filtered = server.mods
      .filter(mod =>
        mod.toLowerCase().includes(focused.toLowerCase())
      )
      .slice(0, 25);

    await interaction.respond(
      filtered.map(mod => ({
        name: mod,
        value: mod
      }))
    );

    return;
  }

  if (!interaction.isChatInputCommand()) return;

  /* ========= ADD MOD NAME ========= */

  if (interaction.commandName === 'addmodname') {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "❌ Admin only.",
        ephemeral: true
      });
    }

    const modName = interaction.options.getString('name');

    if (server.mods.includes(modName)) {
      return interaction.reply({
        content: "❌ Mod already exists.",
        ephemeral: true
      });
    }

    server.mods.push(modName);

    saveData();

    return interaction.reply({
      content: `✅ Mod **${modName}** added successfully.`,
      ephemeral: true
    });
  }

  /* ========= SET CHANNEL ========= */

  if (interaction.commandName === 'setchannel') {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "❌ Admin only.",
        ephemeral: true
      });
    }

    server.reviewChannel =
      interaction.options.getChannel('channel').id;

    saveData();

    return interaction.reply({
      content: "✅ Review channel set successfully.",
      ephemeral: true
    });
  }

  /* ========= REVIEW ========= */

  if (interaction.commandName === 'review') {

    if (!server.reviewChannel) {
      return interaction.reply({
        content: "❌ Review channel not set.",
        ephemeral: true
      });
    }

    const userId = interaction.user.id;

    /* ONE REVIEW PER USER */
    const alreadyReviewed = Object.values(server.reviews)
      .find(review => review.userId === userId);

    if (alreadyReviewed) {
      return interaction.reply({
        content: "❌ You already submitted a review.",
        ephemeral: true
      });
    }

    const modName =
      interaction.options.getString('mod');

    if (!server.mods.includes(modName)) {
      return interaction.reply({
        content: "❌ Invalid mod selected.",
        ephemeral: true
      });
    }

    const star =
      interaction.options.getInteger('star');

    const reviewText =
      interaction.options.getString('review');

    /* CREATE REVIEW ID */
    data.lastReviewId++;

    const reviewId = data.lastReviewId;

    /* SAVE REVIEW */
    server.reviews[reviewId] = {
      userId,
      mod: modName,
      star,
      review: reviewText
    };

    saveData();

    /* SEND EMBED */
    const channel =
      await client.channels.fetch(server.reviewChannel);

    const embed = new EmbedBuilder()
      .setColor(getColor(star))
      .setAuthor({
        name: `${modName} • Review`
      })
      .setDescription(reviewText)
      .addFields(
        {
          name: "⭐ Rating",
          value: starDisplay(star),
          inline: false
        },
        {
          name: "👤 Reviewer",
          value: `<@${userId}>`,
          inline: true
        },
        {
          name: "🆔 Review ID",
          value: `#${reviewId}`,
          inline: true
        }
      )
      .setFooter({
        text: "revvbot Reviews"
      })
      .setTimestamp();

    await channel.send({
      embeds: [embed]
    });

    return interaction.reply({
      content: `✅ Review submitted successfully. Review ID: #${reviewId}`,
      ephemeral: true
    });
  }

  /* ========= RATING ========= */

  if (interaction.commandName === 'rating') {

    const reviews =
      Object.values(server.reviews);

    if (reviews.length === 0) {
      return interaction.reply("No reviews yet.");
    }

    const total =
      reviews.reduce((sum, review) =>
        sum + review.star, 0);

    const average =
      (total / reviews.length).toFixed(1);

    return interaction.reply(
      `⭐ Overall Rating: **${average}/5** (${reviews.length} reviews)`
    );
  }

});

/* ========= BOT LOGIN ========= */

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);