class MessageEmbed {
  /**
   * Set the title of the embed
   * @param {string} title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    if (typeof title !== "string") throw new Error("Title must be a string");
    if (title.length > 256)
      throw new Error("Title must be less than 256 characters");
    this.title = title;
    return this;
  }

  /**
   * Set the description of the embed
   * @param {string} description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    if (typeof description !== "string")
      throw new Error("Description must be a string");
    if (description.length > 2048)
      throw new Error("Description must be less than 2048 characters");
    this.description = description;
    return this;
  }

  /**
   * Set a URL for the embed
   * @param {String} url
   * @returns {MessageEmbed}
   */
  setURL(url) {
    if (typeof url !== "string") throw new Error("URL must be a string");
    let regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!regex.test(url)) throw new Error("URL must be a valid http/https url");
    this.url = url;
    return this;
  }

  /**
   * Set the color of the embed
   * @param {string | number} color
   * @returns {MessageEmbed}
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
        else
          throw new Error("Color must be a hex string or a valid color name");
        break;

      case "number":
        if (color < 0 || color > 16777215)
          throw new Error("Color must be between 0 and 16777215");
        break;

      default:
        throw new Error("Color must be a hex string or a valid color name");
    }

    return this;
  }

  setFooter(footer = {}) {
    if (typeof footer.text !== "string")
      throw new Error("Footer text must be a string");
    if (footer.text.length > 2048)
      throw new Error("Footer text must be less than 2048 characters");

    this.footer = {
      text: footer.text,
      icon_url: footer.iconURL,
    };

    return this;
  }

  /**
   * Set the time for the embed
   * @param {Date} time
   * @returns
   */
  setTimestamp(timestamp = new Date().toISOString()) {
    if (timestamp instanceof Date) throw new Error("Timestamp must be a date");
    this.timestamp = timestamp.toISOString();
    return this;
  }

  /**
   * Set the thumbnail for the embed
   * @param {string} url
   * @returns {MessageEmbed}
   * @example
   * embed.setThumbnail('https://i.imgur.com/sINzKh7.png');
   */
  setThumbnail(thumbnail) {
    if (typeof thumbnail !== "string")
      throw new Error("Thumbnail must be a string");
    let regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!regex.test(thumbnail))
      throw new Error("Thumbnail must be a valid http/https url");
    if (thumbnail.length > 1024)
      throw new Error("Thumbnail url must be less than 1024 characters");
    this.thumbnail = {
      url: thumbnail,
    };
    return this;
  }

  /**
   * Set the image for the embed
   * @param {string} url
   * @returns {MessageEmbed}
   * @example
   * embed.setImage('https://i.imgur.com/sINzKh7.png');
   */
  setImage(image) {
    if (typeof image !== "string") throw new Error("Image must be a string");
    let regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!regex.test(image))
      throw new Error("Thumbnail must be a valid http/https url");
    if (image.length > 1024)
      throw new Error("Image url must be less than 1024 characters");
    this.image = {
      url: image,
    };
    return this;
  }

  /**
   * Set the author for the embed
   * @param {Object} author
   * @returns {MessageEmbed}
   * @example
   * embed.setAuthor('Guilded', 'https://i.imgur.com/sINzKh7.png', 'https://guilded.gg');
   */
  setAuthor(author = {}) {
    if (!author.name) throw new Error("Author name must be provided");
    if (typeof author.name !== "string")
      throw new Error("Author name must be a string");
    if (author.name.length > 256)
      throw new Error("Author name must be less than 256 characters");

    this.author = {
      name: author.name,
      icon_url: author.iconURL,
      url: author.url,
    };

    return this;
  }

  /**
   * Set the fields for the embed, all fields must be an array of field objects
   * @param {Array} fields
   * @returns {MessageEmbed}
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
    if (!Array.isArray(fields)) throw new Error("Fields must be an array");
    if (fields.length > 25) throw new Error("Fields must be less than 25");
    let newFields = [];
    fields.forEach((field) => {
      if (!field.name)
        throw new Error(
          `The field number ${fields.indexOf(field) + 1} must have a name`
        );
      if (typeof field.name !== "string")
        throw new Error(
          `The field number ${fields.indexOf(field) + 1} name must be a string`
        );
      if (field.name.length > 256)
        throw new Error(
          `The field number ${
            fields.indexOf(field) + 1
          } name must be less than 256 characters`
        );
      if (!field.value)
        throw new Error(
          `The field number ${fields.indexOf(field) + 1} must have a value`
        );
      if (typeof field.value !== "string")
        throw new Error(
          `The field number ${fields.indexOf(field) + 1} value must be a string`
        );
      if (field.value.length > 1024)
        throw new Error(
          `The field number ${
            fields.indexOf(field) + 1
          } value must be less than 1024 characters`
        );
      if (field.inline && typeof field.inline !== "boolean")
        throw new Error(
          `The field number ${
            fields.indexOf(field) + 1
          } inline must be a boolean`
        );
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
   * @param {Object} field
   * @returns {MessageEmbed}
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
    if (typeof name !== "string")
      throw new Error("Field name must be a string");
    if (name.length > 256) throw new Error("Field name must be less than 256");
    if (typeof value !== "string")
      throw new Error("Field value must be a string");
    if (value.length > 1024)
      throw new Error("Field value must be less than 1024");
    if (typeof inline !== "boolean")
      throw new Error("Field inline must be a boolean");

    this.fields.push({
      name: name,
      value: value,
      inline: inline,
    });

    return this;
  }
}

module.exports.MessageEmbed = MessageEmbed;
