import { randomLine } from '../personality.js';

/**
 * Announces new members when WELCOME_CHANNEL_ID is configured.
 *
 * Invite attribution and role assignment are intentionally not guessed here;
 * they will be added as separate, testable steps later.
 */
export async function announceMemberJoin(member, welcomeChannelId) {
  if (!welcomeChannelId) {
    return;
  }

  const channel = member.guild.channels.cache.get(welcomeChannelId);
  if (!channel?.isTextBased()) {
    console.warn(`[beq] Begrüßungskanal nicht gefunden oder nicht beschreibbar: ${welcomeChannelId}`);
    return;
  }

  const text = randomLine('welcome').replaceAll('{user}', `<@${member.id}>`);
  await channel.send(`\u200b\n${text}\n\u200b`);
}
