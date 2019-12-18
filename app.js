process.env.TZ = 'utc';
require('dotenv').config();
// Root path
require('app-module-path/register'); // eslint-disable-line import/no-unassigned-import
const PORT = process.env.PORT;

const database = require('providers/database');
const server = require('providers/server');

async function bootstrap() {
  try {
    await database.connect();

    server.listen(PORT, async () => {
      console.log(`http://localhost:${PORT}/pull/bcom`);
      console.log(`http://localhost:${PORT}/compare/1/2`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();


