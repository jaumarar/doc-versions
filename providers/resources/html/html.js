const resourceUtils = require('providers/resources/resources.util');
const GetContents = require('providers/resources/html/get-contents');
const ResourcesProvider = require('providers/resources/resources.abstract');

class HtmlResourcesProvider extends ResourcesProvider {
  async get(resource) {
    super.get(resource);
    const getContents = new GetContents(resource.baseUri);

    const contents = [];

    // Usage of for instead of reduce to avoid making a mess (reduce of async are Promises)
    for await (const category of resource.categories) {
      const categoryName = category.name;
      /**
       * Selector to find other links to visit inside the page
       */
      const linksSelector = category.linksSelector || resource.linksSelector;
      /**
       * Inside each page with selector is used for the content
       */
      const contentSelector = category.contentSelector || resource.contentSelector;

      const contentsGroupedByUrl = await getContents.execute(category.uri, linksSelector, contentSelector);

      for (const [url, content] of Object.entries(contentsGroupedByUrl)) {
        contents.push({
          category: categoryName,
          url: '/' + url.replace(resource.baseUri, ''),
          sha256: resourceUtils.generateSha(content),
          content
        });
      }
    }

    return contents;
  }
}

module.exports = HtmlResourcesProvider;
