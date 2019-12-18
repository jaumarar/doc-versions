const cheerio = require('cheerio');
const request = require('request');
const resourceUtils = require('providers/resources/resources.util');
const normalizeUrl = require('normalize-url');

class GetContents {
  constructor(baseUri) {
    this._baseUri = baseUri;
  }

  async _getHtml(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          reject(error);

          return;
        }

        const html = resourceUtils.sanitizeHtml(body);

        resolve(html);
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

    const content = $(contentSelector).first().html();

    return resourceUtils.sanitizeHtml(content);
  }

  async execute(uri, linksSelector, contentSelector) {
    const contentsGroupedByUrl = {};

    const path = this._baseUri ? this._baseUri + uri : uri;

    const mainHtml = await this._getHtml(path);
    const linksToVisit = this._getLinksToVisit(mainHtml, linksSelector);

    for await (const linkToVisit of linksToVisit) {
      const url = normalizeUrl(path + linkToVisit);

      if (contentsGroupedByUrl[url]) {
        continue;
      }

      console.log(url);

      const html = await this._getHtml(url);
      contentsGroupedByUrl[url] = this._getContent(html, contentSelector);
    }

    return contentsGroupedByUrl;
  }
}

module.exports = GetContents;
