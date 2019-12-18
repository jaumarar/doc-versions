const crypto = require('crypto');

function generateTrackId() {
  return new Date().getTime();
}

function generateSha(message) {
  return crypto.createHash('sha256').update(message, 'utf8').digest('base64');
}

function sanitizeHtml(html) {
  return html.replace(/\s\s+/g, ' ').replace(/(?=<!--)([\s\S]*?)-->/g, '').trim();
}

module.exports = {
  generateTrackId,
  generateSha,
  sanitizeHtml
};
