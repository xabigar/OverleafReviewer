const CriterionActions = require('./CriterionActions')
const OverleafUtils = require('./OverleafUtils')

class OverleafManager {
  constructor () {
    this._project = null
    this._currentCriteriaList = null
    this.criteriaDatabase = {
      'Engineering Research': {
        'Essential Attributes': {
          'Artifact Detail': {
            'Description': 'Describes the proposed artifact in adequate detail.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Artifact Need': {
            'Description': 'Justifies the need for, usefulness of, or relevance of the proposed artifact.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Artifact Evaluation': {
            'Description': 'Conceptually evaluates the proposed artifact; discusses its strengths, weaknesses and limitations.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Empirical Evaluation': {
            'Description': 'Empirically evaluates the artifact using various methods: action research, case study, controlled experiment, simulation, benchmarking, or other methods.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Methodology Used': {
            'Description': 'Clearly indicates which empirical methodology is used.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Compare Alternatives': {
            'Description': 'Discusses or compares state-of-the-art alternatives and their strengths, weaknesses, or limitations.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Assumptions': {
            'Description': 'Assumptions are explicit, plausible, and align with the contributions goals.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Consistent Notation': {
            'Description': 'Uses notation consistently throughout.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Desirable Attributes': {
          'Supplementary Materials': {
            'Description': 'Provides supplementary materials such as source code, description of the artifact, or input datasets.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Missing Justification': {
            'Description': 'Justifies any missing items from the replication package based on practical or ethical grounds.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Artifact Theory': {
            'Description': 'Discusses the theoretical basis of the artifact.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Correctness Proofs': {
            'Description': 'Provides correctness arguments for key contributions (e.g., theorems, complexity analyses).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Running Examples': {
            'Description': 'Includes running examples to elucidate the artifact.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Industry Evaluation': {
            'Description': 'Evaluates the artifact in an industry-relevant context (e.g., open-source projects).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Extraordinary Attributes': {
          'Design Practices': {
            'Description': 'Contributes to understanding of design practices or principles.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Ground-breaking Innovations': {
            'Description': 'Presents ground-breaking innovations with real-world benefits.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        }
      },
      'Action Research': {
        'Essential Attributes': {
          'Justifies Site Selection': {
            'Description': 'Justifies the selection of the site(s) that was(were) studied.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Sites in Rich Detail': {
            'Description': 'Describes the site(s) in rich detail.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Researcher-Host Relationship': {
            'Description': 'Describes the relationship between the researcher and the host organization.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Intervention in Detail': {
            'Description': 'Describes the intervention(s) in detail.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes How Interventions Were Determined': {
            'Description': 'Describes how interventions were determined (e.g. by management, researchers, or a participative/co-determination process).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Explains Intervention Evaluation': {
            'Description': 'Explains how the interventions are evaluated.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Longitudinal Dimension': {
            'Description': 'Describes the longitudinal dimension of the research design (including the length of the study).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Researcher-Host Interactions': {
            'Description': 'Describes the interactions between researcher(s) and host organization(s).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Explains Research Cycles or Phases': {
            'Description': 'Explains research cycles or phases, if any, and their relationship to the intervention(s).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Presents Clear Chain of Evidence': {
            'Description': 'Presents a clear chain of evidence from observations to findings.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Reports Participant or Stakeholder Reactions': {
            'Description': 'Reports participant or stakeholder reactions to interventions.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Reports Lessons Learned': {
            'Description': 'Reports lessons learned by the organization.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Researchers Reflect on Biases': {
            'Description': 'Researchers reflect on their own possible biases.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Desirable Attributes': {
          'Provides Supplemental Materials': {
            'Description': 'Provides supplemental materials such as interview guide(s), coding schemes, coding examples, decision rules, or extended chain-of-evidence tables.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Uses Direct Quotations Extensively': {
            'Description': 'Uses direct quotations extensively.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Validates Results Using Member Checking': {
            'Description': 'Validates results using member checking, dialogical interviewing, feedback from non-participant practitioners or research audits of coding by advisors or other researchers.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Findings Transferable to Other Contexts': {
            'Description': 'Findings plausibly transferable to other contexts.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Triangulation Across Data Types': {
            'Description': 'Triangulation across quantitative and qualitative data.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Extraordinary Attributes': {
          'Research Team with Triangulation': {
            'Description': 'Research team with triangulation across researchers to mitigate researcher bias.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        }
      },
      'Qualitative Studies': {
        'Essential Attributes': {
          'Explains How Interviewees Were Selected': {
            'Description': 'Explains how interviewees were selected.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Interviewees': {
            'Description': 'Describes interviewees (e.g. demographics, work roles).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Interviewers': {
            'Description': 'Describes interviewer(s) (e.g. experience, perspective).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Presents Clear Chain of Evidence': {
            'Description': 'Presents clear chain of evidence from interviewee quotations to findings (e.g. proposed concepts).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Clearly Answers Research Question': {
            'Description': 'Clearly answers the research question(s).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Provides Evidence of Saturation': {
            'Description': 'Provides evidence of saturation; explains how saturation was achieved.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Researchers Reflect on Biases': {
            'Description': 'Researchers reflect on their own possible biases.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Identifies Key Issues': {
            'Description': 'Identifies key issues under consideration.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Desirable Attributes': {
          'Provides Supplemental Materials': {
            'Description': 'Provides supplemental materials including interview guide(s), coding schemes, coding examples, decision rules, or extended chain-of-evidence table(s).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Questions Asked': {
            'Description': 'Describes questions asked in data collection: content of central questions, form of questions (e.g. open vs. closed).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Includes Diverse Participants': {
            'Description': 'Includes highly diverse participants.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Researcher-Participant Interaction': {
            'Description': 'Describes the relationships and interactions between researchers and participants relevant to the research process.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Uses Direct Quotations Extensively': {
            'Description': 'Uses direct quotations extensively to support key points.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Identifies Data Recording Methods': {
            'Description': 'Identifies data recording methods (audio/visual), field notes or transcription processes used.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Evaluates or Develops Theory': {
            'Description': 'EITHER: Evaluates an a priori theory (or model, framework, taxonomy, etc.) using deductive coding with an a priori coding scheme, OR: synthesizes results into a new theory using inductive coding.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Validates Results': {
            'Description': 'Validates results using member checking, dialogical interviewing, feedback from non-participant practitioners or research audits of coding by advisors or other researchers.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Discusses Transferability': {
            'Description': 'Discusses transferability; findings plausibly transferable to different contexts.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Compares Results with Prior Research': {
            'Description': 'Compares results with (or integrates them into) prior theory or related research.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Reflects on Alternative Explanations': {
            'Description': 'Reflects on any alternative explanations of the findings.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Provides Contextual Information': {
            'Description': 'Provides relevant contextual information for findings.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Reflects on Bias in Analysis': {
            'Description': 'Reflects on how researchers’ biases may have affected their analysis.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Describes Ethics and Compensation': {
            'Description': 'Describes any incentives or compensation, and provides assurance of relevant ethical processes of data collection and consent process as relevant.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        },
        'Extraordinary Attributes': {
          'Employs Multiple Methods of Data Analysis': {
            'Description': 'Employs multiple methods of data analysis (e.g. open coding vs. process coding; manual coding vs. automated sentiment analysis) with method-triangulation.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Employs Longitudinal Design': {
            'Description': 'Employs longitudinal design (i.e. each interviewee participates multiple times) and analysis.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Employs Probabilistic Sampling Strategy': {
            'Description': 'Employs probabilistic sampling strategy; statistical analysis of response bias.',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          },
          'Uses Multiple Coders': {
            'Description': 'Uses multiple coders and analyzes inter-coder reliability (see IRR/IRA Supplement).',
            'Assessment': null,
            'Effort Value': null,
            'Annotations': []
          }
        }
      }
    }
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
      that._project = project
      console.log('Project:', that._project)
    }
    that.addButton()
    that.addOutlineButton()
    that.monitorEditorContent()
  }

  monitorEditorContent () {
    // Use setInterval to check every second (1000ms)
    setInterval(() => {
      // Get all elements with the class 'ol-cm-command-promptex'
      let elements = document.querySelectorAll('.ol-cm-command-promptex');

      elements.forEach((element) => {
        // Find the first .ol-cm-command-textit inside the element
        let commandTextit = element.querySelector('.ol-cm-command-textit');

        if (commandTextit) {
          // Extract the text content from the .ol-cm-command-textit element
          let commandText = commandTextit.textContent;
          let criterion = ''
          // Log the content for debugging
          console.log('PrompTeX Command Found:', commandText);

          // Check if the content matches the format 'text::number'
          const match = commandText.match(/(.*)::(\d+)/);

          if (match) {
            criterion = match[1];
            const number = parseInt(match[2], 10);

            // Apply background color based on the number
            if (number === 0) {
              element.style.backgroundColor = 'green'; // Set background to green
            } else if (number === 1) {
              element.style.backgroundColor = 'yellow'; // Set background to yellow
            } else if (number === 2) {
              element.style.backgroundColor = 'red'; // Set background to red
            } else {
              element.style.backgroundColor = ''; // Reset background for other cases
            }
          }

          // Set the display of the first .ol-cm-command-textit element to 'none'
          commandTextit.style.display = 'none';
          // Hide the first two .tok-punctuation.ol-cm-punctuation elements
          const previousSibling = element.previousElementSibling;
          const secondPreviousSibling = previousSibling?.previousElementSibling;
          const nextSibling = element.nextElementSibling
          if (previousSibling && secondPreviousSibling) {
            previousSibling.style.display = 'none'; // cm-matchingBracket
            secondPreviousSibling.style.display = 'none'; // \promptex
            nextSibling.style.display = 'none'; // cm-punctuation
            // firstBracket.style.display = 'none'; // cm-punctuation
          }
          // Select all elements with both classes 'tok-punctuation' and 'ol-cm-punctuation' inside the current item
          element.querySelectorAll('.tok-punctuation.ol-cm-punctuation').forEach(punctuationElement => {
            // Hide the punctuation element by setting display to 'none'
            punctuationElement.style.display = 'none';
          })
          // Add tooltip to the element
          // if right-clicked, show a context menu
          let criterionElement = this.findCriterion(criterion)
          element.title = 'This is a PrompTeX command: ' + criterionElement.Description;
          element.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevent the default right-click menu

            // Show alert with the tooltip message
            alert('This is a PrompTeX command: ' + criterionElement.Description);
            return false; // Additional return to ensure default action is canceled

          })
          // element.title = criterion ? criterion.Description : 'No criterion found';
        }
      });
    }, 1000); // Every second
  }

  findCriterion (text) {
    // Iterate through the criteria database
    for (const list in this.criteriaDatabase) {
      for (const category in this.criteriaDatabase[list]) {
        for (const criterion in this.criteriaDatabase[list][category]) {
          if (criterion.toLowerCase() === text.toLowerCase()) {
            return this.criteriaDatabase[list][category][criterion];
          }
        }
      }
    }
    return null;
  }

  addButton () {
    // Create the 'Check Criteria' button element
    let checkCriteriaButton = document.createElement('div')
    checkCriteriaButton.classList.add('toolbar-item')
    checkCriteriaButton.innerHTML = `
      <button type='button' class='btn btn-full-height' id='checkCriteriaBtn'>
        <i class='fa fa-check-square-o fa-fw' aria-hidden='true'></i>
        <p class='toolbar-label'>Ask AI</p>
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

  wrapFirstChildTextInSpan (element) {
    const firstChild = element.firstChild
    // Check if the first child is a text node
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
      // Create a new span element
      const span = document.createElement('span')
      // Set the text content of the span to the firstChild's text content
      span.textContent = firstChild.textContent
      // Replace the text node with the span element
      element.replaceChild(span, firstChild)
      console.log('Wrapped the firstChild text inside a <span>.')
    } else {
      console.log('The first child is not a text node.')
    }
  }

  getFirstElementOrTextNode (element) {
    const firstChild = element.firstChild

    if (firstChild) {
      if (firstChild.nodeType === Node.ELEMENT_NODE && firstChild.tagName.toLowerCase() === 'span') {
        console.log("The first child is a <span> element.")
        return firstChild;
      } else if (firstChild.nodeType === Node.TEXT_NODE) {
        console.log("The first child is a text node.")
        return firstChild;
      } else {
        console.log("The first child is neither a <span> nor a text node.")
      }
    } else {
      console.log("The element has no children.")
    }

    return null; // If no matching node is found
  }

  addOutlineButton() {
    // Structure of the content you provided
    const outlineContent = {
      'Essential Attributes': ['Artifact', 'Evaluation'],
      'Desirable Attributes': ['Evaluation', 'Methodology'],
      'Extraordinary Attributes': ['Innovation']
    }

    // Create the container for the new outline
    const outlineContainer = document.querySelector('.outline-container')

    // Create a new pane for the outline
    const newOutlinePane = document.createElement('div')
    newOutlinePane.classList.add('outline-pane')

    // Create the header for the new outline
    const newHeader = document.createElement('header')
    newHeader.classList.add('outline-header')

    const headerButton = document.createElement('button')
    headerButton.classList.add('outline-header-expand-collapse-btn')
    headerButton.setAttribute('aria-label', 'Show Foundation outline')
    headerButton.setAttribute('aria-expanded', 'false') // Initially collapsed

    const caretIcon = document.createElement('span')
    caretIcon.classList.add('material-symbols', 'outline-caret-icon')
    caretIcon.setAttribute('aria-hidden', 'true')
    caretIcon.textContent = 'keyboard_arrow_right' // Initially right arrow (collapsed)

    const headerTitle = document.createElement('h4')
    headerTitle.classList.add('outline-header-name')
    headerTitle.textContent = 'Foundation outline' // Update title to "Foundation outline"

    // Append the caret and title to the header button, and the button to the header
    headerButton.appendChild(caretIcon)
    headerButton.appendChild(headerTitle)
    newHeader.appendChild(headerButton)
    newOutlinePane.appendChild(newHeader)

    // Create the body for the new outline (initially hidden)
    const outlineBody = document.createElement('div')
    outlineBody.classList.add('outline-body')
    outlineBody.style.display = 'none' // Hidden by default

    // Create the root list for the items
    const rootList = document.createElement('ul')
    rootList.classList.add('outline-item-list', 'outline-item-list-root')
    rootList.setAttribute('role', 'tree')
    outlineBody.appendChild(rootList)

    // Append outline body to the pane
    newOutlinePane.appendChild(outlineBody)

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
      const isHidden = outlineBody.style.display === 'none'
      outlineBody.style.display = isHidden ? 'block' : 'none'
      caretIcon.textContent = isHidden ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
      headerButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false') // Toggle aria-expanded
    })

    // Helper function to create list items
    const createListItem = (label) => {
      const li = document.createElement('li')
      li.classList.add('outline-item', 'outline-item-no-children')
      li.setAttribute('role', 'treeitem')

      const div = document.createElement('div')
      div.classList.add('outline-item-row')

      const button = document.createElement('button')
      button.classList.add('outline-item-link')
      button.textContent = label

      div.appendChild(button)
      li.appendChild(div)

      return li
    }

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
  }

  showCriteriaSidebar (defaultList = 'Engineering Research') {
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
          ${Object.keys(this.criteriaDatabase).map(list => `<option value='${list}'>${list}</option>`).join('')}
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

      // Add event listener to the dropdown to dynamically load new criteria
      let selector = document.getElementById('criteriaSelector')
      selector.addEventListener('change', (event) => {
        this.loadCriteriaList(event.target.value, this.criteriaDatabase)
        this._currentCriteriaList = event.target.value
      })
      if (!this._currentCriteriaList) {
        // Load the default list (first list) when the sidebar first opens
        this.loadCriteriaList(defaultList, this.criteriaDatabase)
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
        <div style='display: flex; align-items: center;'>
          <h3 style='display: inline-block; margin-right: 10px;'>${category}</h3>
          <button class='addCriterionBtn' style='margin-left: auto;'>+</button>
        </div>
        <div class='criteria-buttons-container' style='display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;'></div>
      `
        contentDiv.appendChild(categoryDiv) // Append category to the main content

        // Get the container for the buttons
        let buttonsContainer = categoryDiv.querySelector('.criteria-buttons-container');

        // Add buttons for each criterion under this category
        for (const criterionLabel in database[listName][category]) {
          const criterion = database[listName][category][criterionLabel]
          let button = document.createElement('button')
          button.classList.add('criteria-button')
          button.textContent = criterionLabel // Use the criterion label as button text
          button.style.display = 'inline-block' // Inline-block for proper layout
          button.style.padding = '5px 15px' // Padding to fit text dynamically
          button.style.backgroundColor = this.getRandomColor() // Random background color for each button
          button.style.border = '1px solid black' // Add borders like in the image
          button.style.borderRadius = '4px' // Slight border radius for smoothness
          button.style.fontWeight = 'bold'
          button.style.cursor = 'pointer' // Change cursor for better UI

          // Append each button to the buttons container
          buttonsContainer.appendChild(button)

          // Add right-click (contextmenu) functionality to the criterion button
          button.addEventListener('contextmenu', (event) => {
            this.showContextMenu(event, listName, category, criterion, criterionLabel)
          });

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
  showCriterionDetails(label, criterion) {
    alert(`Criterion: ${label}\nDescription: ${criterion.Description}\nAssessment: ${criterion.Assessment}\nEffort Value: ${criterion['Effort Value']}`);
  }

  // Function to show the context menu
  showContextMenu (event, listName, category, criterion, criterionLabel) {
    // Prevent the default context menu
    event.preventDefault()

    // Remove any existing context menu
    const existingMenu = document.getElementById('contextMenu');
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
      //alert(`Assessing: ${criterion}`)
      CriterionActions.askCriterionAssessment(criterionLabel, criterion.Description)
      menu.remove() // Remove menu after selection
    })

    document.getElementById('editCriterion').addEventListener('click', () => {
      this.editCriterion(listName, category, criterionLabel)
      menu.remove() // Remove menu after selection
    })

    document.getElementById('deleteCriterion').addEventListener('click', async () => {
      // this.deleteCriterion(listName, category, criterionLabel)
      const documents = await OverleafUtils.getAllEditorContent()
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
      const index = this.criteriaDatabase[listName][category].indexOf(criterion)
      this.criteriaDatabase[listName][category][index] = newCriterionName
      this.loadCriteriaList(listName, this.criteriaDatabase); // Reload the list to reflect changes
    }
  }

  // Function to handle criterion deletion
  deleteCriterion (listName, category, criterion) {
    const confirmed = confirm(`Are you sure you want to delete '${criterion}'?`)
    if (confirmed) {
      const index = this.criteriaDatabase[listName][category].indexOf(criterion)
      if (index > -1) {
        this.criteriaDatabase[listName][category].splice(index, 1) // Remove the criterion
        this.loadCriteriaList(listName, this.criteriaDatabase) // Reload the list to reflect changes
      }
    }
  }
  // Function to add a new category to the selected criteria list
  addNewCategory() {
    let selectedList = document.getElementById('criteriaSelector').value
    let newCategoryName = prompt('Enter the name of the new category:')

    if (newCategoryName && !this.criteriaDatabase[selectedList][newCategoryName]) {
      this.criteriaDatabase[selectedList][newCategoryName] = []
      this.loadCriteriaList(selectedList, this.criteriaDatabase)
    } else {
      alert('Category already exists or invalid name.')
    }
  }

  // Function to add a new criterion to a category
  addNewCriterion (listName, category) {
    let newCriterion = prompt(`Enter a new criterion for the category '${category}':`)

    if (newCriterion && !this.criteriaDatabase[listName][category].includes(newCriterion)) {
      this.criteriaDatabase[listName][category].push(newCriterion)
      this.loadCriteriaList(listName, this.criteriaDatabase) // Reload the list to reflect the new criterion
    } else {
      alert('Criterion already exists or invalid input.')
    }
  }

  importNewCriteriaList() {
    let newListName = document.getElementById('newListName').value.trim()
    let newCategories = document.getElementById('newCategories').value.trim()

    if (newListName && newCategories) {
      // Parse the categories and criteria
      let parsedData = {}
      newCategories.split(';').forEach(categoryBlock => {
        let [category, criteria] = categoryBlock.split(':')
        if (category && criteria) {
          parsedData[category.trim()] = criteria.split(',').map(c => c.trim())
        }
      });

      // Add the new list to the criteria database
      this.criteriaDatabase[newListName] = parsedData;

      // Reload the dropdown to include the new list
      let selector = document.getElementById('criteriaSelector')
      selector.innerHTML = Object.keys(this.criteriaDatabase).map(list => `<option value='${list}'>${list}</option>`).join('');

      // Hide the import form and reset its values
      document.getElementById('importForm').style.display = 'none'
      document.getElementById('newListName').value = ''
      document.getElementById('newCategories').value = ''
    } else {
      alert('Please enter a list name and at least one category with criteria.')
    }
  }

  // Helper function to generate random background color (optional)
  getRandomColor() {
    const colors = ['#f8c1c1', '#f9e09f', '#9fc9f8', '#f8c1f8', '#c1c1f8', '#d2c1a1', '#d1a19f', '#9fc1d2', '#c1f1c2', '#f8c7c1', '#a1c9f8']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  getProject() {
    // Get the current URL
    let currentURL = window.location.href;

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
}

module.exports = OverleafManager
