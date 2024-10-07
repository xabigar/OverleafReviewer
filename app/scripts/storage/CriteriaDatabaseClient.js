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
    throw new Error(`Category "${category}" does not exist for research type "${schema}"`);
  }

  // Retrieve a specific criterion (e.g., "Artifact Detail")
  getCriterion (schema, category, criterionName) {
    const categoryData = this.getCategory(schema, category)
    if (categoryData[criterionName]) {
      return categoryData[criterionName];
    }
    throw new Error(`Criterion "${criterionName}" does not exist in category "${category}" for research type "${schema}"`);
  }

  // Retrieve a specific criterion (e.g., "Artifact Detail")
  getCriterion (schema, category, criterionName) {
    const categoryData = this.getCategory(schema, category)
    if (categoryData[criterionName]) {
      return categoryData[criterionName];
    }
    throw new Error(`Criterion "${criterionName}" does not exist in category "${category}" for research type "${schema}"`);
  }

  // Update assessment for a specific criterion
  updateAssessment (schema, category, criterionName, newAssessment) {
    const criterion = this.getCriterion(schema, category, criterionName);
    criterion.Assessment = newAssessment;
  }

  // Update effort value and description for a specific criterion
  updateEffort (schema, category, criterionName, effortValue, effortDescription) {
    const criterion = this.getCriterion(schema, category, criterionName);
    criterion.EffortValue = effortValue
    criterion.EffortDescription = effortDescription
  }

  // Add an annotation to a specific criterion
  addAnnotation (schema, category, criterionName, annotation) {
    const criterion = this.getCriterion(schema, category, criterionName);
    criterion.Annotations.push(annotation);
  }

  // Retrieve all annotations for a specific criterion
  getAnnotations (schema, category, criterionName) {
    const criterion = this.getCriterion(schema, category, criterionName);
    return criterion.Annotations;
  }
}

module.exports = CriteriaDatabaseClient
