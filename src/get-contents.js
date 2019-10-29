const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');
const crypto = require('crypto');
const normalizeUrl = require('normalize-url');

class GetContents {
    constructor(trackId) {
        this._trackId = trackId;
    }

    _processHtml(html) {
        return html.replace(/\s\s+/g, ' ').replace(/(?=<!--)([\s\S]*?)-->/g, '').trim();
    }

    async _getHtml(uri) {
        return new Promise((resolve, reject) => {
            request(uri, (error, response, body) => {
                if (error) {
                    reject();
                    return;
                }

                resolve(this._processHtml(body));
            });
        });
    }

    _getLinksToVisit(html, linksSelector) {
        const $ = cheerio.load(html, { ignoreWhitespace: true });

        const links = [];
        $(linksSelector).each((index, link) => {
            const href = link.attribs['href'];
            if (href.charAt(0) === '#' || href === './') {
                return;
            }

            links.push(href);
        });

        return links;
    }

    _getContent(html, contentSelector) {
        const $ = cheerio.load(html, { ignoreWhitespace: true });

        return this._processHtml($(contentSelector).first().html());
    }

    async _sha256(message) {
        return crypto.createHash('sha256').update(message, 'utf8').digest('base64');
    }

    async execute(baseUri, uri, linksSelector, contentSelector, group, category) {
        const contents = {};

        const main = await this._getHtml(baseUri ? baseUri + uri : uri);
        const linksToVisit = this._getLinksToVisit(main, linksSelector);

        for await (const linkToVisit of linksToVisit) {
            const res = normalizeUrl(baseUri ? (baseUri + uri + linkToVisit) : (uri + linkToVisit));
            console.log(res);

            if (contents[res]) {
                continue;
            }

            const html = await this._getHtml(res);
            const content = this._getContent(html, contentSelector);

            contents[res] = {
                group,
                category,
                link: res.replace(baseUri, ''),
                trackId: this._trackId,
                sha256: await this._sha256(content),
                content
            };
        }

        return Object.values(contents);
    }
}

module.exports = GetContents;
