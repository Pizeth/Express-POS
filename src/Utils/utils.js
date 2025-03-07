export class Utils {
  /**
   * Processes a message by adding optional prefix and postfix strings
   * @param {string} message - The main message to be processed
   * @param {string} [prefix=""] - String to be added before the message
   * @param {string} [postfix=""] - String to be added after the message
   * @param {boolean} [trim=true] - Whether to trim whitespace from the message
   * @returns {string} The processed message with prefix and postfix
   */
  static getIMsg(message, prefix = "", postfix = "", trim = true) {
    const processedMessage = trim ? message.trim() : message;
    return `${prefix}${processedMessage}${postfix}`;
  }
}

export default Utils;
