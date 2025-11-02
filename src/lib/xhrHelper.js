
export function readXhrResponse(xhr) {
  if (!xhr) return null;

  try {
    var jsonData = xhr.responseType === 'json' ? xhr.response : xhr.responseText;


    if (typeof jsonData === 'string') {
      // Try to parse JSON strings, otherwise return the raw text
      try {
        return JSON.parse(jsonData);
      } catch (e) {
        return jsonData;
      }
           }

    // Already an object (parsed JSON) or other type
    return jsonData;
  } catch (err) {
    // Defensive: accessing responseText can throw if responseType is not compatible
    // Fallback to xhr.response if available, else null
    try {
      return xhr.response ?? null;
    } catch (e) {
      return null;
    }
  }
}
