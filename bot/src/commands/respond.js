/**
 * Send a standalone bot message with a small visual buffer around it.
 *
 * The zero-width space keeps Discord from trimming the otherwise empty lines.
 * This is intentionally not a reply: edited source messages must not alter
 * the context preview of earlier translation results.
 */
export function sendStandalone(message, content) {
  return message.channel.send(`\u200b\n${content}\n\u200b`);
}
