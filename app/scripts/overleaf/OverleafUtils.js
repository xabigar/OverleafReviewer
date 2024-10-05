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
        setTimeout(resolve, 250)
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
        if (myLineNumbers[0] !== '1') {
          // check from already saved content the first five myLineNumbers and myText correspond;
          let isAligned = false
          const maxCheckLength = 5 // Let's check the first five lines for alignment
          let offset = 0
          // Compare saved content to find where the mismatch happens
          while (!isAligned && offset < maxCheckLength) {
            isAligned = true // Assume alignment is correct at the start

            // Check the first few stored line numbers and text to ensure alignment
            for (let i = 0; i < Math.min(myText.length, maxCheckLength); i++) {
              const savedContentLine = contentLines.find(line => line.startsWith(`${myLineNumbers[i]}:`))
              const currentLine = `${myLineNumbers[i]}: ${myText[i] || '\n'}` // Create new line to compare (with line number)

              // If there's a mismatch between stored and new line number:text, it's not aligned
              if (savedContentLine && savedContentLine !== currentLine) {
                isAligned = false // If any mismatch is found, set to false
                break
              }
            }

            // If not aligned, remove the first element of myText (shift) and increment the offset
            if (!isAligned) {
              myText = myText.slice(1) // Remove the first element of the text
              offset++ // Move forward to recheck
            }
          }
        }
        // Ensure the text length matches the line numbers length if more lines are added
        if (myText.length > myLineNumbers.length) {
          myText = myText.slice(0, myLineNumbers.length)
        }
        // Loop over the line numbers and match with the text content
        myLineNumbers.forEach((lineNumber, index) => {
          const text = myText[index] // Get the corresponding text for this line number
          if (lineNumber && !capturedLineNumbers.has(lineNumber)) {
            if (text) {
              contentLines.push(`${lineNumber}: ${text}`) // Add the line number and the corresponding text
            } else {
              contentLines.push(`${lineNumber}: \n`) // Handle the empty text case
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
      if (Math.ceil(position) + 1 >= editorContainer.scrollHeight) {
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
    function insertTextAtCursor (text) {
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

  static getActiveEditor () {
    const codeEditor = document.getElementById('editor-switch-cm6')
    const visualEditor = document.getElementById('editor-switch-rich-text')

    if (codeEditor.checked) {
      return 'Code Editor'
    } else if (visualEditor.checked) {
      return 'Visual Editor'
    } else {
      return 'No editor selected'
    }
  }

  static toggleEditor () {
    const codeEditor = document.getElementById('editor-switch-cm6')
    const visualEditor = document.getElementById('editor-switch-rich-text')

    if (codeEditor.checked) {
      // Switch to Visual Editor
      document.querySelector('label[for="editor-switch-rich-text"]').click()
    } else if (visualEditor.checked) {
      // Switch to Code Editor
      document.querySelector('label[for="editor-switch-cm6"]').click()
    }
  }
}

module.exports = OverleafUtils
