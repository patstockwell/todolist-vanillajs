(function() {
  console.log('createToDoList() should return an array');
  var mockToDos = [{}, {}, {}, {}];
  var elementMaker = () => ('<div></div>');
  var toDoList = toDoApp.createToDoList(mockToDos, elementMaker);
  expect(toDoList.length).toEqual(4);
})();

(function() {
  console.log('createDeleteButton() should return a button element with the specified id')
  var deleteButton = toDoApp.createDeleteButton('myId', () => {});
  expect(deleteButton.tagName).toEqual('BUTTON');
  expect(deleteButton.id).toEqual('delete-myId');
})();

(function() {
  console.log('createId() should return a string without spaces');
  var idWordList = toDoApp.createId('this sentence has spaces').split(' ');
  expect(idWordList.length).toEqual(1);
})();

(function() {
  console.log('createCheckbox() should return a checkbox element with the specified id');
  var checkbox = toDoApp.createCheckbox(false, 'checkbox-id', () => {});
  expect(checkbox.tagName).toEqual('INPUT');
  expect(checkbox.id).toEqual('checkbox-id');
})();

(function() {
  console.log('createLabel() should return a label element wrapped in a <span> for incomplete todos');
  var labelWrapper = toDoApp.createLabel('this is a todo', false, 'label-id');
  expect(labelWrapper.tagName).toEqual('SPAN');
})();

(function() {
  console.log('createLabel() should return a label element wrapped in a <del> for complete todos');
  var labelWrapper = toDoApp.createLabel('this is a todo', true, 'label-id');
  expect(labelWrapper.tagName).toEqual('DEL');
})();

(function() {
  console.log('createLabel() should return an element where the first child is a label');
  var label = toDoApp.createLabel('this is a todo', true, 'label-id').children[0];
  expect(label.tagName).toEqual('LABEL');
  console.log('createLabel() should return a label element with the correct `for` attribute');
  expect(label.htmlFor).toEqual('label-id');
})();

(function() {
  console.log('createToDoElement() should return a <div>');
  var toDoElement = toDoApp.createToDoElement('this is the content', false, 'thisIsTheId');
  expect(toDoElement.tagName).toEqual('DIV');
  console.log('the <div> should have a checkbox child element');
  expect(toDoElement.children[0].tagName).toEqual('INPUT');
  console.log('the <div> should have a label child element');
  expect(toDoElement.children[1].tagName).toEqual('SPAN');
  console.log('the <div> should have a button child element');
  expect(toDoElement.children[2].tagName).toEqual('BUTTON');
})();

(function() {
  console.log('addToDo() should return the correct state object');
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
})();