const OverleafUtils = require('./OverleafUtils')
const Config = require('../Config')
const Alerts = require('../utils/Alerts')
const LLMClient = require('../llm/LLMClient')
const FileUtils = require('../utils/FileUtils')
const DBManager = require('./DBManager')

class CriterionActions {
  static async askCriterionAssessment (criterionLabel, description) {
    // Fetch document content
    Alerts.showLoadingWindow('Reading document content...')
    const documents = await OverleafUtils.getAllEditorContent()
    let prompt = Config.prompts.annotatePrompt
    prompt = prompt.replace('[C_NAME]', criterionLabel)
    prompt = prompt.replace('[C_DESCRIPTION]', description)
    prompt = 'RESEARCH PAPER: ' + documents + '\n' + prompt
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
            let newContent = CriterionActions.addCommentsToLatex(documents, cleanExcerpts, suggestion, sentiment, criterionLabel)
            OverleafUtils.removeContent(() => {
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
    // Process document to remove '%' lines and abstract
    // const result = CriterionActions.processTexDocument(documents)

    // Do something with the result, e.g., log or save
    /* console.log(documents)
    OverleafUtils.removeContent(() => {
      OverleafUtils.insertContent(documents)
    })
     */
  }

  static addCommentsToLatex (originalLatex, excerpts, suggestion, sentiment, criterionLabel) {
    let sentimentColor = sentiment.toLowerCase()
    excerpts.forEach(excerpt => {
      let commentCommand = `\\promptex{${criterionLabel}...${sentiment}}{${excerpt}}`
      // Add the \mycomment after each occurrence of the excerpt in the latex file
      originalLatex = originalLatex.replace(excerpt, `${commentCommand}`)
    })
    return originalLatex
  }

  // Make this method static to call within the static askCriterionAssessment method
  static processTexDocument (documents) {
    // Split the content into lines
    let lines = documents.split('\n')

    // Remove lines starting with '%'
    lines = lines.filter(line => !line.trim().startsWith('%'))

    // Join the lines back to form the document content without comments
    let processedContent = lines.join('\n')

    // Use regex to remove the content between \begin{abstract} and \end{abstract}
    const abstractRegex = /\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/

    // Remove the abstract section from the content
    processedContent = processedContent.replace(abstractRegex, '')

    // Remove excessive newlines (keep at most one consecutive newline)
    processedContent = processedContent.replace(/\n\s*\n/g, '\n')

    // Return the processed content without lines starting with '%' and the abstract section
    return processedContent.trim()
  }
}

module.exports = CriterionActions
