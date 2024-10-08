const CriterionActions = require('./CriterionActions')
const OverleafUtils = require('./OverleafUtils')
const Alerts = require('../utils/Alerts')
const LocalStorageManager = require('../storage/LocalStorageManager')
const _ = require('lodash')

class OverleafManager {
  constructor () {
    this._project = null
    this._sidebar = null
    this._currentCriteriaList = null
  }

  init () {
    let that = this
    let locator = 'i.fa.fa-home.fa-fw' // CSS selector for the home icon
    let target = document.querySelector(locator)
    if (target == null) {
      // If the icon is not found, retry after 500ms
      window.setTimeout(() => {
        that.init() // Replace this with the method you are calling (e.g., init)
      }, 500)
      return
    }
    // If the home icon is found, perform your desired actions
    that.projectManagement() // Replace this with the function handling actions when the icon is found
  }

  projectManagement () {
    let that = this
    let project = that.getProject()
    if (project) {
      this._project = project
      this.loadStorage(project, () => {
        console.log(window.promptex.storageManager.client.getSchemas())
        that.addButton()
        that.addOutlineButton()
        that.monitorEditorContent()
        this._currentCriteriaList = Object.keys(window.promptex.storageManager.client.getSchemas())[0]
      })
    }
  }

  monitorEditorContent () {
    // Use setInterval to check every second (1000ms)
    setInterval(() => {
      // Get all elements with the class 'ol-cm-command-promptex'
      let elements = document.querySelectorAll('.ol-cm-command-promptex')

      elements.forEach((element) => {
        if (!this.isSelected(element)) {
          // Find the first .ol-cm-command-textit inside the element
          let commandTextit = element.querySelector('.ol-cm-command-textit')

          if (commandTextit) {
            // Extract the text content from the .ol-cm-command-textit element
            let commandText = commandTextit.textContent
            let criterion = ''
            // Check if the content matches the format 'text::number'
            const match = commandText.match(/(.*)::(\d+)/)

            if (match) {
              criterion = match[1]
              const number = parseInt(match[2], 10)

              // Apply background color based on the number
              if (number === 0) {
                element.style.backgroundColor = 'green' // Set background to green
              } else if (number === 1) {
                element.style.backgroundColor = 'yellow' // Set background to yellow
              } else if (number === 2) {
                element.style.backgroundColor = 'red' // Set background to red
              } else {
                element.style.backgroundColor = '' // Reset background for other cases
              }
            }

            // Set the display of the first .ol-cm-command-textit element to 'none'
            commandTextit.style.display = 'none'
            // Hide the first two .tok-punctuation.ol-cm-punctuation elements
            const previousSibling = element.previousElementSibling
            const secondPreviousSibling = previousSibling?.previousElementSibling
            const nextSibling = element.nextElementSibling
            if (previousSibling && secondPreviousSibling) {
              previousSibling.style.display = 'none' // cm-matchingBracket
              secondPreviousSibling.style.display = 'none' // \promptex
              nextSibling.style.display = 'none' // cm-punctuation
              // firstBracket.style.display = 'none'; // cm-punctuation
            }
            if (secondPreviousSibling && secondPreviousSibling.textContent && secondPreviousSibling.textContent === 'ex') {
              const thirdPreviousSibling = secondPreviousSibling.previousElementSibling
              const forthPreviousSibling = thirdPreviousSibling.previousElementSibling
              thirdPreviousSibling.style.display = 'none' // cm-punctuation
              forthPreviousSibling.style.display = 'none' // cm-punctuation
            }
            // Select all elements with both classes 'tok-punctuation' and 'ol-cm-punctuation' inside the current item
            element.querySelectorAll('.tok-punctuation.ol-cm-punctuation').forEach(punctuationElement => {
              // Hide the punctuation element by setting display to 'none'
              punctuationElement.style.display = 'none'
            })
            // Add tooltip to the element
            // if right-clicked, show a context menu
            let criterionElement = window.promptex.storageManager.client.findCriterion(criterion)
            element.title = 'This highlight is associated with ' + criterion + '<br><br><br>'
            if (criterionElement && criterionElement.Assessment && criterionElement.AssessmentDescription) {
              element.title += 'Assessment(' + criterionElement.Assessment + '): ' + criterionElement.AssessmentDescription + '<br>'
            }
            if (criterionElement && criterionElement.Suggestion) {
              element.title += 'This is a suggestion for improvement: ' + criterionElement.Suggestion + '<br><br><br>'
              if (criterionElement.EffortValue && criterionElement.EffortDescription) {
                element.title += '\nEffort Level: ' + criterionElement.EffortValue + '<br>'
                element.title += '\nEffort Description: ' + criterionElement.EffortDescription
              }
            }
            element.addEventListener('contextmenu', function (event) {
              event.preventDefault() // Prevent the default right-click menu
              let criterionElement = window.promptex.storageManager.client.findCriterion(criterion)
              let info = 'This highlight is associated with ' + criterion + '<br><br><br>'
              if (criterionElement && criterionElement.Assessment && criterionElement.AssessmentDescription) {
                info += 'Assessment(' + criterionElement.Assessment + '): ' + criterionElement.AssessmentDescription + '<br>'
              }
              if (criterionElement && criterionElement.Suggestion) {
                info += 'Suggestion: ' + criterionElement.Suggestion + '<br><br><br>'
                if (criterionElement.EffortValue && criterionElement.EffortDescription) {
                  info += '\nEffort Level: ' + criterionElement.EffortValue + '<br>'
                  info += criterionElement.EffortDescription
                }
              }
              // Show alert with the tooltip message
              Alerts.infoAlert({ title: 'Criterion Information', text: info })
              return false // Additional return to ensure default action is canceled
            })
          }
        }
      })
    }, 500) // Every second
  }

  isSelected (element) {
    const selection = window.getSelection()

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0) // Get the first range (caret position)

      // Find the container where the caret is located (text node or element)
      let caretContainer = range.startContainer

      // If the caret is inside a text node, get its parent element
      if (caretContainer.nodeType === Node.TEXT_NODE) {
        caretContainer = caretContainer.parentNode
      }
      // Check if the element contains the caret container (either directly or via descendants)
      if (element.contains(caretContainer)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  addButton () {
    // Create the 'Check Criteria' button element
    let checkCriteriaButton = document.createElement('div')
    checkCriteriaButton.classList.add('toolbar-item')
    checkCriteriaButton.innerHTML = `
      <button type='button' class='btn btn-full-height' id='checkCriteriaBtn'>
        <i class='fa fa-check-square-o fa-fw' aria-hidden='true'></i>
        <p class='toolbar-label'>Ask PrompTeX</p>
      </button>
    `
    // Locate the toolbar where the button should be added
    let toolbar = document.querySelector('.toolbar-right')

    // Insert the 'Check Criteria' button at the end of the toolbar list
    if (toolbar) {
      toolbar.appendChild(checkCriteriaButton)
    } else {
      console.error('Toolbar not found')
    }

    checkCriteriaButton.addEventListener('click', async () => {
      // const content = await OverleafUtils.getAllEditorContent()
      this.showCriteriaSidebar()
    })
  }

  addOutlineButton () {
    // Create the container for the new outline
    const outlineContainer = document.querySelector('.outline-container')

    // Create a new pane for the outline
    const newOutlinePane = document.createElement('div')
    newOutlinePane.classList.add('outline-pane2')

    // Create the header for the new outline
    const newHeader = document.createElement('header')
    newHeader.classList.add('outline-header')
    newHeader.classList.add('closed')

    const headerButton = document.createElement('button')
    headerButton.classList.add('outline-header-expand-collapse-btn')
    headerButton.setAttribute('aria-label', 'Show Foundation outline')
    headerButton.setAttribute('aria-expanded', 'false') // Initially collapsed

    const caretIcon = document.createElement('span')
    caretIcon.classList.add('material-symbols', 'outline-caret-icon')
    caretIcon.setAttribute('aria-hidden', 'true')
    caretIcon.textContent = 'keyboard_arrow_right' // Initially right arrow (collapsed)

    const headerTitle = document.createElement('h4')
    headerTitle.classList.add('outline-header-name2')
    headerTitle.textContent = 'Content outline' // Update title to "Foundation outline"

    // Append the caret and title to the header button, and the button to the header
    headerButton.appendChild(caretIcon)
    headerButton.appendChild(headerTitle)
    newHeader.appendChild(headerButton)
    newOutlinePane.appendChild(newHeader)

    // Append the new outline pane to the container BEFORE the original outline
    const originalOutline = document.querySelector('.outline-pane')
    outlineContainer.insertBefore(newOutlinePane, originalOutline)
    const outlinePanel = document.querySelector('#panel-outline')

    // Set the height and min-height dynamically
    if (outlinePanel) {
      outlinePanel.style.height = '50%' // Set height to 50%
      outlinePanel.style.minHeight = '64px' // Set min-height to 64px
    }

    // Select all outline panes
    const outlinePanes = document.querySelectorAll('.outline-pane')

    // Set height for each pane to split space equally
    outlinePanes.forEach(pane => {
      pane.style.height = '50%'
    })

    // Handle header click to show/hide the outline body of THIS outline only
    newHeader.addEventListener('click', (event) => {
      event.stopPropagation() // Prevent interference with other outlines
      const isHidden = newHeader.classList.contains('closed')
      // Toggle between opened and closed state
      if (isHidden) {
        newHeader.classList.replace('closed', 'opened')
        // Ensure outline body is visible
        const outlineBody = document.createElement('div')
        outlineBody.classList.add('outline-body')

        // Create the root list for the items
        const rootList = document.createElement('ul')
        rootList.classList.add('outline-item-list', 'outline-item-list-root')
        rootList.setAttribute('role', 'tree')
        outlineBody.appendChild(rootList)

        // Helper function to create list items
        const createListItem = (label) => {
          const li = document.createElement('li')
          li.classList.add('outline-item', 'outline-item-no-children')
          li.setAttribute('role', 'treeitem')

          const div = document.createElement('div')
          div.classList.add('outline-item-row')

          const button = document.createElement('button')
          button.classList.add('outline-item-link')
          button.setAttribute('data-navigation', '1')
          button.textContent = label
          button.addEventListener('click', async () => {
            // Get criterion content
            var match = label.match(/^(.+)\s\((\d+)\)$/)

            if (match) {
              // match[1] is the name (e.g., 'Artifact Detail')
              // match[2] is the number (e.g., '1')
              var name = match[1]
              var number = match[2]

              // Get the navigation attribute from the button
              var navigation = button.getAttribute('data-navigation')

              // Log the extracted name, number, and navigation attribute
              console.log('Name:', name, '| Number:', number, '| Navigation:', navigation)
              await OverleafUtils.scrollToContent(name, parseInt(navigation))
              if (navigation === number) {
                button.setAttribute('data-navigation', '1')
              } else {
                let newNavigation = (parseInt(navigation) + 1).toString()
                button.setAttribute('data-navigation', newNavigation)
              }
            }
          })

          div.appendChild(button)
          li.appendChild(div)

          return li
        }
        OverleafUtils.generateOutlineContent(async (outlineContent) => {
          // Iterate through the content to build the outline
          Object.keys(outlineContent).forEach((category) => {
            // Create a parent item for each category
            const categoryLi = document.createElement('li')
            categoryLi.classList.add('outline-item')
            categoryLi.setAttribute('role', 'treeitem')
            categoryLi.setAttribute('aria-expanded', 'true')

            const categoryDiv = document.createElement('div')
            categoryDiv.classList.add('outline-item-row')

            // Add expand/collapse button
            const categoryButton = document.createElement('button')
            categoryButton.classList.add('outline-item-expand-collapse-btn')
            categoryButton.setAttribute('aria-label', 'Collapse')
            categoryButton.setAttribute('aria-expanded', 'true') // Initially expanded

            const categoryIcon = document.createElement('span')
            categoryIcon.classList.add('material-symbols', 'outline-caret-icon')
            categoryIcon.textContent = 'keyboard_arrow_down' // Default to expanded
            categoryButton.appendChild(categoryIcon)

            const categoryTitle = document.createElement('button')
            categoryTitle.classList.add('outline-item-link')
            categoryTitle.textContent = category

            categoryDiv.appendChild(categoryButton)
            categoryDiv.appendChild(categoryTitle)
            categoryLi.appendChild(categoryDiv)

            // Add sub-items (attributes)
            const subList = document.createElement('ul')
            subList.classList.add('outline-item-list')
            subList.setAttribute('role', 'group')

            outlineContent[category].forEach((subItem) => {
              subList.appendChild(createListItem(subItem))
            })

            categoryLi.appendChild(subList)
            rootList.appendChild(categoryLi)

            // Toggle sub-list visibility on category click
            categoryButton.addEventListener('click', () => {
              const isExpanded = categoryLi.getAttribute('aria-expanded') === 'true'
              categoryLi.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
              subList.style.display = isExpanded ? 'none' : 'block'
              categoryIcon.textContent = isExpanded ? 'keyboard_arrow_right' : 'keyboard_arrow_down'
              categoryButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true') // Update aria-expanded
            })
          })
          let treeDiv = document.getElementById('panel-file-tree')
          // Change the data-panel-size attribute
          treeDiv.setAttribute('data-panel-size', '80.5') // You can set it to any value
          // Change the flex style property
          treeDiv.style.flex = '80.5 1 0px' // Update the first number to match the new panel size
          let separator = treeDiv.nextElementSibling
          // Change the 'data-panel-resize-handle-enabled' attribute to 'true'
          separator.setAttribute('data-panel-resize-handle-enabled', 'true')
          // Change the 'aria-valuenow' attribute to '55'
          separator.setAttribute('aria-valuenow', '80')
          // Select the inner div with the class 'vertical-resize-handle'
          const innerHandle = separator.querySelector('.vertical-resize-handle')
          // Mouse down starts the resizing
          let isResizing = false
          innerHandle.addEventListener('mousedown', (e) => {
            isResizing = true
            document.body.style.cursor = 'row-resize' // Change the cursor when resizing
          })
          document.addEventListener('mousemove', (e) => {
            if (isResizing) {
              const panelOutline = document.getElementById('panel-outline')
              const newSize = e.clientY // Use the Y position of the mouse to calculate the new size
              panelOutline.style.flex = `${newSize} 1 0px` // Adjust flex-grow// property dynamically
              panelOutline.setAttribute('data-panel-size', newSize) // Update the data attribute
            }
          })
          document.addEventListener('mouseup', () => {
            isResizing = false
            document.body.style.cursor = 'default' // Reset the cursor
          })
          // Add the 'vertical-resize-handle-enabled' class to the inner div
          innerHandle.classList.add('vertical-resize-handle-enabled')
          let panelOutline = separator.nextElementSibling
          // Change the 'data-panel-size' attribute to '44.8'
          panelOutline.setAttribute('data-panel-size', '44.8')
          // Change the 'flex' value in the style property
          panelOutline.style.flex = '44.8 1 0px'
          // Add the outline body to the pane, and let it push content down
          newOutlinePane.appendChild(outlineBody)
        })
      } else {
        newHeader.classList.replace('opened', 'closed')
        const outlineBody = newOutlinePane.querySelector('.outline-body')
        if (outlineBody) {
          newOutlinePane.removeChild(outlineBody) // Remove from DOM
        }
      }
      caretIcon.textContent = isHidden ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
      // headerButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false') // Toggle aria-expanded
    })
  }

  showCriteriaSidebar (defaultList = 0) {
    // Check if the sidebar already exists
    let existingSidebar = document.getElementById('criteriaSidebar')

    if (!existingSidebar) {
      // Create the sidebar
      let sidebar = document.createElement('div')
      sidebar.id = 'criteriaSidebar'
      sidebar.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <br>
        <h2 style="margin: 0; flex-grow: 1;">Ask PrompTeX</h2>
        <button id='closeSidebar' style="background-color: transparent; border: none; font-size: 16px; cursor: pointer; align-self: flex-start;">X</button>
        <hr>
      </div>
      <div id='dropdown-container'>
        <select id='criteriaSelector'>
          ${Object.keys(window.promptex.storageManager.client.getSchemas()).map(list => `<option value='${list}'>${list}</option>`).join('')}
        </select>
        <button id='importCriteriaBtn'>Import</button>
        <button id='addCategoryBtn'>+Category</button>
      </div>
      <div id='criteriaContent'></div>
      <div id='importForm' style='display: none'>
        <h3>Import Criteria List</h3>
        <label>Criteria List Name:</label>
        <input type='text' id='newListName' placeholder='Enter list name' />
        <label>Categories:</label>
        <textarea id='newCategories' placeholder='Enter categories and criteria (format: category1: criterion1, criterion2 category2: criterion3)' style='width: 100% height: 80px'></textarea>
        <button id='submitNewCriteria'>Save</button>
      </div>
      <hr>
    `
      document.body.appendChild(sidebar)
      this._sidebar = sidebar
      // Add event listener to the dropdown to dynamically load new criteria
      let selector = document.getElementById('criteriaSelector')
      selector.addEventListener('change', (event) => {
        this.loadCriteriaList(event.target.value, window.promptex.storageManager.client.getSchemas())
        this._currentCriteriaList = event.target.value
      })
      if (!this._currentCriteriaList) {
        // Load the default list (first list) when the sidebar first opens
        let defaultList = Object.keys(window.promptex.storageManager.client.getSchemas())[0]
        this.loadCriteriaList(defaultList, window.promptex.storageManager.client.getSchemas())
      } else {
        this.loadCriteriaList(this._currentCriteriaList, window.promptex.storageManager.client.getSchemas())
      }

      // Add event listener for 'Import' button
      let importBtn = document.getElementById('importCriteriaBtn')
      importBtn.addEventListener('click', () => {
        document.getElementById('importForm').style.display = 'block' // Show the import form
      })

      // Add event listener for 'Add Category' button
      let addCategoryBtn = document.getElementById('addCategoryBtn')
      addCategoryBtn.addEventListener('click', () => {
        this.addNewCategory()
      })

      // Add close functionality to the sidebar
      let closeButton = document.getElementById('closeSidebar')
      closeButton.addEventListener('click', () => {
        sidebar.remove() // Close the sidebar by removing it from the DOM
      })

      // Handle submitting new criteria
      let submitNewCriteriaBtn = document.getElementById('submitNewCriteria')
      submitNewCriteriaBtn.addEventListener('click', () => {
        this.importNewCriteriaList()
      })
    }
  }

  loadCriteriaList (listName, database) {
    let contentDiv = document.getElementById('criteriaContent')
    contentDiv.innerHTML = '' // Clear previous content
    if (database[listName]) {
      for (const category in database[listName]) {
        // Add a horizontal line between categories
        if (Object.keys(database[listName]).indexOf(category) !== 0) {
          let hr = document.createElement('hr')
          hr.classList.add('category-separator')
          contentDiv.appendChild(hr)
        }

        // Create a category container and append it to the main content div
        let categoryDiv = document.createElement('div')
        categoryDiv.classList.add('criteria-category')
        categoryDiv.innerHTML = `
        <div style='display: flex; align-items: center'>
          <h3 style='display: inline-block; margin-right: 10px;'>${category}</h3>
          <button class='addCriterionBtn' style='margin-left: auto;'>+</button>
        </div>
        <div class='criteria-buttons-container' style='display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;'></div>
      `
        contentDiv.appendChild(categoryDiv) // Append category to the main content

        // Get the container for the buttons
        let buttonsContainer = categoryDiv.querySelector('.criteria-buttons-container')

        // Add buttons for each criterion under this category
        for (const criterionLabel in database[listName][category]) {
          const criterion = database[listName][category][criterionLabel]
          let button = document.createElement('button')
          button.classList.add('criteria-button')
          button.textContent = criterionLabel // Use the criterion label as button text

          // Set the default color for the button (light grey)
          button.style.backgroundColor = '#d3d3d3' // Default light grey
          button.style.border = '1px solid black' // Border for all buttons
          button.style.borderRadius = '4px'
          button.style.fontWeight = 'bold'
          button.style.cursor = 'pointer'

          // Conditional styling based on the presence of Assessment (green, yellow, red)
          if (criterion.Assessment) {
            switch (criterion.Assessment.toLowerCase()) {
              case 'green':
                button.style.backgroundColor = '#b2f2bb' // Pastel green
                break
              case 'yellow':
                button.style.backgroundColor = '#ffecb3' // Pastel yellow
                break
              case 'red':
                button.style.backgroundColor = '#ffccd5' // Pastel red
                break
              default:
                button.style.backgroundColor = '#d3d3d3' // Default grey if no match
            }
          }

          // Append each button to the buttons container
          buttonsContainer.appendChild(button)

          // Add right-click (contextmenu) functionality to the criterion button
          button.addEventListener('contextmenu', (event) => {
            this.showContextMenu(event, listName, category, criterion, criterionLabel)
          })

          // Add click event to display the criterion details (Description, Assessment, Effort Value)
          button.addEventListener('click', () => {
            this.showCriterionDetails(criterionLabel, criterion)
          })
        }

        // Handle the '+' button for adding new criteria
        let addCriterionBtn = categoryDiv.querySelector('.addCriterionBtn')
        addCriterionBtn.addEventListener('click', () => {
          this.addNewCriterion(listName, category)
        })
      }
    }
  }

  // New method to display criterion details
  showCriterionDetails (label, criterionElement) {
    let info = 'This highlight is associated with ' + label + '<br><br><br>'
    if (criterionElement && criterionElement.Assessment && criterionElement.AssessmentDescription) {
      info += 'Assessment (' + criterionElement.Assessment + '): ' + criterionElement.AssessmentDescription + '<br><br>'
    }
    if (criterionElement && criterionElement.Suggestion) {
      info += 'Suggestion: ' + criterionElement.Suggestion + '<br><br><br>'
      if (criterionElement.EffortValue && criterionElement.EffortDescription) {
        info += '\nEffort Level: ' + criterionElement.EffortValue + '<br>'
        info += criterionElement.EffortDescription
      }
    }
    // Show alert with the tooltip message
    Alerts.infoAlert({title: 'Criterion Information', text: info})
  }

  // Function to show the context menu
  showContextMenu (event, listName, category, criterion, criterionLabel) {
    // Prevent the default context menu
    event.preventDefault()

    // Remove any existing context menu
    const existingMenu = document.getElementById('contextMenu')
    if (existingMenu) {
      existingMenu.remove()
    }

    // Create the context menu
    const menu = document.createElement('div')
    menu.id = 'contextMenu'
    menu.style.position = 'absolute'
    menu.style.top = `${event.clientY}px`
    menu.style.left = `${event.clientX}px`
    menu.style.backgroundColor = '#fff'
    menu.style.border = '1px solid #ccc'
    menu.style.padding = '10px'
    menu.style.zIndex = '9999'
    menu.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)'
    menu.innerHTML = `
    <ul style='list-style-type: none; padding: 0; margin: 0;'>
      <li style='padding: 5px 10px; cursor: pointer;' id='assessCriterion'>Assess</li>
      <li style='padding: 5px 10px; cursor: pointer;' id='editCriterion'>Edit</li>
      <li style='padding: 5px 10px; cursor: pointer;' id='deleteCriterion'>Delete</li>
    </ul>
  `

    document.body.appendChild(menu)

    // Add event listeners for context menu options
    document.getElementById('assessCriterion').addEventListener('click', () => {
      // alert(`Assessing: ${criterion}`)
      CriterionActions.askCriterionAssessment(criterionLabel, criterion.Description)
      menu.remove() // Remove menu after selection
    })

    document.getElementById('editCriterion').addEventListener('click', () => {
      this.editCriterion(listName, category, criterionLabel)
      menu.remove() // Remove menu after selection
    })

    document.getElementById('deleteCriterion').addEventListener('click', async () => {
      // this.deleteCriterion(listName, category, criterionLabel)
      // const documents = await OverleafUtils.getAllEditorContent()
      menu.remove() // Remove menu after selection
    })

    // Close the context menu if clicked outside
    document.addEventListener('click', () => {
      if (menu) {
        menu.remove()
      }
    }, { once: true })
  }

  // Function to handle criterion editing
  editCriterion (listName, category, criterion) {
    let newCriterionName = prompt(`Edit criterion '${criterion}':`, criterion)
    if (newCriterionName && newCriterionName !== criterion) {
      const index = window.promptex.storageManager.client.getSchemas()[listName][category].indexOf(criterion)
      window.promptex.storageManager.client.getSchemas()[listName][category][index] = newCriterionName
      this.loadCriteriaList(listName, window.promptex.storageManager.client.getSchemas()) // Reload the list to reflect changes
    }
  }

  // Function to handle criterion deletion
  deleteCriterion (listName, category, criterion) {
    const confirmed = confirm(`Are you sure you want to delete '${criterion}'?`)
    if (confirmed) {
      const index = window.promptex.storageManager.client.getSchemas()[listName][category].indexOf(criterion)
      if (index > -1) {
        window.promptex.storageManager.client.getSchemas()[listName][category].splice(index, 1) // Remove the criterion
        this.loadCriteriaList(listName, window.promptex.storageManager.client.getSchemas()) // Reload the list to reflect changes
      }
    }
  }
  // Function to add a new category to the selected criteria list
  addNewCategory () {
    let selectedList = document.getElementById('criteriaSelector').value // The selected list (e.g., Engineering Research, Action Research)
    let newCategoryName = prompt('Enter the name of the new category:')

    if (newCategoryName) {
      // Call CriteriaDatabaseClient to add the new category
      window.promptex.storageManager.client.addCategoryToCriteriaList(selectedList, newCategoryName)
        .then(() => {
          alert('Category added successfully')
        })
        .catch(err => {
          console.error('Failed to add category:', err)
          alert('Failed to add category')
        })
    }
  }

  // Function to add a new criterion to a category
  addNewCriterion (listName, category) {
    let newCriterionName = prompt(`Enter a new criterion name for the category '${category}':`)
    if (!newCriterionName) {
      alert('Criterion name cannot be empty.')
      return
    }

    let newCriterionDescription = prompt(`Enter a description for the criterion '${newCriterionName}':`)
    if (!newCriterionDescription) {
      alert('Criterion description cannot be empty.')
      return
    }

    // Call CriteriaDatabaseClient to add the new criterion with name and description
    window.promptex.storageManager.client.addCriterionToCategory(listName, category, newCriterionName, newCriterionDescription)
      .then(() => {
        alert('Criterion added successfully')
      })
      .catch(err => {
        console.error('Failed to add criterion:', err)
        alert('Failed to add criterion')
      })
  }

  importNewCriteriaList () {
    /* let newListName = document.getElementById('newListName').value.trim()
    let newCategories = document.getElementById('newCategories').value.trim()

    if (newListName && newCategories) {
      // Parse the categories and criteria
      let parsedData = {}
      newCategories.split(';').forEach(categoryBlock => {
        let [category, criteria] = categoryBlock.split(':')
        if (category && criteria) {
          parsedData[category.trim()] = criteria.split(',').map(c => c.trim())
        }
      })

      // Add the new list to the criteria database
      this.criteriaDatabase[newListName] = parsedData

      // Reload the dropdown to include the new list
      let selector = document.getElementById('criteriaSelector')
      selector.innerHTML = Object.keys(this.criteriaDatabase).map(list => `<option value='${list}'>${list}</option>`).join('')

      // Hide the import form and reset its values
      document.getElementById('importForm').style.display = 'none'
      document.getElementById('newListName').value = ''
      document.getElementById('newCategories').value = ''
    } else {
      alert('Please enter a list name and at least one category with criteria.')
    } */
  }

  // Helper function to generate random background color (optional)
  getRandomColor () {
    const colors = ['#f8c1c1', '#f9e09f', '#9fc9f8', '#f8c1f8', '#c1c1f8', '#d2c1a1', '#d1a19f', '#9fc1d2', '#c1f1c2', '#f8c7c1', '#a1c9f8']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  getProject () {
    // Get the current URL
    let currentURL = window.location.href

    // Use a regular expression to extract the project ID from the URL
    let projectID = currentURL.match(/project\/([a-zA-Z0-9]+)/)

    // If a project ID is found, return it; otherwise, return null
    if (projectID && projectID[1]) {
      return projectID[1] // projectID[1] contains the extracted project ID
    } else {
      console.error('Project ID not found in the URL')
      return null
    }
  }

  loadStorage (projectId, callback) {
    window.promptex.storageManager = new LocalStorageManager()
    window.promptex.storageManager.init(projectId, (err) => {
      if (err) {
        Alerts.errorAlert({text: 'Unable to initialize storage manager. Error: ' + err.message + '. ' +
            'Please reload webpage and try again.'})
      } else {
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }
}

module.exports = OverleafManager
