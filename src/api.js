import { ApiCaller } from '@/js/utils/api-caller'
import config from '@/config'

export const api = new ApiCaller()

export async function initApi () {
  api.useBaseURL(config.API_URL)
}
