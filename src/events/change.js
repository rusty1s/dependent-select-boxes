import head from 'lodash/head';

/**
 * The change event of the parent select box.
 */
export function onChangeParent() {
  const parentOption = this.parent.options[this.parent.selectedIndex];

  // show the child options that are dependent on the
  // current selected parent option
  this._showChildOptions(childOption => {
    if (childOption.value === '') return true;
    if (parentOption.value === '') return true;
    if (this.childOptionIsDependentOnParentOption(childOption, parentOption)) {
      return true;
    }

    return false;
  });
}

/**
 * The change event of the child select box.
 */
export function onChangeChild() {
  const childOption = this.child.options[this.child.selectedIndex];

  // reset parent option if child option is empty and we are allowed to do so
  if (childOption.value === '' && this.resetParentOptionOnEmptyChildOption) {
    const parentOption = head(Array.from(this.parent.options)
      .filter(option => option.value === ''));

    this._selectOption(parentOption);
    return;
  }

  // don't change parent select box if child option is empty
  if (childOption.value === '') return;

  // get the parent option on which the child option depends
  const parentOption = head(Array.from(this.parent.options)
    .filter(option => option.value !== '')
    .filter(option =>
      this.childOptionIsDependentOnParentOption(childOption, option)));

  // select it
  this._selectOption(parentOption);
}
