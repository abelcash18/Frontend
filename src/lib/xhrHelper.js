export function readXhrResponse(xhr) {
  if (!xhr) return null;

  try {
    var jsonData = xhr.responseType === 'json' ? xhr.response : xhr.responseText;


    if (typeof jsonData === 'string') {
       try {
        return JSON.parse(jsonData);
      } catch (e) {
        return jsonData;
      }
           }

    return jsonData;
  } catch (err) {
     try {
      return xhr.response ?? null;
    } catch (e) {
      return null;
    }
  }
}
