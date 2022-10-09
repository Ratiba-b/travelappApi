class UserError extends Error {
  constructor(errorMessage) {
    super();

    this.name = "UserError [Tu es null]";
    this.statusCode = 400;

    this.message = `le nouveau message d'erreur: ${errorMessage}`;
  }
}

module.exports = UserError;
