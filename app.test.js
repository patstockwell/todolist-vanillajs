(function() {
  var mockToDos = [{}, {}, {}, {}];
  var elementMaker = () => ('<div></div>');
  var toDoList = toDoApp.createToDoList(mockToDos, elementMaker);
  expect(toDoList.length).toEqual(4);
  console.log('✔', 'createToDoList() should return an array');
})();

(function() {
  var deleteButton = toDoApp.createDeleteButton('myId', () => {});
  expect(deleteButton.tagName).toEqual('BUTTON');
  expect(deleteButton.id).toEqual('delete-myId');
  console.log('✔', 'createDeleteButton() should return a button element with the specified id')
})();

(function() {
  var idWordList = toDoApp.createId('this sentence has spaces').split(' ');
  expect(idWordList.length).toEqual(1);
  console.log('✔', 'createId() should return a string without spaces');
})();

(function() {
  var checkbox = toDoApp.createCheckbox(false, 'checkbox-id', () => {});
  expect(checkbox.tagName).toEqual('INPUT');
  expect(checkbox.id).toEqual('checkbox-id');
  console.log('✔', 'createCheckbox() should return a checkbox element with the specified id');
})();

(function() {
  var labelWrapper = toDoApp.createLabel('this is a todo', false, 'label-id');
  expect(labelWrapper.tagName).toEqual('SPAN');
  console.log('✔', 'createLabel() should return a label element wrapped in a <span> for incomplete todos');
})();

(function() {
  var labelWrapper = toDoApp.createLabel('this is a todo', true, 'label-id');
  expect(labelWrapper.tagName).toEqual('DEL');
  console.log('✔', 'createLabel() should return a label element wrapped in a <del> for complete todos');
})();

(function() {
  var label = toDoApp.createLabel('this is a todo', true, 'label-id').children[0];
  expect(label.tagName).toEqual('LABEL');
  console.log('✔', 'createLabel() should return an element where the first child is a label');
  expect(label.htmlFor).toEqual('label-id');
  console.log('✔', 'createLabel() should return a label element with the correct `for` attribute');
})();

(function() {
  var toDoElement = toDoApp.createToDoElement('this is the content', false, 'thisIsTheId');
  expect(toDoElement.tagName).toEqual('DIV');
  console.log('✔', 'createToDoElement() should return a <div>');
  expect(toDoElement.children[0].tagName).toEqual('INPUT');
  console.log('✔', 'the <div> should have a checkbox child element');
  expect(toDoElement.children[1].tagName).toEqual('SPAN');
  console.log('✔', 'the <div> should have a label child element');
  expect(toDoElement.children[2].tagName).toEqual('BUTTON');
  console.log('✔', 'the <div> should have a button child element');
})();

(function() {
  var oldState = [
    { content: 'peter pan' },
    { content: 'alice' },
    { content: 'harry potter' },
  ];
  var newState = toDoApp.addToDo(oldState, 'wonder woman');
  expect(newState.length).toEqual(4);
  expect(newState[3].content).toEqual('wonder woman');
  expect(newState[3].id).toEqual('wonderwoman');
  expect(newState[3].done).toEqual(false);
  console.log('✔', 'addToDo() should return the correct state object');
})();

(function() {
  var oldState = [
    { content: 'peter pan' },
    { content: 'alice' },
    { content: 'lee lin chin' },
    { content: 'harry potter', id: 'harry-potter-id' },
    { content: 'luke skywalker' },
  ];
  var newState = toDoApp.removeToDo(oldState, 'harry-potter-id');
  expect(newState.length).toEqual(4);
  expect(newState[3].content).toEqual('luke skywalker');
  console.log('✔', 'removeToDo() should return the correct state object');
})();

(function() {
  var oldState = [{ done: false, id: 'special-id' }];
  var newState = toDoApp.toggleToDo(oldState, 'special-id');
  expect(newState[0].done).toEqual(true);
  console.log('✔', 'toggleToDo() should return the correct state object');
})();
