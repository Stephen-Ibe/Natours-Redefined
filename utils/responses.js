class Response {
  /**
   * Returns a not-found error response
   * @param {object} res - response object.
   * @param {string} message - response message.
   * @returns {object} object.
   */
  static notFoundError(res, message) {
    return res.status(404).json({
      message,
      error: 'Not Found',
    });
  }
}
