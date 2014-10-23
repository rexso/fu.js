var fu = { VERSION: '2.0.0', uniques: [] };

fu.randomUnique = function(length) {
    var unique = '', chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for(var i = 0; i < (length ? length : 8); ++i) {
        unique += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return (fu.uniques.indexOf(unique) != -1 ? fu.randomUnique(length) : unique);
};

fu.jsonp = function(url, callback) {
    var callbackName = 'fu_jsonp_' + fu.randomUnique(),
        scriptElement = document.createElement('script');
    
    window[callbackName] = function(params) {
        delete window[callbackName];
        document.body.removeChild(scriptElement);
        callback(params);
    };
    
    scriptElement.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(scriptElement);
};

fu.ajax = function(url, callback, data) {
    var xhr, async = (callback ? true : false);
    
    try {
        if(window.XMLHttpRequest) xhr = new XMLHttpRequest();
        else xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { return false; }
    
    if(async && callback) {
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status === 0)) {
                callback(xhr.responseText);
            }
        };
    }
    
    try {
        xhr.open(data ? "POST" : "GET", url, async);
        xhr.send(data);
    } catch(e) { return false; }
    
    return (async ? true : xhr.responseText);
};

fu.forEach = function(obj, iterator, context) {
    var key, len;
    
    if(obj) {
        if(typeof obj == 'function') {
            for(key in obj) {
                if(key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if(obj.forEach && obj.forEach !== fu.forEach) {
            obj.forEach(iterator, context);
        } else {
            for(key in obj) {
                if(obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    
    return obj;
};

fu.elements = function(selector) {   
    var elements = document.getElementsByTagName('*'),
        matching = [],
        selectors = selector.split(' ');
        
    for(var s in selectors) {
        var captures = /^([-\w]*)(#[-\w]+)?((?:\[[-\w]+(?:=(['"])?[-\w]+\4)?\])*)((?:\.[-\w]+)*)$/.exec(selectors[s]),
            tag = (captures[1] || null),
            id = (captures[2] ? captures[2].substr(1) : null),
            attributes = (captures[3] ? captures[3].replace(/^\[|\]$/g, '').split('][') : null),
            classes = (captures[5] ? captures[5].substr(1).split('.') : null);
        
        for(var e = 0; e < elements.length; ++e) {
            var hasMatch = true;
            
            // Check element tag name
            if(tag !== null && elements[e].tagName != tag.toUpperCase()) {
                continue;
            }
            
            // Check element ID
            if(id !== null && elements[e].id != id) {
                continue;
            }
            
            // Check element attributes
            if(attributes !== null) {
                for(var a in attributes) {
                    var attr = attributes[a], separator = attr.indexOf('='),
                        name = (separator >= 0 ? attr.substr(0, separator) : attr),
                        value = (separator >= 0 ? attr.substr(separator + 1) : null),
                        validNames = [ name, 'x-' + name, 'data-' + name ],
                        hasValid = false;
                    
                    for(var v in validNames) {
                        if(!hasValid) {
                            var elemAttrib = elements[e].getAttribute(validNames[v]);
                            
                            if((value ? elemAttrib == value.replace(/['"]/g, '') : elemAttrib !== null)) {
                                hasValid = true;
                            }
                        }
                    }
                    
                    if(!hasValid) {
                        hasMatch = false;
                    }
                }
                
                if(!hasMatch) {
                    continue;
                }
            }
            
            // Check element classes
            if(classes !== null) {
                for(var c in classes) {
                    var classNames = elements[e].className.split(' ');
                    
                    if(classNames.indexOf(classes[c]) == -1) {
                        hasMatch = false;
                    }
                }
                
                if(!hasMatch) {
                    continue;
                }
            }
            
            matching.push(elements[e]);
        }
    }
    
    return matching;
};
