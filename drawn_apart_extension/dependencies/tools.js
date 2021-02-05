/**
 * Create a xhr request
 * @return {*} a xhr request
 */
window.getXMLHttpRequest = function() {
  let xhr = null;

  if (window.XMLHttpRequest || window.ActiveXObject) {
    if (window.ActiveXObject) {
      try {
        xhr = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
    } else {
      xhr = new XMLHttpRequest();
    }
  } else {
    console.log('Votre navigateur ne supporte pas l\'objet XMLHTTPRequest...');
    return null;
  }

  return xhr;
};
