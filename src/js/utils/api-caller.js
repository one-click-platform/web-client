import axios from 'axios'

const MIME_TYPE_JSON_API = 'application/vnd.api+json'

const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_ACCEPT = 'Accept'
const HEADER_AUTHORIZATION = 'Authorization'

const methods = Object.freeze({
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
})

export class ApiCaller {
  /**
   * Creates an `ApiCaller` instance
   *
   * @param {object} opts
   * @param {string} opts.baseURL - URL to a Horizon server to use
   *
   */
  constructor (opts = {}) {
    this._axios = axios.create()
    if (opts.baseURL) {
      this.useBaseURL(opts.baseURL)
    }
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} query - query params. query parameters should not contain
   * no more than 1 level of nesting.
   * @returns {Object} - the parsed response.
   */
  get (endpoint, query) {
    return this._call({
      method: methods.GET,
      endpoint,
      query,
      isEmptyBodyAllowed: true,
    })
  }

  /**
   * Makes a `POST` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  post (endpoint, data) {
    return this._call({
      method: methods.POST,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  patch (endpoint, data) {
    return this._call({
      method: methods.PATCH,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `PUT` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  put (endpoint, data) {
    return this._call({
      method: methods.PUT,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  delete (endpoint, data) {
    return this._call({
      method: methods.DELETE,
      endpoint,
      data,
      isEmptyBodyAllowed: true,
    })
  }

  /**
   * Assigns new baseURL to the current instance.
   *
   * @param {string} baseURL - URL to horizon server
   */
  useBaseURL (baseURL) {
    this._baseURL = baseURL
  }

  /**
   * Assigns new token to the current instance.
   *
   * @param {string} token -auth token
   */
  useToken (token) {
    this._token = token
  }

  /**
   * Performs a request
   *
   * @param {object} opts
   * @param {object} opts.data - request data (for POST/PUT requests)
   * @param {string} opts.method - the http method of request
   * @param {object} opts.query - request query params. See {@link parseQuery}
   * for details
   * @param {bool} opts.isEmptyBodyAllowed - defines if empty body is allowed,
   * `false` by default
   *
   * @private
   */
  async _call (opts) {
    let config = {
      baseURL: this._baseURL,
      params: opts.query || {},
      data: (opts.isEmptyBodyAllowed && !opts.data)
        ? undefined
        : opts.data || {},
      method: opts.method,
      url: opts.endpoint, // TODO: smartly build url
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${null}`,
      },
    }

    config.headers[HEADER_CONTENT_TYPE] = MIME_TYPE_JSON_API
    config.headers[HEADER_ACCEPT] = MIME_TYPE_JSON_API
    if (this._token) {
      config.headers[HEADER_AUTHORIZATION] = 'Basic ' + this._token
    }

    let response

    try {
      response = await this._axios(config)
    } catch (e) {
      throw e
    }

    return response
  }
}
