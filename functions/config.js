// Web Url to be monitored
exports.webUrl = "https://nike.com/events-registration/series?id=3547" ;
// Regex for monitoring data extraction
// Can use null to monitor entire page
exports.contentRegex = /nike\.events\.content = \{.*:\{.*:.*\}\}/m ;
// Regex for removing non-JSON part from the content
exports.contentReplaceRegex = /(nike\.events\.content = )/ ;
