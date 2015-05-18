(function() {
    var version = '2.1.0',
        uniqueChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        uniqueArray = [];
    
    function randomUnique(length) {
        var i, unique = '';
        
        for(i = 0; i < (length || 8); ++i) {
            unique += uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
        }
        
        return (uniqueArray.indexOf(unique) == -1 ? unique : randomUnique(length));
    }
    
    function ajax(url, callback, data) {
        if(!(window.XMLHttpRequest)) {
            return false;
        }
        
        var async = (typeof callback == 'function'),
            xhr = new XMLHttpRequest();
        
        if(async) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status === 0)) {
                    callback(xhr.responseText);
                }
            };
        }
        
        try {
            xhr.open(data ? 'POST' : 'GET', url, async);
            xhr.send(data);
        } catch(e) { return false; }
        
        return (async ? true : xhr.responseText);
    }
    
    function elements(selector, parent) {
        var elems = (parent ? parent.children : document.getElementsByTagName('*')),
            matching = [],
            selectors = selector.split(' '),
            s, e, a, v, c;
            
        for(s in selectors) {
            var captures = /^([-\w]*)(#[-\w]+)?((?:\[[-\w]+(?:=(['"])?[-\w]+\4)?\])*)((?:\.[-\w]+)*)$/.exec(selectors[s]),
                tag = (captures[1] || null),
                id = (captures[2] ? captures[2].substr(1) : null),
                attributes = (captures[3] ? captures[3].replace(/^\[|\]$/g, '').split('][') : null),
                classes = (captures[5] ? captures[5].substr(1).split('.') : null),
                hasMatch;
            
            for(e = 0; e < elems.length; ++e) {
                hasMatch = true;
                
                // Check element tag name
                if(tag !== null && elems[e].tagName != tag.toUpperCase()) {
                    continue;
                }
                
                // Check element ID
                if(id !== null && elems[e].id != id) {
                    continue;
                }
                
                // Check element attributes
                if(attributes !== null) {
                    for(a in attributes) {
                        var attr = attributes[a], separator = attr.indexOf('='),
                            name = (separator >= 0 ? attr.substr(0, separator) : attr),
                            value = (separator >= 0 ? attr.substr(separator + 1) : null),
                            validNames = [ name, 'x-' + name, 'data-' + name ],
                            hasValid = false;
                        
                        for(v in validNames) {
                            if(!hasValid) {
                                var elemAttrib = elems[e].getAttribute(validNames[v]);
                                
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
                    for(c in classes) {
                        var classNames = elems[e].className.split(' ');
                        
                        if(classNames.indexOf(classes[c]) == -1) {
                            hasMatch = false;
                        }
                    }
                    
                    if(!hasMatch) {
                        continue;
                    }
                }
                
                matching.push(elems[e]);
            }
        }
        
        return matching;
    }
    
    function forEach(object, iterator, context) {
        var key, len;
        
        if(object) {
            if(typeof object == 'function') {
                for(key in object) {
                    if(['length', 'name', 'prototype'].indexOf(key) == -1 && (!object.hasOwnProperty || object.hasOwnProperty(key))) {
                        iterator.call(context, object[key], key);
                    }
                }
            } else if(object.forEach && object.forEach !== forEach) {
                object.forEach(iterator, context);
            } else {
                for(key in object) {
                    if(object.hasOwnProperty(key)) {
                        iterator.call(context, object[key], key);
                    }
                }
            }
        }
        
        return object;
    }
    
    function jsonp(url, callback) {
        var callbackName = 'fu_jsonp_' +  randomUnique(),
            scriptElement = document.createElement('script');
            
        window[callbackName] = function(params) {
            delete window[callbackName];
            document.body.removeChild(scriptElement);
            callback(params);
        };
        
        scriptElement.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(scriptElement);
    }
    
    window.fu = {
        ajax:       ajax,
        elements:   elements,
        forEach:    forEach,
        jsonp:      jsonp,
        version:    version
    };
    
})();
