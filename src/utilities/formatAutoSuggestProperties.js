/**
 *
 * @param {property} inputProperties - property object for workflow
 * {
 *   defaultValue: String
 *   description: String
 *   key: String
 *   label: String
 *   required: Bool
 *   type: String
 * }
 */

function formatAutoSuggestProperties(inputProperties) {
  return inputProperties.map(property => ({
    value: `\${p:${property.key}}`,
    label: property.key
  }));
}

export default formatAutoSuggestProperties;
