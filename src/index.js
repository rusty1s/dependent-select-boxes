import head from 'lodash/head';
import CustomEvent from 'custom-event';

import { onChangeParent, onChangeChild } from './events/change';

/**
 * @param {Function}
 * childOptionIsDependentOnParentOption(childOption, parentOption) -
 * Function that determines if the `childOption` should be displayed if
 * `parentOption` is selected. Default: `true` if the value of the parent
 * option is a prefix of the value of the child option.
 * @param {boolean} resetParentOptionOnEmptyChildOption - Resets the parent
 * option to an empty value if the child option changes to an empty option.
 * Default: `true`.
 */
const defaultOptions = {
  childOptionIsDependentOnParentOption(childOption, parentOption) {
    return childOption.value.indexOf(parentOption.value) === 0;
  },
  resetParentOptionOnEmptyChildOption: true,
};

/**
 * Allows a child select box to change its options
 * dependent on its parent select box.
 */
export default class DependentSelectBoxes {
  /**
   * @constructor
   * @param {HTMLSelectElement} parent - The parent select box.
   * @param {HTMLSelectElement} child - The child select box.
   * @param {Object} options - Specific options for this instance.
   */
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

    // trigger the change event of the parent to build the initial state
    this._onChangeParent();
  }

  /**
   * Destroys the functionality of the select boxes and
   * resets the state of both.
   */
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

  /**
   * Shows the child options that pass the filter.
   * @param {Function} filter - Function that takes a child option and
   * returns whether to show the option or not.
   * @private
   */
  _showChildOptions(filter) {
    const currentSelectedOption = this.child.options[this.child.selectedIndex];

    // remove all options
    Array.from(this.child.children).forEach(child => {
      this.child.removeChild(child);
    });

    // Loop through all possible child options and check whether
    // to display them or not. We need to save whether the selection
    // of the select box needs to change. This happens if the selected
    // option won't get displayed in the new select box.
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

    // select the first option in the select box if we need
    // to change the selection
    if (needToChangeSelection) {
      this._selectOption(head(this.child.options));
    } else {
      currentSelectedOption.selected = true;
    }
  }

  /**
   * Selects the `option` and dispatches a change event.
   * @param {HTMLOptionElement} option - The option to be selected.
   * @private
   */
  _selectOption(option) {
    if (!option || option.selected) return;

    option.selected = true;
    option.parentNode.dispatchEvent(new CustomEvent('change'));
  }
}

/**
 * Overrides the default options.
 * @param {Object} options
 */
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.DependentSelectBoxes = DependentSelectBoxes;
