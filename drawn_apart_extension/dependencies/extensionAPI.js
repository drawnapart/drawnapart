//  Global variable for compatibility with older browsers
window.attributes = [];
window.api = {};
window.uuid = null;
window.urlPrefix = null;

// Const
// It's not a mistake, please let both of them
window.nojs = 'NoJS';
window.no_js = 'No JS';
window.no_value = 'No value';
window.not_supported = 'Not supported';
window.undefined = 'Undefined';
window.visible = 'Visible';
window.invisible = 'Invisible';
window.timeout = 'Timeout';
window.other = 'Other';

window.display = {};
window.display_diff = {};


/*timeoutCollectAttribute = new Promise(function(resolve, reject) {
  setTimeout(resolve, 30000, 'Timeout');
});*/

/**
 * Function that adds the couple (name of the attribute, code to get the value)
 * to the attributes' array
 * @param {String}name the name of the attribute
 * @param {function} code the code for getting the value
 */
api.register = function(name, code) {
  attributes.push({'name': name, 'code': code});
};

/**
 * Function that execute the code from attribute array for creating
 * the javascript part of the fingerprint
 * @return {Object} the client side fingerprint
 */
api.run = async function() {
  const promises = [];
  for (let i = 0; i < attributes.length; i++) {
    const name = attributes[i].name;
    try {
     // promises.push(Promise.race([attributes[i].code(), timeoutCollectAttribute]));
      promises.push(attributes[i].code());
    } catch (e) {
      console.log(e);
    }
  }

  const results = await Promise.all(promises);
  const jsAttributes = {};
  for (let i = 0; i < results.length; i++) {
    const name = attributes[i].name;
    if (Array.isArray(name)) {
      for (let j = 0; j < name.length; j++) {
        if (!(typeof results[i][name[j]] === 'undefined')) {
          jsAttributes[name[j]] = results[i][name[j]];
        } else {
          jsAttributes[name[j]] = window.not_supported;
        }
      }
    } else {
      jsAttributes[name] = results[i];
    }
  }

  return jsAttributes;
};

/**
 * Function that send the new fingerprint to the server.
 * @param {Object} fp
 */
api.store = function(fp) {

  const xhr = getXMLHttpRequest();
  let url = '';
  if(window.uuid !== ''){
    url = window.urlPrefix + '/evolution/' + window.uuid;
  } else {
    const uuid = document.location.hash.substring(1);
    url = '../evolution/' + uuid;
  }
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.send(JSON.stringify(fp));
};

/**
 * @param {String} uuid the uuid of extensions
 * @param {string} urlPrefix
 * Function that begins the pipeline for fingerprint collect.
 */
api.exec = async function(uuid='', urlPrefix = '<serverURL>') {
  window.uuid = uuid;
  window.urlPrefix = urlPrefix;
  const js = await api.run();
  console.log(js);
};
  
