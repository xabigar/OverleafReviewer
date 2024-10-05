
class DBManager {
  static saveCriterionAssessment (criterionLabel, description, cleanExcerpts, suggestion, sentiment, effortLevel = null, effortDescription = null) {
    // Access the database from the OverleafManager instance
    let db = window.promptex._overleafManager.criteriaDatabase

    // Check if the criterion exists in the database
    for (let category in db) {
      for (let subCategory in db[category]) {
        if (db[category][subCategory][criterionLabel]) {
          // Add annotations (excerpts) to the criterion's annotations array
          if (cleanExcerpts && Array.isArray(cleanExcerpts)) {
            db[category][subCategory][criterionLabel].Annotations.push(...cleanExcerpts)
          }

          // Add improvement suggestion to the criterion
          if (suggestion) {
            db[category][subCategory][criterionLabel].ImprovementSuggestion = suggestion
          }
          if (sentiment) {
            db[category][subCategory][criterionLabel].Assessment = sentiment
          }
          // Add effort level and description, if provided
          if (effortLevel !== null) {
            db[category][subCategory][criterionLabel]['Effort Value'] = effortLevel
          }

          if (effortDescription) {
            db[category][subCategory][criterionLabel].EffortDescription = effortDescription
          }

          console.log(`Updated criterion: ${criterionLabel}`)
          console.log(db[category][subCategory][criterionLabel])
          return
        }
      }
    }

    // If criterion is not found
    console.warn(`Criterion '${criterionLabel}' not found in the database.`)
  }
}

module.exports = DBManager
