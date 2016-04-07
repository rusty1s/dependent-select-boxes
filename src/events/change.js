import head from 'lodash/head';

export function onChangeParent() {
  const parentOption = this.parent.options[this.parent.selectedIndex];

  this._showChildOptions(childOption => {
    if (childOption.value === '') return true;
    if (parentOption.value === '') return true;
    if (this.childOptionIsDependentOnParentOption(childOption, parentOption)) {
      return true;
    }

    return false;
  });
}

export function onChangeChild() {
  const childOption = this.child.options[this.child.selectedIndex];

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
