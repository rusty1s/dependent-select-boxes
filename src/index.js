import head from 'lodash/head';
import CustomEvent from 'custom-event';

import { onChangeParent, onChangeChild } from './events/change';

const defaultOptions = {
  childOptionIsDependentOnParentOption(childOption, parentOption) {
    return childOption.value.indexOf(parentOption.value) === 0;
  },
};

export default class DependentSelectBoxes {
  constructor(parent, child, options = {}) {
    if (!parent || parent.tagName !== 'SELECT') {
      throw new Error('Parent element must be a select box');
    }

    if (!child || child.tagName !== 'SELECT') {
      throw new Error('Child element must be a select box');
    }

    Object.assign(this, defaultOptions, options, {
      parent,
      child,
      childOptions: Array.from(child.options),
    });

    this._onChangeParent = onChangeParent.bind(this);
    this._onChangeChild = onChangeChild.bind(this);

    this.parent.addEventListener('change', this._onChangeParent);
    this.child.addEventListener('change', this._onChangeChild);

    this._onChangeParent();
  }

  destroy() {
    // remove the used event listener
    this.parent.removeEventListener('change', this._onChangeParent);
    this.child.removeEventListener('change', this._onChangeChild);

    // make sure to show all child options
    this.showChildOptions(() => true);

    // delete everything that is bound to `this`
    Object.keys(this).forEach(name => {
      delete this[name];
    });
  }

  _showChildOptions(filter) {
    const currentSelectedOption = this.child.options[this.child.selectedIndex];

    // remove all options
    Array.from(this.child.children).forEach(child => {
      this.child.removeChild(child);
    });

    let needToChangeSelection = true;
    this.childOptions.forEach(childOption => {
      if (filter(childOption)) {
        this.child.appendChild(childOption);
        childOption.selected = false;

        if (childOption === currentSelectedOption) {
          needToChangeSelection = false;
        }
      }
    });

    if (needToChangeSelection) {
      this._selectOption(head(this.child.options));
    } else {
      currentSelectedOption.selected = true;
    }
  }

  _selectOption(option) {
    if (!option || option.selected) return;

    option.selected = true;
    option.parentNode.dispatchEvent(new CustomEvent('change'));
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
