'use strict';

const defaultOptions = {
};

export default class DependentSelectBoxes {
  constructor(parent, child, options = {}) {
    Object.assign(this, defaultOptions, options, { parent, child });
  }

  destroy() {
    // delete everything that is bound to `this`
    Object.keys(this).forEach(name => {
      delete this[name];
    });
  }
}

/**
 * Overrides the default options.
 * @param {object} options
 */
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.DependentSelectBoxes = DependentSelectBoxes;
