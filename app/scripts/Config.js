const Config = {
  review: {
    groupName: 'AnnotatorGPT',
    namespace: 'review',
    urlParamName: 'rag',
    defaultLLM: { modelType: 'openAI', model: 'gpt-4' },
    tags: { // Defined tags for the domain
      grouped: { // Grouped annotations
        group: 'criteria',
        subgroup: 'level',
        relation: 'isCriteriaOf'
      }
    }
  },
  prompts: {
    annotatePrompt: 'Research Paper Context: [The research paper is provided above as latex file]\n' +
      'Criterion for Evaluation: [C_NAME]\n' + 'Criterion Description: [C_DESCRIPTION]\n' +
      'Based on the above, please analyze the full research paper and generate a JSON response (Do not consider the abstract). The JSON should list at most THREE text excerpts of the paper, but not from paper\'s abstract,  that are associated with the criterion for evaluation and indicate whether it meets the specified criterion ("gree"), (“yellow”) or not ("red"). Add a item that qualifies the \'suggestion for improvement\' as \'red\', \'yellow\' and \' green\' depending on the effort required for the novel research to conduct this effort (time needed, resource availabilty in terms of subject availability, money or software skills). The format should be as follows:\n' +
      '{\n' +
      '"assessment": "[assess whether the criterion is met]",\n' +
      '"sentiment": "[based on one of these values: green/yellow/red]",\n' +
      '"suggestionForImprovement": "[suggestion for improvement]",\n' +
      '"effortLevel": "[qualifies the \'sgugestion for improvement\' as \'Red\', \'Yellow\' or \' Green\' depending on the effort required for the novel research to conduct this effort (time needed, resource availabilty in terms of subject availability, money or software skills) ]",\n' +
      '"effortDescription": "[describe the effort]",\n' +
      '"claims": [\n' +
      '{\n' +
      '"excerpt": "[A text fragment that supports evidence for the criterion assessment. IMPORTANT! maintain the latex source text as it is in the original. IT is really important. Avoid including \\section{} and \\subsection{} commands]",\n' +
      '},\n' +
      '{\n' +
      '"excerpt": "[A text fragment that supports evidence for the criterion assessment. IMPORTANT! maintain the latex source text as it is in the original. IT is really important. Avoid including \\section{} and \\subsection{} commands]",\n' +
      '},\n' +
      '{\n' +
      '"excerpt": "[A text fragment that supports evidence for the criterion assessment. IMPORTANT! maintain the latex source text as it is in the original. IT is really important. Avoid including \\section{} and \\subsection{} commands]",\n' +
      '},\n' +
      ']\n' +
      '}\n' +
      'When using this prompt, replace the placeholders with the actual content of the research paper and the specific criterion details.\n',
    compilePrompt: 'Research Paper Context: [The research paper is provided above]\n' +
      'Criterion for Evaluation: [C_NAME]\n' +
      'Criterion Description: [C_DESCRIPTION]\n' +
      'Paragraphs: [C_EXCERPTS]\n' +
      'Based on the above, you have to act as an academic reviewer and assess. For the criterion, you have to assess if it is met considering these possible results:' + ' Met, Partially met, or Not met. Then, you have to explain why it is met or not met. Base your opinion mainly in the above paragraphs. The JSON format should be as follows:\n' +
      '{\n' +
      '"name": "[Criterion Name]",\n' +
      '"sentiment": "[Met/Partially met/Not met]",\n' +
      '"comment": "[the reason of the results, if you mention one of the paragraphs in your comment reference the full paragraphs instead of the paragraph number]",\n' +
      '}\n' +
      'When using this prompt, replace the placeholders with the actual content of the research paper and the specific criterion details.\n',
    alternativePrompt: 'Research Paper Context: [The research paper is provided above]\n' +
      'Criterion for Evaluation: [C_NAME]\n' +
      'Criterion Description: [C_DESCRIPTION]\n' +
      'Paragraphs: [C_EXCERPTS]\n' +
      'You have to act as an academic reviewer and generate multiple alternative view points for the asessed criterion (Positive Viewpoint, Critical Viewpoint, Constructive Viewpoint, Alternative Viewpoint). Base on the above and base your opinion mainly in the above Paragraphs to analyze the full research paper and generate a JSON response. The JSON format should be as follows:\n' +
      '{\n' +
      '"name": "[Criterion Name]",\n' +
      '"answer": [provide different viewpoints in different bullet points using dashes (all in a single string), you have to put a "</br>" before each dash like "</br>-". You have to mark the different view point with bold xml tags (<b>). All the content must be specified in the answer key, without creating keys inside, if you mention one of the paragraphs in your answer reference the full paragraphs instead of the paragraph number)],\n' +
      '}\n' +
      'When using this prompt, replace the placeholders with the actual content of the research paper and the specific criterion details.\n',
    factCheckingPrompt: 'Fack check the following text <text>[C_EXCERPT]</text>.' +
      ' You have to provide the response in JSON format with' +
      ' the following key: -"answer" (the answer to the question. all the content must be specified in the answer key, without creating keys inside),',
    socialJudgePrompt: 'Is it socially appropriate to say the following text? <text>[C_EXCERPT]<text> as important.' +
      ' You have to provide the response in JSON format with' +
      ' the following keys: -"name" (contains the criteria name), -"answer" (the answer to the question. all the content must be specified in the answer key, without creating keys inside),',
    clarifyPrompt: 'I asked you to assess the following criterion for the provided research paper <criterion>[C_NAME]</criterion> and your considered the text excerpt found in triple quoted text <criterion>[C_EXCERPT]</criterion> as important. Therefore, now I would like to ask you [C_QUESTION]?' +
      ' You have to provide the response only in JSON format with a single key, which is answer' +
      ' the following keys: -"answer" (the answer to the question. all the content must be specified in the answer key, without creating keys inside),' +
      ' do not add more text to your answer apart from the json with the answer in the "answer key"'
  }
}

module.exports = Config
