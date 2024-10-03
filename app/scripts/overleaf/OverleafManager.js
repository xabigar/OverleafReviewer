const CriterionActions = require('./CriterionActions')

class OverleafManager {
  constructor() {
    this._project = null
    this.criteriaDatabase = {
      'Engineering Research': {
        'Essential Attributes': {
          'Artifact Detail': {
            'Description': 'Describes the proposed artifact in adequate detail.',
            'Assessment': null,
            'Effort Value': null
          },
          'Artifact Need': {
            'Description': 'Justifies the need for, usefulness of, or relevance of the proposed artifact.',
            'Assessment': null,
            'Effort Value': null
          },
          'Artifact Evaluation': {
            'Description': 'Conceptually evaluates the proposed artifact; discusses its strengths, weaknesses and limitations.',
            'Assessment': null,
            'Effort Value': null
          },
          'Empirical Evaluation': {
            'Description': 'Empirically evaluates the artifact using various methods: action research, case study, controlled experiment, simulation, benchmarking, or other methods.',
            'Assessment': null,
            'Effort Value': null
          },
          'Methodology Used': {
            'Description': 'Clearly indicates which empirical methodology is used.',
            'Assessment': null,
            'Effort Value': null
          },
          'Compare Alternatives': {
            'Description': 'Discusses or compares state-of-the-art alternatives and their strengths, weaknesses, or limitations.',
            'Assessment': null,
            'Effort Value': null
          },
          'Assumptions': {
            'Description': 'Assumptions are explicit, plausible, and align with the contributions goals.',
            'Assessment': null,
            'Effort Value': null
          },
          'Consistent Notation': {
            'Description': 'Uses notation consistently throughout.',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Desirable Attributes': {
          'Supplementary Materials': {
            'Description': 'Provides supplementary materials such as source code, description of the artifact, or input datasets.',
            'Assessment': null,
            'Effort Value': null
          },
          'Missing Justification': {
            'Description': 'Justifies any missing items from the replication package based on practical or ethical grounds.',
            'Assessment': null,
            'Effort Value': null
          },
          'Artifact Theory': {
            'Description': 'Discusses the theoretical basis of the artifact.',
            'Assessment': null,
            'Effort Value': null
          },
          'Correctness Proofs': {
            'Description': 'Provides correctness arguments for key contributions (e.g., theorems, complexity analyses).',
            'Assessment': null,
            'Effort Value': null
          },
          'Running Examples': {
            'Description': 'Includes running examples to elucidate the artifact.',
            'Assessment': null,
            'Effort Value': null
          },
          'Industry Evaluation': {
            'Description': 'Evaluates the artifact in an industry-relevant context (e.g., open-source projects).',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Extraordinary Attributes': {
          'Design Practices': {
            'Description': 'Contributes to understanding of design practices or principles.',
            'Assessment': null,
            'Effort Value': null
          },
          'Ground-breaking Innovations': {
            'Description': 'Presents ground-breaking innovations with real-world benefits.',
            'Assessment': null,
            'Effort Value': null
          }
        }
      },
      'Action Research': {
        'Essential Attributes': {
          'Justifies Site Selection': {
            'Description': 'Justifies the selection of the site(s) that was(were) studied.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Sites in Rich Detail': {
            'Description': 'Describes the site(s) in rich detail.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Researcher-Host Relationship': {
            'Description': 'Describes the relationship between the researcher and the host organization.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Intervention in Detail': {
            'Description': 'Describes the intervention(s) in detail.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes How Interventions Were Determined': {
            'Description': 'Describes how interventions were determined (e.g. by management, researchers, or a participative/co-determination process).',
            'Assessment': null,
            'Effort Value': null
          },
          'Explains Intervention Evaluation': {
            'Description': 'Explains how the interventions are evaluated.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Longitudinal Dimension': {
            'Description': 'Describes the longitudinal dimension of the research design (including the length of the study).',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Researcher-Host Interactions': {
            'Description': 'Describes the interactions between researcher(s) and host organization(s).',
            'Assessment': null,
            'Effort Value': null
          },
          'Explains Research Cycles or Phases': {
            'Description': 'Explains research cycles or phases, if any, and their relationship to the intervention(s).',
            'Assessment': null,
            'Effort Value': null
          },
          'Presents Clear Chain of Evidence': {
            'Description': 'Presents a clear chain of evidence from observations to findings.',
            'Assessment': null,
            'Effort Value': null
          },
          'Reports Participant or Stakeholder Reactions': {
            'Description': 'Reports participant or stakeholder reactions to interventions.',
            'Assessment': null,
            'Effort Value': null
          },
          'Reports Lessons Learned': {
            'Description': 'Reports lessons learned by the organization.',
            'Assessment': null,
            'Effort Value': null
          },
          'Researchers Reflect on Biases': {
            'Description': 'Researchers reflect on their own possible biases.',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Desirable Attributes': {
          'Provides Supplemental Materials': {
            'Description': 'Provides supplemental materials such as interview guide(s), coding schemes, coding examples, decision rules, or extended chain-of-evidence tables.',
            'Assessment': null,
            'Effort Value': null
          },
          'Uses Direct Quotations Extensively': {
            'Description': 'Uses direct quotations extensively.',
            'Assessment': null,
            'Effort Value': null
          },
          'Validates Results Using Member Checking': {
            'Description': 'Validates results using member checking, dialogical interviewing, feedback from non-participant practitioners or research audits of coding by advisors or other researchers.',
            'Assessment': null,
            'Effort Value': null
          },
          'Findings Transferable to Other Contexts': {
            'Description': 'Findings plausibly transferable to other contexts.',
            'Assessment': null,
            'Effort Value': null
          },
          'Triangulation Across Data Types': {
            'Description': 'Triangulation across quantitative and qualitative data.',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Extraordinary Attributes': {
          'Research Team with Triangulation': {
            'Description': 'Research team with triangulation across researchers to mitigate researcher bias.',
            'Assessment': null,
            'Effort Value': null
          }
        }
      },
      'Qualitative Studies': {
        'Essential Attributes': {
          'Explains How Interviewees Were Selected': {
            'Description': 'Explains how interviewees were selected.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Interviewees': {
            'Description': 'Describes interviewees (e.g. demographics, work roles).',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Interviewers': {
            'Description': 'Describes interviewer(s) (e.g. experience, perspective).',
            'Assessment': null,
            'Effort Value': null
          },
          'Presents Clear Chain of Evidence': {
            'Description': 'Presents clear chain of evidence from interviewee quotations to findings (e.g. proposed concepts).',
            'Assessment': null,
            'Effort Value': null
          },
          'Clearly Answers Research Question': {
            'Description': 'Clearly answers the research question(s).',
            'Assessment': null,
            'Effort Value': null
          },
          'Provides Evidence of Saturation': {
            'Description': 'Provides evidence of saturation; explains how saturation was achieved.',
            'Assessment': null,
            'Effort Value': null
          },
          'Researchers Reflect on Biases': {
            'Description': 'Researchers reflect on their own possible biases.',
            'Assessment': null,
            'Effort Value': null
          },
          'Identifies Key Issues': {
            'Description': 'Identifies key issues under consideration.',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Desirable Attributes': {
          'Provides Supplemental Materials': {
            'Description': 'Provides supplemental materials including interview guide(s), coding schemes, coding examples, decision rules, or extended chain-of-evidence table(s).',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Questions Asked': {
            'Description': 'Describes questions asked in data collection: content of central questions, form of questions (e.g. open vs. closed).',
            'Assessment': null,
            'Effort Value': null
          },
          'Includes Diverse Participants': {
            'Description': 'Includes highly diverse participants.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Researcher-Participant Interaction': {
            'Description': 'Describes the relationships and interactions between researchers and participants relevant to the research process.',
            'Assessment': null,
            'Effort Value': null
          },
          'Uses Direct Quotations Extensively': {
            'Description': 'Uses direct quotations extensively to support key points.',
            'Assessment': null,
            'Effort Value': null
          },
          'Identifies Data Recording Methods': {
            'Description': 'Identifies data recording methods (audio/visual), field notes or transcription processes used.',
            'Assessment': null,
            'Effort Value': null
          },
          'Evaluates or Develops Theory': {
            'Description': 'EITHER: Evaluates an a priori theory (or model, framework, taxonomy, etc.) using deductive coding with an a priori coding scheme, OR: synthesizes results into a new theory using inductive coding.',
            'Assessment': null,
            'Effort Value': null
          },
          'Validates Results': {
            'Description': 'Validates results using member checking, dialogical interviewing, feedback from non-participant practitioners or research audits of coding by advisors or other researchers.',
            'Assessment': null,
            'Effort Value': null
          },
          'Discusses Transferability': {
            'Description': 'Discusses transferability; findings plausibly transferable to different contexts.',
            'Assessment': null,
            'Effort Value': null
          },
          'Compares Results with Prior Research': {
            'Description': 'Compares results with (or integrates them into) prior theory or related research.',
            'Assessment': null,
            'Effort Value': null
          },
          'Reflects on Alternative Explanations': {
            'Description': 'Reflects on any alternative explanations of the findings.',
            'Assessment': null,
            'Effort Value': null
          },
          'Provides Contextual Information': {
            'Description': 'Provides relevant contextual information for findings.',
            'Assessment': null,
            'Effort Value': null
          },
          'Reflects on Bias in Analysis': {
            'Description': 'Reflects on how researchers’ biases may have affected their analysis.',
            'Assessment': null,
            'Effort Value': null
          },
          'Describes Ethics and Compensation': {
            'Description': 'Describes any incentives or compensation, and provides assurance of relevant ethical processes of data collection and consent process as relevant.',
            'Assessment': null,
            'Effort Value': null
          }
        },
        'Extraordinary Attributes': {
          'Employs Multiple Methods of Data Analysis': {
            'Description': 'Employs multiple methods of data analysis (e.g. open coding vs. process coding; manual coding vs. automated sentiment analysis) with method-triangulation.',
            'Assessment': null,
            'Effort Value': null
          },
          'Employs Longitudinal Design': {
            'Description': 'Employs longitudinal design (i.e. each interviewee participates multiple times) and analysis.',
            'Assessment': null,
            'Effort Value': null
          },
          'Employs Probabilistic Sampling Strategy': {
            'Description': 'Employs probabilistic sampling strategy; statistical analysis of response bias.',
            'Assessment': null,
            'Effort Value': null
          },
          'Uses Multiple Coders': {
            'Description': 'Uses multiple coders and analyzes inter-coder reliability (see IRR/IRA Supplement).',
            'Assessment': null,
            'Effort Value': null
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

  projectManagement() {
    let that = this
    let project = that.getProject()
    if (project) {
      that._project = project
      console.log('Project:', that._project)
    }
    that.addButton()
  }

  addButton () {
    // Create the 'Check Criteria' button element
    let checkCriteriaButton = document.createElement('div')
    checkCriteriaButton.classList.add('toolbar-item')
    checkCriteriaButton.innerHTML = `
      <button type='button' class='btn btn-full-height' id='checkCriteriaBtn'>
        <i class='fa fa-check-square-o fa-fw' aria-hidden='true'></i>
        <p class='toolbar-label'>Check Criteria</p>
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

  showCriteriaSidebar(defaultList) {
    // Check if the sidebar already exists
    let existingSidebar = document.getElementById('criteriaSidebar')

    if (!existingSidebar) {
      // Create the sidebar
      let sidebar = document.createElement('div')
      sidebar.id = 'criteriaSidebar'
      sidebar.innerHTML = `
      <h2>Criterion-driven review</h2>
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
      <button id='closeSidebar'>Close</button>
    `

      document.body.appendChild(sidebar)

      // Add event listener to the dropdown to dynamically load new criteria
      let selector = document.getElementById('criteriaSelector')
      selector.addEventListener('change', (event) => {
        this.loadCriteriaList(event.target.value, this.criteriaDatabase)
      })

      // Load the default list (first list) when the sidebar first opens
      this.loadCriteriaList(defaultList, this.criteriaDatabase)

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
      `;
        contentDiv.appendChild(categoryDiv); // Append category to the main content

        // Get the container for the buttons
        let buttonsContainer = categoryDiv.querySelector('.criteria-buttons-container');

        // Add buttons for each criterion under this category
        for (const criterionLabel in database[listName][category]) {
          const criterion = database[listName][category][criterionLabel];
          let button = document.createElement('button');
          button.classList.add('criteria-button');
          button.textContent = criterionLabel; // Use the criterion label as button text
          button.style.display = 'inline-block'; // Inline-block for proper layout
          button.style.padding = '5px 15px'; // Padding to fit text dynamically
          button.style.backgroundColor = this.getRandomColor(); // Random background color for each button
          button.style.border = '1px solid black'; // Add borders like in the image
          button.style.borderRadius = '4px'; // Slight border radius for smoothness
          button.style.fontWeight = 'bold';
          button.style.cursor = 'pointer'; // Change cursor for better UI

          // Append each button to the buttons container
          buttonsContainer.appendChild(button);

          // Add right-click (contextmenu) functionality to the criterion button
          button.addEventListener('contextmenu', (event) => {
            this.showContextMenu(event, listName, category, criterion, criterionLabel);
          });

          // Add click event to display the criterion details (Description, Assessment, Effort Value)
          button.addEventListener('click', () => {
            this.showCriterionDetails(criterionLabel, criterion);
          });
        }

        // Handle the '+' button for adding new criteria
        let addCriterionBtn = categoryDiv.querySelector('.addCriterionBtn');
        addCriterionBtn.addEventListener('click', () => {
          this.addNewCriterion(listName, category);
        });
      }
    }
  }

  // New method to display criterion details
  showCriterionDetails(label, criterion) {
    alert(`Criterion: ${label}\nDescription: ${criterion.Description}\nAssessment: ${criterion.Assessment}\nEffort Value: ${criterion['Effort Value']}`);
  }

// Function to show the context menu
  showContextMenu(event, listName, category, criterion, criterionLabel) {
    // Prevent the default context menu
    event.preventDefault();

    // Remove any existing context menu
    const existingMenu = document.getElementById('contextMenu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create the context menu
    const menu = document.createElement('div');
    menu.id = 'contextMenu';
    menu.style.position = 'absolute';
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.zIndex = '9999';
    menu.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
    menu.innerHTML = `
    <ul style='list-style-type: none; padding: 0; margin: 0;'>
      <li style='padding: 5px 10px; cursor: pointer;' id='assessCriterion'>Assess</li>
      <li style='padding: 5px 10px; cursor: pointer;' id='editCriterion'>Edit</li>
      <li style='padding: 5px 10px; cursor: pointer;' id='deleteCriterion'>Delete</li>
    </ul>
  `;

    document.body.appendChild(menu);

    // Add event listeners for context menu options
    document.getElementById('assessCriterion').addEventListener('click', () => {
      //alert(`Assessing: ${criterion}`);
      CriterionActions.askCriterionAssessment(criterionLabel, criterion.Description)
      menu.remove(); // Remove menu after selection
    });

    document.getElementById('editCriterion').addEventListener('click', () => {
      this.editCriterion(listName, category, criterionLabel);
      menu.remove(); // Remove menu after selection
    });

    document.getElementById('deleteCriterion').addEventListener('click', () => {
      this.deleteCriterion(listName, category, criterionLabel);
      menu.remove(); // Remove menu after selection
    });

    // Close the context menu if clicked outside
    document.addEventListener('click', () => {
      if (menu) {
        menu.remove();
      }
    }, { once: true });
  }

  // Function to handle criterion editing
  editCriterion (listName, category, criterion) {
    let newCriterionName = prompt(`Edit criterion '${criterion}':`, criterion);
    if (newCriterionName && newCriterionName !== criterion) {
      const index = this.criteriaDatabase[listName][category].indexOf(criterion);
      this.criteriaDatabase[listName][category][index] = newCriterionName;
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
    let selectedList = document.getElementById('criteriaSelector').value;
    let newCategoryName = prompt('Enter the name of the new category:');

    if (newCategoryName && !this.criteriaDatabase[selectedList][newCategoryName]) {
      this.criteriaDatabase[selectedList][newCategoryName] = [];
      this.loadCriteriaList(selectedList, this.criteriaDatabase);
    } else {
      alert('Category already exists or invalid name.');
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
      let parsedData = {};
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
    let projectID = currentURL.match(/project\/([a-zA-Z0-9]+)/);

    // If a project ID is found, return it; otherwise, return null
    if (projectID && projectID[1]) {
      return projectID[1] // projectID[1] contains the extracted project ID
    } else {
      console.error('Project ID not found in the URL')
      return null;
    }
  }
}

module.exports = OverleafManager
