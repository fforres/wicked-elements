var wickedElements = (function () {
  'use strict';

  /**
   * ISC License
   *
   * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  var $Event;

  try {
    new Event('!');
    $Event = Event;
  } catch(o_O) {
    try {
      new CustomEvent('!');
      $Event = CustomEvent;
    } catch(o_O) {
      $Event = function (type) {
        var e = document.createEvent('Event');
        e.initEvent(type, false, false);
        return e;
      };
    }
  }

  var Event$1 = $Event;

  /**
   * ISC License
   *
   * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  var $WeakSet;

  try {
    $WeakSet = (new WeakSet).constructor;
  } catch(o_O) {
    try {
      // IE11 apparently has WeakMap but no WeakSet
      o_O = ($WeakSet = new WeakMap && function () {
        this.$ = new WeakMap;
      }).prototype;
      o_O.add = function (O) {
        this.$.set(O, 0);
        return this;
      };
      o_O.has = function (O) {
        return this.$.has(O);
      };
      o_O.delete = function (O) {
        return this.$.delete(O);
      };
    } catch(o_O) {
      // all other browsers
      var i = 0;
      o_O = ($WeakSet = function () {
        this.$ = ['__', Math.random(), i++, '__'].join('ws');
      }).prototype;
      o_O.add = function (O) {
        if (!this.has(O))
          Object.defineProperty(O, this.$, {value:true, configurable:true});
        return this;
      };
      o_O.has = function (O) {
        return this.hasOwnProperty.call(O, this.$);
      };
      o_O.delete = function (O) {
        return delete O[this.$];
      };
    }
  }

  var WeakSet$1 = $WeakSet;

  /**
   * ISC License
   *
   * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  var assign = Object.assign || function (target) {
    for (var o, i = 1; i < arguments.length; i++) {
      o = arguments[i] || {};
      for (var k in o) {
        if (o.hasOwnProperty(k))
          target[k] = o[k];
      }
    }
    return target;
  };

  // borrowed from https://github.com/WebReflection/dom4/blob/master/src/dom4.js#L361
  var contains = document.contains || function (el) {
    while (el && el !== this) el = el.parentNode;
    return this === el;
  };

  var indexOf = [].indexOf;

  // borrowed from https://github.com/WebReflection/dom4/blob/master/src/dom4.js#L130
  var matches = 'matches' in document.documentElement ?
    function (el, selector) {
      return el.matches(selector);
    } :
    function (el, selector) {
      return (
        el.matchesSelector ||
        el.webkitMatchesSelector ||
        el.khtmlMatchesSelector ||
        el.mozMatchesSelector ||
        el.msMatchesSelector ||
        el.oMatchesSelector ||
        fallback
      ).call(el, selector);
    };

  function fallback(selector) {
    var parentNode = this.parentNode;
    return !!parentNode && -1 < indexOf.call(
      parentNode.querySelectorAll(selector),
      this
    );
  }

  /*! (c) Andrea Giammarchi */
  function attributechanged(poly) {  var Event = poly.Event;
    return function observe(node, attributeFilter) {
      var options = {attributes: true, attributeOldValue: true};
      var filtered = attributeFilter instanceof Array && attributeFilter.length;
      if (filtered)
        options.attributeFilter = attributeFilter.slice(0);
      try {
        (new MutationObserver(changes)).observe(node, options);
      } catch(o_O) {
        options.handleEvent = filtered ? handleEvent : attrModified;
        node.addEventListener('DOMAttrModified', options, true);
      }
      return node;
    };
    function attrModified(event) {
      dispatchEvent(event.target, event.attrName, event.prevValue);
    }
    function dispatchEvent(node, attributeName, oldValue) {
      var event = new Event('attributechanged');
      event.attributeName = attributeName;
      event.oldValue = oldValue;
      event.newValue = node.getAttribute(attributeName);
      node.dispatchEvent(event);
    }
    function changes(records) {
      for (var record, i = 0, length = records.length; i < length; i++) {
        record = records[i];
        dispatchEvent(record.target, record.attributeName, record.oldValue);
      }
    }
    function handleEvent(event) {
      if (-1 < this.attributeFilter.indexOf(event.attrName))
        attrModified(event);
    }
  }

  /*! (c) Andrea Giammarchi */
  function disconnected(poly) {  var CONNECTED = 'connected';
    var DISCONNECTED = 'dis' + CONNECTED;
    var Event = poly.Event;
    var WeakSet = poly.WeakSet;
    var notObserving = true;
    var observer = new WeakSet;
    return function observe(node) {
      if (notObserving) {
        notObserving = !notObserving;
        startObserving(node.ownerDocument);
      }
      observer.add(node);
      return node;
    };
    function startObserving(document) {
      var dispatched = null;
      try {
        (new MutationObserver(changes)).observe(
          document,
          {subtree: true, childList: true}
        );
      }
      catch(o_O) {
        var timer = 0;
        var records = [];
        var reschedule = function (record) {
          records.push(record);
          clearTimeout(timer);
          timer = setTimeout(
            function () {
              changes(records.splice(timer = 0, records.length));
            },
            0
          );
        };
        document.addEventListener(
          'DOMNodeRemoved',
          function (event) {
            reschedule({addedNodes: [], removedNodes: [event.target]});
          },
          true
        );
        document.addEventListener(
          'DOMNodeInserted',
          function (event) {
            reschedule({addedNodes: [event.target], removedNodes: []});
          },
          true
        );
      }
      function changes(records) {
        dispatched = new Tracker;
        for (var
          record,
          length = records.length,
          i = 0; i < length; i++
        ) {
          record = records[i];
          dispatchAll(record.removedNodes, DISCONNECTED, CONNECTED);
          dispatchAll(record.addedNodes, CONNECTED, DISCONNECTED);
        }
        dispatched = null;
      }
      function dispatchAll(nodes, type, counter) {
        for (var
          node,
          event = new Event(type),
          length = nodes.length,
          i = 0; i < length;
          (node = nodes[i++]).nodeType === 1 &&
          dispatchTarget(node, event, type, counter)
        );
      }
      function dispatchTarget(node, event, type, counter) {
        if (observer.has(node) && !dispatched[type].has(node)) {
          dispatched[counter].delete(node);
          dispatched[type].add(node);
          node.dispatchEvent(event);
          /*
          // The event is not bubbling (perf reason: should it?),
          // hence there's no way to know if
          // stop/Immediate/Propagation() was called.
          // Should DOM Level 0 work at all?
          // I say it's a YAGNI case for the time being,
          // and easy to implement in user-land.
          if (!event.cancelBubble) {
            var fn = node['on' + type];
            if (fn)
              fn.call(node, event);
          }
          */
        }
        for (var
          children = node.children,
          length = children.length,
          i = 0; i < length;
          dispatchTarget(children[i++], event, type, counter)
        );
      }
      function Tracker() {
        this[CONNECTED] = new WeakSet;
        this[DISCONNECTED] = new WeakSet;
      }
    }
  }

  /**
   * ISC License
   *
   * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  var bootstrap = true;

  var query = [];
  var config = [];
  var waiting = {};
  var known = {};

  var regularElements = {
    Event: Event$1,
    WeakSet: WeakSet$1,
    assign: assign,
    document: document,
    define: function (selector, options) {
      if (bootstrap) {
        bootstrap = false;
        init(regularElements.document);
      }
      var type = typeof selector;
      if (type === 'string') {
        if (-1 < query.indexOf(selector))
          throw new Error('duplicated: ' + selector);
        query.push(selector);
        config.push(options || {});
        ready();
        if (selector in waiting) {
          waiting[selector](config[config.length - 1]);
          delete waiting[selector];
        }
      } else {
        if (type !== "object" || selector.nodeType !== 1)
          throw new Error('undefinable: ' + selector);
        setupListeners(selector, options || {});
      }
    },
    get: function (selector) {
      var i = query.indexOf(selector);
      return i < 0 ? null : assign({}, config[i]);
    },
    whenDefined: function (selector) {
      return Promise.resolve(
        regularElements.get(selector) ||
        new Promise(function ($) {
          waiting[selector] = $;
        })
      );
    }
  };

  // passing along regularElements as poly for Event and WeakSet
  var lifecycle = disconnected(regularElements);
  var observe = {
    attributechanged: attributechanged(regularElements),
    connected: lifecycle,
    disconnected: lifecycle
  };

  function changes(records) {
    for (var i = 0, length = records.length; i < length; i++)
      setupList(records[i].addedNodes, false);
  }

  function init(doc) {
    try {
      (new MutationObserver(changes))
        .observe(doc, {subtree: true, childList: true});
    }
    catch(o_O) {
      doc.addEventListener(
        'DOMNodeInsterted',
        function (e) {
          changes([{addedNodes: [e.target]}]);
        },
        false
      );
    }
    if (doc.readyState !== 'complete')
      doc.addEventListener('DOMContentLoaded', ready, {once: true});
  }

  function ready() {
    if (query.length)
      setupList(regularElements.document.querySelectorAll(query), true);
  }

  function setup(node) {
    setupList(node.querySelectorAll(query), true);
    for (var ws, css, i = 0, length = query.length; i < length; i++) {
      css = query[i];
      ws = known[css] || (known[css] = new WeakSet$1);
      if (!ws.has(node) && matches(node, query[i])) {
        ws.add(node);
        setupListeners(node, config[i]);
      }
    }
  }

  function setupList(nodes, isElement) {
    for (var node, i = 0, length = nodes.length; i < length; i++) {
      node = nodes[i];
      if (isElement || node.nodeType === 1)
        setup(node);
    }
  }

  function setupListener(node, options, type, dispatch) {
    var method = options['on' + type];
    if (method) {
      observe[type](node, options.attributeFilter)
        .addEventListener(type, method, false);
      if (dispatch && contains.call(regularElements.document, node))
        node.dispatchEvent(new Event$1(type));
    }
  }

  function setupListeners(node, options) {
    setupListener(node, options, 'attributechanged', false);
    setupListener(node, options, 'disconnected', false);
    setupListener(node, options, 'connected', true);
  }

  /**
   * ISC License
   *
   * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  var create = Object.create;

  var wickedElements = {
    define: function (selector, options) {
      var ws = new WeakSet$1;
      var component = assign(
        {
          init: function (event) {
            this.el = event.currentTarget;
          },
          handleEvent: function (event) {
            var type = 'on' + event.type;
            if (type in this)
              this[type](event);
          }
        },
        options
      );
      var setup = {
        handleEvent: function (event) {
          var el = event.currentTarget;
          el.removeEventListener(event.type, setup);
          if (!ws.has(el)) {
            ws.add(el);
            var handler = create(component);
            for (var key in component) {
              if (/^on/.test(key))
                el.addEventListener(key.slice(2), handler, false);
            }
            handler.init(event);
            handler.handleEvent(event);
          }
        }
      };
      var onconnected = options.onconnected;
      var ondisconnected = options.ondisconnected;
      var onattributechanged = options.onattributechanged;
      var definition = {component: component, onconnected: setup};
      if (onconnected)
        component.onconnected = onconnected;
      if (ondisconnected)
        definition.ondisconnected = setup;
      if (onattributechanged) {
        definition.onattributechanged = setup;
        definition.attributeFilter = options.attributeFilter || [];
      }
      regularElements.define(selector, definition);
    },
    get: function (selector) {
      var definition = regularElements.get(selector);
      return copyComponent(definition);
    },
    whenDefined: function (selector) {
      var definition = regularElements.whenDefined(selector);
      return definition.then(copyComponent);
    }
  };

  function copyComponent(definition) {
    return definition ? assign({}, definition.component) : definition;
  }

  

  return wickedElements;

}());
