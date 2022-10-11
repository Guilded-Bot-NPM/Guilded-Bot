/**
 * This class is used to create embeds for guilded messages
 */
class MessageEmbed {
  /**
   * Set the title of the embed
   * @param {string} title - The title of the embed
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setTitle('This is a title');
   */
  setTitle(title) {
    if (typeof title !== "string") return this;
    if (title.length > 256) return this;
    this.title = title;
    return this;
  }

  /**
   * Set the description of the embed
   * @param {string} description - The description of the embed
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setDescription('This is a description');
   */
  setDescription(description) {
    if (typeof description !== "string") return this;
    if (description.length > 2048) return this;
    this.description = description;
    return this;
  }

  /**
   * Set a URL for the embed
   * @param {String} url - The URL
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setURL('https://guilded.gg');
   */
  setURL(url) {
    if (typeof url !== "string") return this;
    //Create a regex to check if the url is valid, valid url: https://www.google.com, http://www.google.com, https://google.com?test=1, http://google.com?test=1&test2=2
    let regex = /(https?:\/\/[^\s]+)/gi;
    if (!regex.test(url)) return this;
    this.url = url;
    return this;
  }

  /**
   * Set the color of the embed
   * @param {string | number} color - The color of the embed
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setColor('#0099ff');
   * embed.setColor(0x0099ff);
   * embed.setColor('grey');
   * embed.setColor('RANDOM');
   * embed.setColor('RED');
   */
  setColor(color = null) {
    const colors = {
      red: 16711680,
      green: 65280,
      blue: 255,
      yellow: 16776960,
      purple: 8388736,
      orange: 16753920,
      grey: 10066329,
      lightgrey: 13421772,
      darkgrey: 3355443,
      lightred: 16729344,
      lightgreen: 16776960,
      lightblue: 16775416,
      lightyellow: 16774638,
      lightpurple: 16740352,
      lightorange: 16756736,
      pink: 16761035,
      lightpink: 16737792,
      lightteal: 16773077,
      lightcyan: 16744448,
      lightmagenta: 16738885,
      teal: 8421376,
      cyan: 65535,
      magenta: 255,
      gold: 16766720,
      lightgold: 16759920,
      darkgold: 13369344,
      darkorange: 13382297,
      darkpink: 13382451,
      darkteal: 13395559,
      darkcyan: 13395457,
      darkmagenta: 13382297,
      darkgrey: 10066329,
      darkred: 16711680,
      darkgreen: 65280,
      darkblue: 255,
      darkyellow: 16776960,
      darkpurple: 8388736,
      chucknorris: 15787699,
    };

    switch (typeof color) {
      case "string":
        if (color.startsWith("#")) color = parseInt(color.replace("#", ""), 16);
        else if (color.startsWith("0x"))
          color = parseInt(color.replace("0x", ""), 16);
        else if (colors[color]) color = colors[color];
        else if (color.toLowerCase() === "random")
          color = Math.floor(Math.random() * 16777215);
        else return this;
        break;

      case "number":
        if (color < 0 || color > 16777215) return this;
        break;
    }

    this.color = color;
    return this;
  }

  /**
   * Set the footer for the embed
   * @param {Object} footer - The footer object
   * @param {string} footer.text - The text of the footer
   * @param {string | undefined} footer.icon - The icon of the footer
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setFooter({text: 'This is a footer', icon: 'https://i.imgur.com/sINzKh7.png'});
   */
  setFooter(footer = {}) {
    if (typeof footer.text !== "string") return this;
    if (footer.text.length > 2048) return this;

    this.footer = {
      text: footer.text,
      icon_url: footer.iconURL,
    };

    return this;
  }

  /**
   * Set the time for the embed
   * @param {Date | undefined} date - The date for the embed
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setTime(new Date());
   * embed.setTime(Date.now());
   */
  setTimestamp(timestamp = new Date()) {
    if (!(timestamp instanceof Date)) return this;
    this.timestamp = timestamp.toISOString();
    return this;
  }

  /**
   * Set the thumbnail for the embed
   * @param {string} url - The url of the thumbnail
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setThumbnail('https://i.imgur.com/sINzKh7.png');
   */
  setThumbnail(thumbnail) {
    if (typeof thumbnail !== "string") return this;
    let regex = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg|webp))/gi;
    if (!regex.test(thumbnail)) return this;
    if (thumbnail.length > 1024) return this;
    this.thumbnail = {
      url: thumbnail,
    };
    return this;
  }

  /**
   * Set the image for the embed
   * @param {string} url - The url of the image
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setImage('https://i.imgur.com/sINzKh7.png');
   */
  setImage(image) {
    if (typeof image !== "string") return this;
    // Create a regex to test for a valid url, example: https://i.imgur.com/sINzKh7.png, https://img.guildedcdn.com/UserAvatar/63d207d85e1a5225ec16377f72b8867e-Large.webp?w=450&h=450, https://google.com, http://google.com, etc. Supports ?size=1024, etc.
    let regex = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg|webp))/gi;
    if (!regex.test(image)) return this;
    if (image.length > 1024) return this;
    this.image = {
      url: image,
    };
    return this;
  }

  /**
   * Set the author for the embed
   * @param {Object} author - The author object
   * @param {string} author.name - The name of the author
   * @param {string | undefined} author.icon - The icon of the author
   * @param {string | undefined} author.url - The url of the author
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setAuthor({name: 'Guilded', icon: 'https://i.imgur.com/sINzKh7.png', url: 'https://guilded.gg'});
   */
  setAuthor(author = {}) {
    if (!author.name) return this;
    if (typeof author.name !== "string") return this;
    if (author.name.length > 256) return this;

    this.author = {
      name: author.name,
      icon_url: author.iconURL,
      url: author.url,
    };

    return this;
  }

  /**
   * Set the fields for the embed, all fields must be an array of field objects
   * @param {Array<field>} fields - The fields for the embed
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.setFields([
   *  {
   *      name: 'Field 1',
   *      value: 'This is field 1',
   *      inline: true
   *  },
   *  {
   *      name: 'Field 2',
   *      value: 'This is field 2',
   *      inline: false
   *  }
   * ]);
   */
  setFields(fields = []) {
    if (!Array.isArray(fields)) return this;
    if (fields.length > 25) return this;
    let newFields = [];
    fields.forEach((field) => {
      if (!field.name) return this;
      if (typeof field.name !== "string") return this;
      if (field.name.length > 256) return this;
      if (!field.value) return this;
      if (typeof field.value !== "string") return this;
      if (field.value.length > 1024) return this;
      if (field.inline && typeof field.inline !== "boolean") return this;
      newFields.push({
        name: field.name,
        value: field.value,
        inline: field.inline ?? false,
      });
    });
    this.fields = newFields;
    return this;
  }

  /**
   * Add a field to the embed
   * @param {field} field - The field to add
   * @returns {MessageEmbed} - The embed
   * @example
   * embed.addField({
   *    name: 'Field 1',
   *    value: 'This is field 1',
   *    inline: true
   * });
   * embed.addField({
   *    name: 'Field 2',
   *    value: 'This is field 2',
   *    inline: false
   * });
   */
  addField(name, value, inline = false) {
    if (typeof name !== "string") return this;
    if (name.length > 256) return this;
    if (typeof value !== "string") return this;
    if (value.length > 1024) return this;
    if (typeof inline !== "boolean") return this;

    if (!this.fields) this.fields = [];
    if (this.fields.length > 25) return this;

    this.fields.push({
      name: name,
      value: value,
      inline: inline,
    });

    return this;
  }
}

module.exports = MessageEmbed;
