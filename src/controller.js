const database = require('./../database');
const GetContents = require('./get-contents');
const GetChanges = require('./get-changes');

const resources = [
    {
        group: 'BookingCom',
        table: 'contents',
        contentSelector: '.content-inner',
        baseUri: 'https://connect.booking.com/user_guide/site/en-US/',
        contents: [
            {
                category: 'content',
                linksSelector: '.secondary-sidebar #Content a',
                uri: '/content/'
            },
            {
                category: 'ari',
                linksSelector: '.secondary-sidebar #Rates a',
                uri: '/ari/'
            },
            {
                category: 'api',
                linksSelector: '.secondary-sidebar #APIReference a',
                uri: '/api-reference/'
            }
        ]
    }
];

function getGroup(group) {
    for (const resource of resources) {
        if (group === resource.group) {
            return resource;
        }
    }
}

async function update(groupName) {
    const trackId = new Date().getTime();
    const group = getGroup(groupName);

    for (const content of group.contents) {
        const getContents = new GetContents(trackId);

        const uri = content.uri;
        const linksSelector = content.linksSelector || group.linksSelector;
        const contentSelector = content.contentSelector || group.contentSelector;

        // Download all
        const rows = await getContents.execute(group.baseUri, uri, linksSelector, contentSelector, group.group, content.category);

        // Insert all
        for (const row of rows) {
            database.models[group.table].create(row);
        }
    }

    return {
        success: true
    };
}

async function diffs() {
    const getChanges = new GetChanges();

    return getChanges.execute();
}

async function clear(groupName) {
    const group = getGroup(groupName);

    return database.models[group.table].drop();
}

module.exports = {
    update,
    diffs,
    clear
};
