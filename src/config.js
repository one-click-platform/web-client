import packageJson from '../package.json'
import _isEmpty from 'lodash/isEmpty'

const config = {}

const env = _isEmpty(document.ENV)
  ? process.env
  : document.ENV

Object.keys(env).forEach(varName => {
  const value = normalize(env[varName])
  if (varName.startsWith('VUE_APP')) {
    let key = varName.replace('VUE_APP_', '')
    config[key] = value
  } else {
    config[varName] = value
  }
})

function normalize (value) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return value
}

export default Object.assign(
  {
    /**
     * App name
     */
    APP_NAME: '4+2',

    // deprecated constants

    /**
     * Should be populated by DevOps team during the deployment
     * The field being displayed on login screen.
     */
    BUILD_VERSION: packageJson.version,

    /**
     * Ethereum network type. 'main' for Main Ethereum Network
     */
    ETHEREUM_NETWORK_TYPE: '',

    NODE_ENDPOINT: '',

    /**
     * Session storage key
     */
    STORAGE_KEY: 'Store-v2',

    API_URL: '',
    AUCTION_ADDRESS: '0x7e67eD5fF6aCdA7989BC2Eb2BCf824956D23fD4a',
    TOKEN_ADDRESS: '0x2E52df519d2c2c655987603807c69784Af03008E',
    CURRENCY_ADDRESS: '0x0EB09304ad17E0d668D1b029a7286c8810B20E4c',
  },
  // process.env,
  process.env
    ? config
    : process.env,
  document.ENV
    ? config
    : document.ENV,
)
