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

import regularElements, {assign, WeakSet} from './3rd/regular-elements/index.js';

var create = Object.create;

var wickedElements = {
  define: function (selector, options) {
    var ws = new WeakSet;
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

export default wickedElements;

function copyComponent(definition) {
  return definition ? assign({}, definition.component) : definition;
}
