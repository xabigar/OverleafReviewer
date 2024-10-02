const OverleafUtils = require('./OverleafUtils')

class OverleafManager {
  constructor() {
    this._project = null;
    this.criteriaDatabase = {
      "General": {
        "Premises": ["Major", "Minor I", "Minor II", "Conclusion"],
        "Critical Questions": ["CQ1", "CQ2", "CQ3", "CQ4", "CQ5", "CQ6", "CQ7", "CQ8"]
      },
      "Technical Evaluation": {
        "Evaluation Aspects": ["Correctness", "Reproducibility", "Efficiency"],
        "Important Questions": ["IQ1", "IQ2", "IQ3", "IQ4"]
      },
      "Usability Assessment": {
        "Usability Factors": ["Ease of Use", "Learning Curve", "Accessibility"],
        "User Feedback": ["UF1", "UF2", "UF3"]
      }
    };
  }

  init() {
    let that = this;
    let locator = 'i.fa.fa-home.fa-fw'; // CSS selector for the home icon
    let target = document.querySelector(locator);

    if (target == null) {
      // If the icon is not found, retry after 500ms
      window.setTimeout(() => {
        that.init(); // Replace this with the method you are calling (e.g., init)
      }, 500);
      return;
    }
    // If the home icon is found, perform your desired actions
    that.projectManagement(); // Replace this with the function handling actions when the icon is found
  }

  projectManagement() {
    let that = this;
    let project = that.getProject();
    if (project) {
      that._project = project;
      console.log('Project:', that._project);
    }
    that.addButton();
  }

  addButton() {
    // Create the "Check Criteria" button element
    let checkCriteriaButton = document.createElement('div');
    checkCriteriaButton.classList.add('toolbar-item');
    checkCriteriaButton.innerHTML = `
      <button type="button" class="btn btn-full-height" id="checkCriteriaBtn">
        <i class="fa fa-check-square-o fa-fw" aria-hidden="true"></i>
        <p class="toolbar-label">Check Criteria</p>
      </button>
    `;
    // Locate the toolbar where the button should be added
    let toolbar = document.querySelector('.toolbar-right');

    // Insert the "Check Criteria" button at the end of the toolbar list
    if (toolbar) {
      toolbar.appendChild(checkCriteriaButton);
    } else {
      console.error('Toolbar not found');
    }

    checkCriteriaButton.addEventListener('click', async () => {
      // const content = await OverleafUtils.getAllEditorContent();
      this.showCriteriaSidebar()
    })
  }

  showCriteriaSidebar(defaultList) {
    // Check if the sidebar already exists
    let existingSidebar = document.getElementById('criteriaSidebar');

    if (!existingSidebar) {
      // Create the sidebar
      let sidebar = document.createElement('div');
      sidebar.id = 'criteriaSidebar';
      sidebar.style.width = '355px';
      sidebar.style.height = '100%';
      sidebar.style.position = 'fixed';
      sidebar.style.top = '0';
      sidebar.style.right = '0';
      sidebar.style.backgroundColor = '#f1f1f1';
      sidebar.style.padding = '10px';
      sidebar.style.zIndex = '9999';
      sidebar.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      sidebar.innerHTML = `
      <h2>Criterion-driven review</h2>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <select id="criteriaSelector" style="flex-grow: 1;">
          ${Object.keys(this.criteriaDatabase).map(list => `<option value="${list}">${list}</option>`).join('')}
        </select>
        <button id="addCategoryBtn" style="margin-left: 10px;">+Category</button>
        <button id="importCriteriaBtn" style="margin-left: 10px;">Import</button>
      </div>
      <div id="criteriaContent" style="margin-top: 20px;"></div>
      <div id="importForm" style="display: none; margin-top: 20px;">
        <h3>Import Criteria List</h3>
        <label>Criteria List Name:</label>
        <input type="text" id="newListName" placeholder="Enter list name" />
        <label>Categories:</label>
        <textarea id="newCategories" placeholder="Enter categories and criteria (format: category1: criterion1, criterion2; category2: criterion3)" style="width: 100%; height: 80px;"></textarea>
        <button id="submitNewCriteria">Save</button>
      </div>
      <button id="closeSidebar" style="margin-top: 20px;">Close</button>
    `;

      document.body.appendChild(sidebar);

      // Add event listener to the dropdown to dynamically load new criteria
      let selector = document.getElementById('criteriaSelector');
      selector.addEventListener('change', (event) => {
        this.loadCriteriaList(event.target.value, this.criteriaDatabase);
      });

      // Load the default list (first list) when the sidebar first opens
      this.loadCriteriaList(defaultList, this.criteriaDatabase);

      // Add event listener for "Import" button
      let importBtn = document.getElementById('importCriteriaBtn');
      importBtn.addEventListener('click', () => {
        document.getElementById('importForm').style.display = 'block'; // Show the import form
      });

      // Add event listener for "Add Category" button
      let addCategoryBtn = document.getElementById('addCategoryBtn');
      addCategoryBtn.addEventListener('click', () => {
        this.addNewCategory();
      });

      // Add close functionality to the sidebar
      let closeButton = document.getElementById('closeSidebar');
      closeButton.addEventListener('click', () => {
        sidebar.remove(); // Close the sidebar by removing it from the DOM
      });

      // Handle submitting new criteria
      let submitNewCriteriaBtn = document.getElementById('submitNewCriteria');
      submitNewCriteriaBtn.addEventListener('click', () => {
        this.importNewCriteriaList();
      });
    }
  }

  loadCriteriaList(listName, database) {
    let contentDiv = document.getElementById('criteriaContent');
    contentDiv.innerHTML = ''; // Clear previous content

    if (database[listName]) {
      for (const category in database[listName]) {
        // Create a category container and append it to the main content div
        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('criteria-category');
        categoryDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
          <h3 style="display: inline-block; margin-right: 10px;">${category}</h3>
          <button class="addCriterionBtn" style="margin-left: auto;">+</button>
        </div>
        <div class="criteria-buttons-container" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;"></div>
      `;
        contentDiv.appendChild(categoryDiv); // Append category to the main content

        // Get the container for the buttons
        let buttonsContainer = categoryDiv.querySelector('.criteria-buttons-container');

        // Add buttons for each criterion under this category
        database[listName][category].forEach(item => {
          let button = document.createElement('button');
          button.classList.add('criteria-button');
          button.textContent = item;
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
            this.showContextMenu(event, listName, category, item);
          });
        });

        // Handle the "+" button for adding new criteria
        let addCriterionBtn = categoryDiv.querySelector('.addCriterionBtn');
        addCriterionBtn.addEventListener('click', () => {
          this.addNewCriterion(listName, category);
        });
      }
    }
  }

// Function to show the context menu
  showContextMenu(event, listName, category, criterion) {
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
    <ul style="list-style-type: none; padding: 0; margin: 0;">
      <li style="padding: 5px 10px; cursor: pointer;" id="assessCriterion">Assess</li>
      <li style="padding: 5px 10px; cursor: pointer;" id="editCriterion">Edit</li>
      <li style="padding: 5px 10px; cursor: pointer;" id="deleteCriterion">Delete</li>
    </ul>
  `;

    document.body.appendChild(menu);

    // Add event listeners for context menu options
    document.getElementById('assessCriterion').addEventListener('click', () => {
      alert(`Assessing: ${criterion}`);
      menu.remove(); // Remove menu after selection
    });

    document.getElementById('editCriterion').addEventListener('click', () => {
      this.editCriterion(listName, category, criterion);
      menu.remove(); // Remove menu after selection
    });

    document.getElementById('deleteCriterion').addEventListener('click', () => {
      this.deleteCriterion(listName, category, criterion);
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
  editCriterion(listName, category, criterion) {
    let newCriterionName = prompt(`Edit criterion "${criterion}":`, criterion);
    if (newCriterionName && newCriterionName !== criterion) {
      const index = this.criteriaDatabase[listName][category].indexOf(criterion);
      this.criteriaDatabase[listName][category][index] = newCriterionName;
      this.loadCriteriaList(listName, this.criteriaDatabase); // Reload the list to reflect changes
    }
  }

// Function to handle criterion deletion
  deleteCriterion(listName, category, criterion) {
    const confirmed = confirm(`Are you sure you want to delete "${criterion}"?`);
    if (confirmed) {
      const index = this.criteriaDatabase[listName][category].indexOf(criterion);
      if (index > -1) {
        this.criteriaDatabase[listName][category].splice(index, 1); // Remove the criterion
        this.loadCriteriaList(listName, this.criteriaDatabase); // Reload the list to reflect changes
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
  addNewCriterion(listName, category) {
    let newCriterion = prompt(`Enter a new criterion for the category "${category}":`);

    if (newCriterion && !this.criteriaDatabase[listName][category].includes(newCriterion)) {
      this.criteriaDatabase[listName][category].push(newCriterion);
      this.loadCriteriaList(listName, this.criteriaDatabase); // Reload the list to reflect the new criterion
    } else {
      alert('Criterion already exists or invalid input.');
    }
  }

  importNewCriteriaList() {
    let newListName = document.getElementById('newListName').value.trim();
    let newCategories = document.getElementById('newCategories').value.trim();

    if (newListName && newCategories) {
      // Parse the categories and criteria
      let parsedData = {};
      newCategories.split(';').forEach(categoryBlock => {
        let [category, criteria] = categoryBlock.split(':');
        if (category && criteria) {
          parsedData[category.trim()] = criteria.split(',').map(c => c.trim());
        }
      });

      // Add the new list to the criteria database
      this.criteriaDatabase[newListName] = parsedData;

      // Reload the dropdown to include the new list
      let selector = document.getElementById('criteriaSelector');
      selector.innerHTML = Object.keys(this.criteriaDatabase).map(list => `<option value="${list}">${list}</option>`).join('');

      // Hide the import form and reset its values
      document.getElementById('importForm').style.display = 'none';
      document.getElementById('newListName').value = '';
      document.getElementById('newCategories').value = '';
    } else {
      alert("Please enter a list name and at least one category with criteria.");
    }
  }

  // Helper function to generate random background color (optional)
  getRandomColor() {
    const colors = ['#f8c1c1', '#f9e09f', '#9fc9f8', '#f8c1f8', '#c1c1f8', '#d2c1a1', '#d1a19f', '#9fc1d2', '#c1f1c2', '#f8c7c1', '#a1c9f8']
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getProject() {
    // Get the current URL
    let currentURL = window.location.href;

    // Use a regular expression to extract the project ID from the URL
    let projectID = currentURL.match(/project\/([a-zA-Z0-9]+)/);

    // If a project ID is found, return it; otherwise, return null
    if (projectID && projectID[1]) {
      return projectID[1]; // projectID[1] contains the extracted project ID
    } else {
      console.error('Project ID not found in the URL');
      return null;
    }
  }
}

module.exports = OverleafManager;
