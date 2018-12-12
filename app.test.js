(function() {
  console.log('createToDoList() should return an array');
  const mockToDos = [{}, {}, {}, {}];
  const elementMaker = () => ('<div></div>');
  const toDoList = toDoApp.createToDoList(mockToDos, elementMaker);
  expect(toDoList.length).toEqual(4);
})();

(function() {
  console.log('createDeleteButton() should return a button element with the specified id')
  const deleteButton = toDoApp.createDeleteButton('myId', () => {});
  expect(deleteButton.tagName).toEqual('BUTTON');
  expect(deleteButton.id).toEqual('delete-myId');
})();

(function() {
  console.log('createId() should return a string without spaces');
  const idWordList = toDoApp.createId('this sentence has spaces').split(' ');
  expect(idWordList.length).toEqual(1);
})();

(function() {
  console.log('createCheckbox() should return a checkbox element with the specified id');
  const checkbox = toDoApp.createCheckbox(false, 'checkbox-id', () => {});
  expect(checkbox.tagName).toEqual('INPUT');
  expect(checkbox.id).toEqual('checkbox-id');
})();

(function() {
  console.log('createLabel() should return a label element with the specified id');
  console.log('createLabel() should return a label element wrapped in a <span> for incomplete todos');
  const labelWrapper = toDoApp.createLabel('this is a todo', false, 'label-id');
  expect(labelWrapper.tagName).toEqual('SPAN');
  const label = labelWrapper.children[0];
  expect(label.htmlFor).toEqual('label-id');
})();

(function() {
  console.log('createLabel() should return a label element wrapped in a <del> for complete todos');
})();
