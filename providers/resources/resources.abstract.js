/**
 * @typedef ResourceResult
 * @property {string} resource
 * @property {string} category
 * @property {string} url
 * @property {int} trackId
 * @property {string} sha256
 * @property {string} content
 */

class ResourcesProvider {
  /**
   * @param resource
   * @return {Array<ResourceResult>}
   */
  get(resource) {
    if (!resource) {
      throw new Error('Resource not found');
    }
  }
}

module.exports = ResourcesProvider;
