const _ = require('lodash');
const database = require('./../database');

class GetChanges {
    async execute() {
        const changes = {};

        const [hasChanges] = await database.sequelize.query(`
        SELECT * FROM contents GROUP BY link, sha256
            HAVING COUNT(sha256) < (SELECT count(*) FROM (select * from contents group by trackId))
            ORDER BY createdAt DESC
            `);

        for (const change of hasChanges) {
            const path = `[${change.group}].[${change.category}].[${change.link}]`;
            if (!_.get(changes, path)) {
                _.set(changes, path, []);
            }

            const c = _.get(changes, path);

            c.push({
                createdAt: change.createdAt,
                content: change.content
            });

        }

        return changes;
    }
}

module.exports = GetChanges;
