/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.setDefaultOptions = setDefaultOptions;

	var _head = __webpack_require__(2);

	var _head2 = _interopRequireDefault(_head);

	var _customEvent = __webpack_require__(3);

	var _customEvent2 = _interopRequireDefault(_customEvent);

	var _change = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @param {Function}
	 * childOptionIsDependentOnParentOption(childOption, parentOption) -
	 * Function that determines if the `childOption` should be displayed if
	 * `parentOption` is selected. Default: `true` if the value of the parent
	 * option is a prefix of the value of the child option.
	 */
	var defaultOptions = {
	  childOptionIsDependentOnParentOption: function childOptionIsDependentOnParentOption(childOption, parentOption) {
	    return childOption.value.indexOf(parentOption.value) === 0;
	  }
	};

	/**
	 * Allows a child select box to change its options
	 * dependent on its parent select box.
	 */

	var DependentSelectBoxes = function () {
	  /**
	   * @constructor
	   * @param {HTMLSelectElement} parent - The parent select box.
	   * @param {HTMLSelectElement} child - The child select box.
	   * @param {Object} options - Specific options for this instance.
	   */

	  function DependentSelectBoxes(parent, child) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, DependentSelectBoxes);

	    if (!parent || parent.tagName !== 'SELECT') {
	      throw new Error('Parent element must be a select box');
	    }

	    if (!child || child.tagName !== 'SELECT') {
	      throw new Error('Child element must be a select box');
	    }

	    Object.assign(this, defaultOptions, options, {
	      parent: parent,
	      child: child,
	      childOptions: Array.from(child.options)
	    });

	    this._onChangeParent = _change.onChangeParent.bind(this);
	    this._onChangeChild = _change.onChangeChild.bind(this);

	    this.parent.addEventListener('change', this._onChangeParent);
	    this.child.addEventListener('change', this._onChangeChild);

	    // trigger the change event of the parent to build the initial state
	    this._onChangeParent();
	  }

	  /**
	   * Destroys the functionality of the select boxes and
	   * resets the state of both.
	   */


	  _createClass(DependentSelectBoxes, [{
	    key: 'destroy',
	    value: function destroy() {
	      var _this = this;

	      // remove the used event listener
	      this.parent.removeEventListener('change', this._onChangeParent);
	      this.child.removeEventListener('change', this._onChangeChild);

	      // make sure to show all child options
	      this.showChildOptions(function () {
	        return true;
	      });

	      // delete everything that is bound to `this`
	      Object.keys(this).forEach(function (name) {
	        delete _this[name];
	      });
	    }

	    /**
	     * Shows the child options that pass the filter.
	     * @param {Function} filter - Function that takes a child option and
	     * returns whether to show the option or not.
	     * @private
	     */

	  }, {
	    key: '_showChildOptions',
	    value: function _showChildOptions(filter) {
	      var _this2 = this;

	      var currentSelectedOption = this.child.options[this.child.selectedIndex];

	      // remove all options
	      Array.from(this.child.children).forEach(function (child) {
	        _this2.child.removeChild(child);
	      });

	      // Loop through all possible child options and check whether
	      // to display them or not. We need to save whether the selection
	      // of the select box needs to change. This happens if the selected
	      // option won't get displayed in the new select box.
	      var needToChangeSelection = true;
	      this.childOptions.forEach(function (childOption) {
	        if (filter(childOption)) {
	          _this2.child.appendChild(childOption);
	          childOption.selected = false;

	          if (childOption === currentSelectedOption) {
	            needToChangeSelection = false;
	          }
	        }
	      });

	      // select the first option in the select box if we need
	      // to change the selection
	      if (needToChangeSelection) {
	        this._selectOption((0, _head2.default)(this.child.options));
	      } else {
	        currentSelectedOption.selected = true;
	      }
	    }

	    /**
	     * Selects the `option` and dispatches a change event.
	     * @param {HTMLOptionElement} option - The option to be selected.
	     * @private
	     */

	  }, {
	    key: '_selectOption',
	    value: function _selectOption(option) {
	      if (!option || option.selected) return;

	      option.selected = true;
	      option.parentNode.dispatchEvent(new _customEvent2.default('change'));
	    }
	  }]);

	  return DependentSelectBoxes;
	}();

	/**
	 * Overrides the default options.
	 * @param {Object} options
	 */


	exports.default = DependentSelectBoxes;
	function setDefaultOptions(options) {
	  Object.assign(defaultOptions, options);
	}

	if (window) window.DependentSelectBoxes = DependentSelectBoxes;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Gets the first element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @alias first
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the first element of `array`.
	 * @example
	 *
	 * _.head([1, 2, 3]);
	 * // => 1
	 *
	 * _.head([]);
	 * // => undefined
	 */
	function head(array) {
	  return array ? array[0] : undefined;
	}

	module.exports = head;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var NativeCustomEvent = global.CustomEvent;

	function useNative () {
	  try {
	    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
	    return  'cat' === p.type && 'bar' === p.detail.foo;
	  } catch (e) {
	  }
	  return false;
	}

	/**
	 * Cross-browser `CustomEvent` constructor.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
	 *
	 * @public
	 */

	module.exports = useNative() ? NativeCustomEvent :

	// IE >= 9
	'function' === typeof document.createEvent ? function CustomEvent (type, params) {
	  var e = document.createEvent('CustomEvent');
	  if (params) {
	    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
	  } else {
	    e.initCustomEvent(type, false, false, void 0);
	  }
	  return e;
	} :

	// IE <= 8
	function CustomEvent (type, params) {
	  var e = document.createEventObject();
	  e.type = type;
	  if (params) {
	    e.bubbles = Boolean(params.bubbles);
	    e.cancelable = Boolean(params.cancelable);
	    e.detail = params.detail;
	  } else {
	    e.bubbles = false;
	    e.cancelable = false;
	    e.detail = void 0;
	  }
	  return e;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onChangeParent = onChangeParent;
	exports.onChangeChild = onChangeChild;

	var _head = __webpack_require__(2);

	var _head2 = _interopRequireDefault(_head);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * The change event of the parent select box.
	 */
	function onChangeParent() {
	  var _this = this;

	  var parentOption = this.parent.options[this.parent.selectedIndex];

	  // show the child options that are dependent on the
	  // current selected parent option
	  this._showChildOptions(function (childOption) {
	    if (childOption.value === '') return true;
	    if (parentOption.value === '') return true;
	    if (_this.childOptionIsDependentOnParentOption(childOption, parentOption)) {
	      return true;
	    }

	    return false;
	  });
	}

	/**
	 * The change event of the child select box.
	 */
	function onChangeChild() {
	  var _this2 = this;

	  var childOption = this.child.options[this.child.selectedIndex];

	  // don't change parent select box if child option is empty
	  if (childOption.value === '') return;

	  // get the parent option on which the child option depends
	  var parentOption = (0, _head2.default)(Array.from(this.parent.options).filter(function (option) {
	    return option.value !== '';
	  }).filter(function (option) {
	    return _this2.childOptionIsDependentOnParentOption(childOption, option);
	  }));

	  // select it
	  this._selectOption(parentOption);
	}

/***/ }
/******/ ]);