class GetChanges {
    constructor(database) {
        this._database = database;
    }

    async execute() {
        const changes = {};

        const [hasChanges] = await this._database.query('SELECT * FROM contents GROUP BY link, sha256\n' +
            'HAVING COUNT(sha256) < (SELECT count(*) FROM (select * from contents group by trackId))\n' +
            'ORDER BY createdAt DESC;');

        for (const change of hasChanges) {
            const path = `[${change.group}].[${change.category}].[${change.link}]`;
            if (!_.get(changes, path)) {
                _.set(changes, path, []);
            }

            const c = _.get(changes, path);

            c.push(change.content);

        }

        return changes;
    }
}

module.exports = GetChanges;
