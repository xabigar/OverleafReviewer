const Utils = require('../utils/Utils')

class LatexUtils {
  static ensurePromptexCommandExists (latexText) {
    // Define the new command string
    const promtexCommand = '\\newcommand{\\promptex}[2]{#2}'
    const beginDoc = '\\begin{document}'

    // Check if the command already exists in the text
    if (!latexText.includes(promtexCommand)) {
      // Split the text into lines
      const lines = latexText.split('\n')

      // Find the line with \begin{document}
      const docIndex = lines.findIndex(line => line.includes(beginDoc))

      if (docIndex !== -1) {
        // Insert the new command just before \begin{document}
        lines.splice(docIndex, 0, promtexCommand)
      } else {
        console.warn('No \\begin{document} found in the LaTeX text.')
      }

      // Join the lines back into a single string
      latexText = lines.join('\n')
    }

    return latexText
  }

  static addCommentsToLatex (originalLatex, excerpts, suggestion, sentiment, criterionLabel) {
    let sentimentColor = Utils.sentimentToNumber(sentiment.toLowerCase())
    excerpts.forEach(excerpt => {
      let commentCommand = `\\promptex{\\textit{${criterionLabel}::${sentimentColor}}}{${excerpt}}\n`
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

module.exports = LatexUtils
