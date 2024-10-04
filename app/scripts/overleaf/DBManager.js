
class DBManager {
  static criterionPrompted (criterionLabel, description) {
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

module.exports = DBManager
