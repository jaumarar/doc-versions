const HtmlResourcesProvider = require('providers/resources/html');
const resources = require('config/resources');
const database = require('providers/database');
const resourceUtils = require('providers/resources/resources.util');
const _ = require('lodash');

function getResourceByCode(resourceName) {
  return resources.find(({ code }) => code === resourceName);
}

async function pull(resourceCode) {
  const resource = getResourceByCode(resourceCode);
  const trackId = resourceUtils.generateTrackId();

  const htmlResourcesProvider = new HtmlResourcesProvider();
  const contents = await htmlResourcesProvider.get(resource);

  const [resourceDatabase] = await database.get().Resource.findOrCreate({ where: { code: resourceCode }, defaults: {
      code: resource.code,
      baseUri: resource.baseUri
    }
  });

  const pull = await database.get().Pull.create({ trackId, ResourceId: resourceDatabase.id });

  const rows = contents.map((content) => {
    return {
      ...content,
      PullId: pull.id
    };
  });

  await database.get().Content.bulkCreate(rows);

  return contents;
}

async function compare(pullId1, pullId2) {
  const pull1 = await database.get().Content.findAll( { where: { PullId: pullId1 } });
  const pull2 = await database.get().Content.findAll( { where: { PullId: pullId2 } });

  const areEquals = pull1.filter((content1) => pull2.some((content2) => content1.category === content2.category && content1.url === content2.url && content1.sha256 === content2.sha256));

  const areDiffs = pull1.reduce((diffs, content1) => {
    const content2 = pull2.find((content2) => content1.category === content2.category && content1.url === content2.url && content1.sha256 !== content2.sha256);

    if (content2) {
      diffs.push([
        content1,
        content2
      ]);
    }

    return diffs;
  }, []);

  const areRemoved = pull1.filter((content1) => !pull2.some((content2) => content1.category === content2.category && content1.url === content2.url));

  const areNew = pull2.filter((content2) => !pull1.some((content1) => content1.category === content2.category && content1.url === content2.url));

  return {
    areEquals,
    areDiffs,
    areRemoved,
    areNew
  };
}

module.exports = {
  pull,
  compare
};
