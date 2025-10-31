
export function readXhrResponse(xhr) {
  if (!xhr) return null;

  try {
    const raw = xhr.responseType === 'json' ? xhr.response : xhr.responseText;

    if (typeof raw === 'string') {
      // Try to parse JSON strings, otherwise return the raw text
      try {
        return JSON.parse(raw);
      } catch (e) {
        return raw;
      }
    }

    // Already an object (parsed JSON) or other type
    return raw;
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
