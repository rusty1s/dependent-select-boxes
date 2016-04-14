# dependent-select-boxes

`dependent-select-boxes` allows a child select box to change its options dependent on its parent select box.

[Demo](http://rusty1s.github.io/dependent-select-boxes)

## Additional options

You can pass in options as a third parameter. The currently supported options are:

* `childOptionIsDependentOnParentOption(childOption, parentOption)`:
Function that determines if the `childOption`should be displayed if
`parentOption` is selected. Default: `true` if the value of the parent
option is a prefix of the value of the child option, else `false`.
* `resetParentOptionOnEmptyChildOption`:
Resets the parent option to an empty value if the child option changes
to an empty option. Default `true`.

```js
new DependentSelectBoxes(document.getElementById('parent'), document.getElementById('child'), {
  childOptionIsDependentOnParentOption(childOption, parentOption) {
    ...
  },
  resetParentOptionOnEmptyChildOption: false,
});
```

You can configure the default options by setting them via:

```js
import { setDefaultOptions } from 'dependent-select-boxes';

setDefaultOptions({
  ...
});
```

## Node

```js
// npm install dependent-select-boxes --save
import DependentSelectBoxes from 'dependent-select-boxes';

const dependentSelectBoxes = new DependentSelectBoxes(parent, child, options);
```

## Contributing

If you would like to [submit a pull request](https://github.com/rusty1s/dependent-select-boxes/pulls)
with any changes you make, please feel free!
Simply run `npm test` to test and `npm start` to compile before submitting pull requests.

## Issues

Please use the [GitHub issue tracker](https://github.com/rusty1s/dependent-select-boxes/issues)
to raise any problems or feature requests.
