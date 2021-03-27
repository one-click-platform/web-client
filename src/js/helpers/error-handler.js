import { Bus } from '@/js/helpers/event-bus'

export class ErrorHandler {
  static process (error, translationId = '') {
    const msgTrId = translationId || ErrorHandler._getTranslationId(error)
    Bus.error(msgTrId)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback (error) {
    console.error(error)
  }

  static _getTranslationId () {
    return 'errors.default'
  }
}
