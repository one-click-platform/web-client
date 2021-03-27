import mock from 'xhr-mock'

const HORIZON_URL = 'https://test.api.com'

export class MockHelper {
  constructor () {
    mock.setup()
    mock.reset()
    this.defaultAccountId = 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J'
    this.defaultBalanceId = 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ'
  }

  mockEndpoint (endpoint, response) {
    const url = `${HORIZON_URL}${endpoint}`
      .replace('@', '%40') // FIXME sorry

    mock.get(url, {
      status: 200,
      reason: 'OK',
      body: JSON.stringify(response),
    })
  }

  get getDefaultAccountId () {
    return this.defaultAccountId
  }

  get getDefaultBalanceId () {
    return this.defaultBalanceId
  }
}
