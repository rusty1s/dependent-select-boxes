import jsdom from 'mocha-jsdom';
import { expect } from 'chai';

describe('Tests', () => {
  let DependentSelectBoxes;
  jsdom();

  before(() => {
    DependentSelectBoxes = require('../src/index').default;

    document.body.innerHTML =
      '<select id="parent">' +
      '  <option></option>' +
      '  <option id="A">A</option>' +
      '  <option id="B">B</option>' +
      '</select>' +
      '<select id="child">' +
      '  <option></option>' +
      '  <option id="A_1">A_1</option>' +
      '  <option id="A_2">A_2</option>' +
      '  <option id="B_1">B_1</option>' +
      '  <option id="B_2">B_2</option>' +
      '</select>';
  });

  it('should fail on none HTMLSelectElements', () => {
    try {
      const _ = new DependentSelectBoxes(
        document.body,
        document.getElementById('child'));
      expect(_).to.be.null; // should never reach
    } catch (error) {
      expect(error.message).equal('Parent element must be a select box');
    }

    try {
      const _ = new DependentSelectBoxes(
        document.getElementById('parent'),
        document.body);
      expect(_).to.be.null; // should never reach
    } catch (error) {
      expect(error.message).equal('Child element must be a select box');
    }
  });

  it('should init and destroy successfully', () => {
    const boxes = new DependentSelectBoxes(
      document.getElementById('parent'),
      document.getElementById('child'));

    expect(boxes).to.not.be.null;
    expect(boxes.parent).to.equal(document.getElementById('parent'));
    expect(boxes.child).to.equal(document.getElementById('child'));
    expect(boxes.childOptions.length)
      .to.equal(document.getElementById('child').options.length);
    expect(boxes.childOptionIsDependentOnParentOption)
      .to.be.instanceof(Function);
    expect(boxes.resetParentOptionOnEmptyChildOption).to.be.true;

    expect(boxes.child.options.length).to.equal(5);
    boxes._selectOption(boxes.parent.options[1]);
    expect(boxes.child.options.length).to.equal(3);
    boxes.destroy();
    expect(document.getElementById('child').options.length).to.equal(5);
    expect(boxes.parent).to.be.undefined;
    expect(boxes.child).to.be.undefined;
    expect(boxes.childOptions).to.be.undefined;

    document.getElementById('parent').options[0].selected = true;
  });

  it('should only display dependent child options', () => {
    const boxes = new DependentSelectBoxes(
      document.getElementById('parent'),
      document.getElementById('child'));

    expect(boxes.child.options.length).to.equal(5);
    boxes._selectOption(boxes.parent.options[1]);
    expect(boxes.child.options.length).to.equal(3);
    expect(boxes.child.options[0].value).to.equal('');
    expect(boxes.child.options[1].value).to.equal('A_1');
    expect(boxes.child.options[2].value).to.equal('A_2');
    boxes._selectOption(boxes.parent.options[2]);
    expect(boxes.child.options.length).to.equal(3);
    expect(boxes.child.options[0].value).to.equal('');
    expect(boxes.child.options[1].value).to.equal('B_1');
    expect(boxes.child.options[2].value).to.equal('B_2');

    boxes.parent.options[0].selected = true;
    boxes.destroy();
  });

  it('should show correct parent options when changing child options', () => {
    const boxes = new DependentSelectBoxes(
      document.getElementById('parent'),
      document.getElementById('child'));

    boxes._selectOption(Array.from(boxes.parent.options)[1]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('A');
    boxes._selectOption(boxes.child.options[1]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('A');
    boxes._selectOption(boxes.child.options[2]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('A');
    boxes._selectOption(boxes.child.options[0]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('');

    boxes.destroy();
  });

  it('should configure options', () => {
    const boxes = new DependentSelectBoxes(
      document.getElementById('parent'),
      document.getElementById('child'), {
        childOptionIsDependentOnParentOption(childOption, parentOption) {
          return childOption.value.indexOf(parentOption.value) !== 0;
        },
        resetParentOptionOnEmptyChildOption: false,
      });

    expect(boxes.child.options.length).to.equal(5);
    boxes._selectOption(boxes.parent.options[1]);
    expect(boxes.child.options.length).to.equal(3);
    expect(boxes.child.options[0].value).to.equal('');
    expect(boxes.child.options[1].value).to.equal('B_1');
    expect(boxes.child.options[2].value).to.equal('B_2');
    boxes._selectOption(boxes.child.options[1]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('A');
    boxes._selectOption(boxes.child.options[0]);
    expect(boxes.parent.options[boxes.parent.selectedIndex].value)
      .to.equal('A');

    boxes.parent.options[0].selected = true;
    boxes.destroy();
  });
});
