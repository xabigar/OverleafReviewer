class CriteriaDatabaseClient {
  constructor (database, manager) {
    this.criteriaDatabase = database
    this.manager = manager
  }
  // Retrieve a category (e.g., "Essential Attributes", "Desirable Attributes")
  getSchemas () {
    if (this.criteriaDatabase) {
      return this.criteriaDatabase
    }
    throw new Error(`No database found`)
  }

  // Retrieve a category (e.g., "Essential Attributes", "Desirable Attributes")
  getCategory (schema, category) {
    if (this.criteriaDatabase[schema] && this.criteriaDatabase[schema][category]) {
      return this.criteriaDatabase[schema][category]
    }
    throw new Error(`Category "${category}" does not exist for research type "${schema}"`)
  }

  // Retrieve a specific criterion (e.g., "Artifact Detail")
  getCriterion (schema, category, criterionName) {
    const categoryData = this.getCategory(schema, category)
    if (categoryData[criterionName]) {
      return categoryData[criterionName]
    }
    throw new Error(`Criterion "${criterionName}" does not exist in category "${category}" for research type "${schema}"`)
  }

  findCriterion (criterionName) {
    // Iterate through the criteria database
    for (const list in window.promptex.storageManager.client.getSchemas()) {
      for (const category in window.promptex.storageManager.client.getSchemas()[list]) {
        for (const criterion in window.promptex.storageManager.client.getSchemas()[list][category]) {
          if (criterion.toLowerCase() === criterionName.toLowerCase()) {
            return window.promptex.storageManager.client.getSchemas()[list][category][criterion]
          }
        }
      }
    }
    return null
  }

  updateSchemas (project, newSchemas) {
    return new Promise((resolve, reject) => {
      try {
        // Merge or replace the existing schemas with the provided newSchemas
        this.database = { ...this.database, ...newSchemas }

        // Save the updated database
        this.manager.saveDatabase(project, this.database, (err) => {
          if (err) {
            return reject(err)
          } else {
            resolve('Schemas updated successfully.')
          }
        })
      } catch (err) {
        return reject(new Error('Failed to update schemas: ' + err.message))
      }
    })
  }

  findCriterionInSchema (schema, criterionName) {
    // Iterate through the criteria database
    for (const category in window.promptex.storageManager.client.getSchemas()[schema]) {
      for (const criterion in window.promptex.storageManager.client.getSchemas()[schema][category]) {
        if (criterion.toLowerCase() === criterionName.toLowerCase()) {
          return window.promptex.storageManager.client.getSchemas()[schema][category][criterion]
        }
      }
    }
    return null
  }

  // Add a new category to a criteria list (e.g., 'Engineering Research')
  addCategoryToCriteriaList (listName, categoryName) {
    let projectID = window.promptex._overleafManager._project
    return new Promise((resolve, reject) => {
      // Check if the list exists in the database
      if (!this.criteriaDatabase[listName]) {
        return reject(new Error(`Criteria list '${listName}' does not exist.`))
      }

      // Check if the category already exists
      if (this.criteriaDatabase[listName][categoryName]) {
        return reject(new Error(`Category '${categoryName}' already exists in '${listName}'.`))
      }

      // Add the new category
      this.criteriaDatabase[listName][categoryName] = {}

      // Save the updated database
      this.manager.saveDatabase(projectID, this.criteriaDatabase, (err) => {
        if (err) {
          return reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // Update an existing criterion in a category
  updateCriterion (listName, criterionLabel, cleanExcerpts, suggestion, sentiment, effortLevel, effortDescription, assessmentDescription) {
    let projectID = window.promptex._overleafManager._project
    return new Promise((resolve, reject) => {
      // Check if the list exists
      if (!this.criteriaDatabase[listName]) {
        return reject(new Error(`Criteria list '${listName}' does not exist.`))
      }

      let criterion = this.findCriterionInSchema(listName, criterionLabel)

      // If criterion is not found, reject
      if (!criterion) {
        return reject(new Error(`Criterion '${criterionLabel}' does not exist in any category of '${listName}'.`))
      }

      // Update the criterion with the provided values
      criterion.Annotations = cleanExcerpts || criterion.Annotations // Update annotations if provided
      criterion.Suggestion = suggestion || criterion.Suggestion // Update suggestion if provided
      criterion.Assessment = sentiment || criterion.Assessment // Update assessment if provided
      criterion.EffortValue = effortLevel || criterion.EffortValue // Update effort level if provided
      criterion.EffortDescription = effortDescription || criterion.EffortDescription // Update effort description if provided
      criterion.AssessmentDescription = assessmentDescription || criterion.AssessmentDescription // Update assessment description if provided
      // Save the updated database
      this.manager.saveDatabase(projectID, this.criteriaDatabase, (err) => {
        if (err) {
          return reject(err)
        } else {
          resolve(`Criterion '${criterionLabel}' updated successfully.`)
        }
      })
    })
  }

  // Add a new criterion to an existing category with name and description
  addCriterionToCategory (listName, categoryName, criterionName, criterionDescription) {
    let projectID = window.promptex._overleafManager._project
    return new Promise((resolve, reject) => {
      // Check if the list exists
      if (!this.criteriaDatabase[listName]) {
        return reject(new Error(`Criteria list '${listName}' does not exist.`))
      }

      // Check if the category exists
      if (!this.criteriaDatabase[listName][categoryName]) {
        return reject(new Error(`Category '${categoryName}' does not exist in '${listName}'.`))
      }

      // Check if the criterion already exists
      if (this.criteriaDatabase[listName][categoryName][criterionName]) {
        return reject(new Error(`Criterion '${criterionName}' already exists in category '${categoryName}'.`))
      }

      // Add the new criterion with the given description
      this.criteriaDatabase[listName][categoryName][criterionName] = {
        'Description': criterionDescription,
        'Assessment': null,
        'EffortValue': null,
        'EffortDescription': null,
        'Annotations': []
      }

      // Save the updated database
      this.manager.saveDatabase(projectID, this.criteriaDatabase, (err) => {
        if (err) {
          return reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // Retrieve all annotations for a specific criterion
  getAnnotations (schema, category, criterionName) {
    const criterion = this.getCriterion(schema, category, criterionName)
    return criterion.Annotations
  }
}

module.exports = CriteriaDatabaseClient
