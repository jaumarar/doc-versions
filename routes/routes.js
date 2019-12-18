const services = require('services');

async function pull(req, res) {
  const {
    resource
  } = req.params;

  res.header('content-type', 'json');

  return res.send(await services.pull(resource));
}

async function compare(req, res) {
  const {
    pullId1,
    pullId2
  } = req.params;
  res.header('content-type', 'json');

  return res.send(await services.compare(pullId1, pullId2));
}

module.exports = (server) => {
  server.get('/pull/:resource', pull);
  server.get('/compare/:pullId1/:pullId2', compare);
};
