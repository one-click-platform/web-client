import { validationMixin } from 'vuelidate'

import FormValidationMixin from '@/vue/mixins/form-validation.mixin'
import InputField from '@/vue/fields/InputField'
import SelectField from '@/vue/fields/SelectField'
import TextareaField from '@/vue/fields/TextareaField'
import TickField from '@/vue/fields/TickField'
import RadioField from '@/vue/fields/RadioField'
import FormConfirmation from '@/vue/common/FormConfirmation'
import FileField from '@/vue/fields/FileField'

export default {
  components: {
    InputField,
    SelectField,
    TextareaField,
    TickField,
    RadioField,
    FileField,
    FormConfirmation,
  },
  mixins: [FormValidationMixin, validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false,
      isPending: false,
      isConfirmationShown: false,
    },
  }),
  methods: {
    disableForm () {
      this.formMixin.isDisabled = true
    },
    enableForm () {
      this.formMixin.isDisabled = false
    },
    showConfirmation () {
      this.disableForm()
      this.formMixin.isConfirmationShown = true
    },
    hideConfirmation () {
      this.enableForm()
      this.formMixin.isConfirmationShown = false
    },
    async hideConfirmationAfterSubmit (submit) {
      this.formMixin.isPending = true
      await submit()
      this.hideConfirmation()
      this.formMixin.isPending = false
    },
  },
}
