class OverleafUtils {
  static async getAllEditorContent () {
    let onTop = false
    const editorContainer = document.querySelector('.cm-scroller')
    const contentEditable = document.querySelector('.cm-content')
    const lineNumbersContainer = document.querySelector('.cm-lineNumbers')
    let contentLines = []
    let capturedLineNumbers = new Set()

    if (!editorContainer || !contentEditable || !lineNumbersContainer) {
      console.error('Editor elements not found')
      return
    }

    function scrollEditor (position) {
      return new Promise((resolve) => {
        editorContainer.scrollTo({ top: position })
        setTimeout(resolve, 100)
      })
    }

    function extractVisibleText () {
      const lineNumbers = Array.from(lineNumbersContainer.querySelectorAll('.cm-gutterElement')).slice(1)
      let lines = contentEditable.querySelectorAll('.cm-line, .cm-gap')

      let myText = Array.from(lines).map((line) => {
        let lineText = ''
        if (line.classList.contains('cm-line')) {
          line.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              lineText += node.textContent || ''
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
              lineText += node.innerText || ''
            }
          })
          return lineText.trim()
        } else if (line.classList.contains('cm-gap')) {
          return ''
        }
      })

      let myLineNumbers = lineNumbers.map((item) => item.textContent)

      if (myLineNumbers.length > 0 && myLineNumbers[0] === '1') {
        onTop = true
      }

      if (onTop) {
        myText = myText.slice(3)

        if (lines.length > myLineNumbers.length) {
          myText = myText.slice(0, myLineNumbers.length)
        }

        myText.forEach((text, index) => {
          const lineNumber = myLineNumbers[index] // Get the corresponding line number
          if (lineNumber && !capturedLineNumbers.has(lineNumber)) {
            if (text.trim()) {
              contentLines.push(`${lineNumber}: ${text}`) // Add line number and text
            } else {
              contentLines.push(`${lineNumber}: \n`) // Empty line with a line number
            }
            capturedLineNumbers.add(lineNumber) // Mark the line number as captured
          }
        })
      }
    }

    let position = 0
    while (position < editorContainer.scrollHeight) {
      extractVisibleText()
      await scrollEditor(position)
      position = editorContainer.scrollTop + editorContainer.clientHeight
      if (Math.ceil(position) >= editorContainer.scrollHeight) {
        break
      }
    }

    let fullText = contentLines.join('\n')
    console.log('Full text:', fullText)
    fullText = contentLines
      .map(line => line.replace(/^\d+:\s*/, '')) // Remove the leading '{number}: ' pattern
      .join('\n')
    return fullText
  }

  static async removeContent (callback) {
    const editorContent = document.querySelector('#panel-source-editor > div > div > div.cm-scroller > div.cm-content.cm-lineWrapping')
    if (!editorContent) {
      console.error('Editor content element not found')
    } else {
      while (editorContent.firstChild) {
        editorContent.removeChild(editorContent.firstChild)
      }
      console.log('All child nodes removed from editor content.')
      if (callback) {
        callback()
      }
    }
  }

  static async insertContent (content) {
    const editorContent = document.querySelector('.cm-content')

    if (!editorContent) {
      console.error('Editor elements not found')
      return
    }

    // Helper function to insert text at the current cursor position
    function insertTextAtCursor(text) {
      const range = document.getSelection().getRangeAt(0)
      const textNode = document.createTextNode(text)
      range.deleteContents()
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)

      // Simulate typing event to update the editor content
      const event = new Event('input', { bubbles: true })
      editorContent.dispatchEvent(event)
    }

    // Focus the editor and place the cursor at the end or start
    function focusEditor () {
      editorContent.focus()

      const range = document.createRange()
      const selection = window.getSelection()

      // Move the cursor to the end of the content
      range.selectNodeContents(editorContent)
      range.collapse(false) // Set to true for start, false for end
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // Write the text in parts, simulating a typing experience
    async function writeText (text) {
      focusEditor()

      // Optionally, split the text into lines to insert gradually or simulate typing speed
      const lines = text.split('\n')
      for (let line of lines) {
        insertTextAtCursor(line + '\n')
        await new Promise((resolve) => setTimeout(resolve, 5)) // Simulate typing delay
      }
    }

    // Start the text insertion
    await writeText(content)
  }
}

module.exports = OverleafUtils
