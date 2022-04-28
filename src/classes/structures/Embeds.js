

class MessageEmbed {

    setTitle(title) {
        this.title = title;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setURL(url) {
        this.url = url;
        return this;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    setColor(color) {

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
        }

        if ((typeof color === 'string') && (color.startsWith('#'))) {
            //Convert hex to int
            color = parseInt(color.replace('#', ''), 16);
        } else if ((typeof color === 'string') && (color.startsWith('0x'))) {
            //Convert hex to int
            color = parseInt(color.replace('0x', ''), 16);
        } else if ((typeof color === 'string' && (colors[color]))) {
            color = colors[color];
        } else if ((typeof color === 'string' && (color.toLowerCase() === 'random'))) {
            color = Math.floor(Math.random() * 16777215);
        } else if ((typeof color === 'integer' && (color < 0 || color > 16777215))) {
            throw new Error('Color must be between 0 and 16777215');
        }

        this.color = color;
        return this;
    }



    setFooter(footer = {}) {
        let footer_text = footer.text
        let footer_icon_url = footer.icon_url || null;

        if (typeof footer_text === 'undefined') {
            throw new Error('Footer text is required');
        }

        this.footer = {
            text: footer_text,
            
        };

        if (footer_icon_url) {
            this.footer.icon_url = footer_icon_url;
        }

        return this;

    }

    setImage(image) {
        this.image = {
            url: image
        };
        return this;

    }

    setThumbnail(thumbnail) {
        this.thumbnail = {
            url: thumbnail
        }
        return this;

    }

    setAuthor(author = {}) {
        let author_name = author.name
        let author_icon_url = author.icon_url || null;
        let author_url = author.url || null;

        if (typeof author_name === 'undefined') {
            throw new Error('Author name is required');
        }

        this.author = {
            "name": author_name,
        };

        if (author_url) {
            this.author.url = author_url;
        }

        if (author_icon_url) {
            this.author.icon_url = author_icon_url;
        }


        return this;

    }

    setFields(fields = []) {
        this.fields = fields;
        return this;

    }

    addField(name, value, inline = false) {

        if (!this.fields) {
            this.fields = [];
        }

        this.fields.push({
            name: name,
            value: value,
            inline: inline
        });

        return this;

    }

    setTimestamp(timestamp = new Date()) {

        //Format to ISO 8601
        timestamp = (new Date(timestamp)).toISOString();

        this.timestamp = timestamp;
        return this;

    }
}

module.exports.MessageEmbed = MessageEmbed;