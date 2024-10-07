const OverleafUtils = require('./OverleafUtils')
const Config = require('../Config')
const Alerts = require('../utils/Alerts')
const LLMClient = require('../llm/LLMClient')
const LatexUtils = require('./LatexUtils')
const DBManager = require('./DBManager')

class CriterionActions {
  static async askCriterionAssessment (criterionLabel, description) {
    // Fetch document content
    let editor = OverleafUtils.getActiveEditor()
    if (editor === 'Visual Editor') {
      OverleafUtils.toggleEditor()
    }
    window.promptex._overleafManager._sidebar.remove()
    Alerts.showLoadingWindow('Reading document content...')
    const documents = await OverleafUtils.getAllEditorContent()
    let prompt = Config.prompts.annotatePrompt
    prompt = prompt.replace('[C_NAME]', criterionLabel)
    prompt = prompt.replace('[C_DESCRIPTION]', description)
    prompt = 'RESEARCH PAPER: ' + LatexUtils.processTexDocument(documents) + '\n' + prompt
    Alerts.closeLoadingWindow()
    Alerts.showLoadingWindow('Retrieving API key...')
    chrome.runtime.sendMessage({ scope: 'llm', cmd: 'getSelectedLLM' }, async ({ llm }) => {
      if (llm === '') {
        llm = Config.review.defaultLLM
      }
      const llmProvider = llm.modelType
      Alerts.showLoadingWindow('Waiting for ' + llmProvider.charAt(0).toUpperCase() + llmProvider.slice(1) + 's answer. It can take time...')
      chrome.runtime.sendMessage({ scope: 'llm', cmd: 'getAPIKEY', data: llmProvider }, ({ apiKey }) => {
        if (apiKey !== null && apiKey !== '') {
          let callback = (json) => {
            Alerts.closeLoadingWindow()
            console.log(json)
            const cleanExcerpts = json.claims.map(claim => {
              // Replace multiple backslashes with a single one
              let cleanedExcerpt = claim.excerpt.replace(/\\\\+/g, '\\')
              return cleanedExcerpt
            })
            console.log(cleanExcerpts)
            cleanExcerpts.forEach(excerpt => {
              if (documents.includes(excerpt)) {
                console.log(`Excerpt found: "${excerpt}"`)
              } else {
                console.log(`Excerpt not found: "${excerpt}"`)
              }
            })
            let suggestion = json.suggestionForImprovement
            let sentiment = json.sentiment
            let effortLevel = json.effortLevel
            let effortDescription = json.effortDescription
            let newContent = LatexUtils.addCommentsToLatex(documents, cleanExcerpts, suggestion, sentiment, criterionLabel)
            newContent = LatexUtils.ensurePromptexCommandExists(newContent)
            OverleafUtils.removeContent(() => {
              DBManager.saveCriterionAssessment(criterionLabel, description, cleanExcerpts, suggestion, sentiment, effortLevel, effortDescription)
              window.promptex._overleafManager._sidebar.remove()
              OverleafUtils.insertContent(newContent)
            })
          }
          LLMClient.simpleQuestion({
            apiKey: apiKey,
            prompt: prompt,
            llm: llm,
            callback: callback
          })
        } else {
          Alerts.showErrorToast('No API key found for ' + llm)
        }
      })
    })
  }
}

module.exports = CriterionActions
