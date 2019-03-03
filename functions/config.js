// Web Url to be monitored
exports.webUrl = "https://www.nike.com/events-registration/series?id=3547" ;
// Regex for monitoring data extraction
// Can use null to monitor entire page
exports.contentRegex = /nike\.events\.content = \{.*:\{.*:.*\}\}/m ;
// Regex for removing non-JSON part from the content
exports.contentReplaceRegex = /(nike\.events\.content = )/ ;
// Axios POST header
exports.clientHeader = {
    "User-Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36"
};