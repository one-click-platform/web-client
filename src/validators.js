import { MathUtil } from '@/js/utils'

import * as validators from 'vuelidate/lib/validators'

export { minLength } from 'vuelidate/lib/validators'

export const amountRange = (from, to) => value =>
  !validators.helpers.req(value) || (
    MathUtil.compare(value, from) >= 0 &&
    MathUtil.compare(to, value) >= 0
  )

export * from 'vuelidate/lib/validators'
