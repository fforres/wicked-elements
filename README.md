# wickedElements

Bringing the [regularElements](https://github.com/WebReflection/regular-elements) goodness to a component based world.

  * no polyfills needed, it works [down to IE9](https://webreflection.github.io/wicked-elements/test/)
  * lightweight as in [~2K lightweight](https://unpkg.com/wicked-elements)
  * CPU & RAM friendly <sup><sub>(100% based on [handleEvent](https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38) through prototypal inheritance)</sub></sup>
  * components can exist at any time <sup><sub>(past, present, future)</sub></sup>
  * no issues with classes, it works well with composed behaviors
  * you can define multiple behaviors, per same DOM element, through the power of CSS selectors
  * lazy load any component at any time: all their states are uniquely private per selector and per node

Same `regularElements` API, meaning same `customElements` API.

```js
wickedElements.define('[is="wicked-element"]', {

  // always triggered once a node is live
  // always right before onconnected and only once,
  // ideal to setup anything as one off operation
  init: function (event) {
    // the context is actually a private object
    // that inherits the component definition
    // literally: Object.create(component)
    this.el = event.currentTarget;
    // accordingly, you can attach any property
    // and even if public, these won't ever leak
    // (unless you decide to leak the component)
    this._rando = Math.random();
    // you can invoke directly any method
    this.render();
  },

  // regularElements hooks available
  onconnected(event) { ... },
  ondisconnected(event) { ... },
  onattributechanged(event) { ... }

  // and any other event too
  // just prefix a method with `on` and it will
  // be automatically setup for listening
  onclick(event) { ... },

  // works well with any 3rd parts library
  // WARNING: THIS IS JUST AS EXAMPLE,
  //          YOU DON'T NEED hyperHTML
  //          TO USE THIS LIBRARY!
  //          THE NODE CAN BE ANY NODE
  //          AND ALREADY POPULATED WITH CONTENT
  render() {
    this.html`<p>I am rando ${this._rando}</p>`;
  },

  // any object literal syntax available out of the box
  // it's 100% based on prototypal inheritance
  get html() {
    return hyperHTML.bind(this.el);
  }
});
```
