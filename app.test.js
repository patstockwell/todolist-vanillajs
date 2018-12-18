var toDoTests = function(toDoApp, expct) {
  (function() {
    var mockToDos = [{}, {}, {}, {}];
    var elementMaker = () => ('<div></div>');
    var toDoList = toDoApp.createToDoList(mockToDos, elementMaker);
    expct(toDoList.length).toEqual(4);
    console.log('✔', 'createToDoList() should return an array');
  })();

  (function() {
    var deleteButton = toDoApp.createDeleteButton('myId', () => {});
    expct(deleteButton.tagName).toEqual('BUTTON');
    expct(deleteButton.id).toEqual('delete-myId');
    console.log('✔', 'createDeleteButton() should return a button element with the specified id')
  })();

  (function() {
    var idWordList = toDoApp.createId('this sentence has spaces').split(' ');
    expct(idWordList.length).toEqual(1);
    console.log('✔', 'createId() should return a string without spaces');
  })();

  (function() {
    var checkbox = toDoApp.createCheckbox(false, 'checkbox-id', () => {});
    expct(checkbox.tagName).toEqual('INPUT');
    expct(checkbox.id).toEqual('checkbox-id');
    console.log('✔', 'createCheckbox() should return a checkbox element with the specified id');
  })();

  (function() {
    var labelWrapper = toDoApp.createLabel('this is a todo', false, 'label-id');
    expct(labelWrapper.tagName).toEqual('SPAN');
    console.log('✔', 'createLabel() should return a label element wrapped in a <span> for incomplete todos');
  })();

  (function() {
    var labelWrapper = toDoApp.createLabel('this is a todo', true, 'label-id');
    expct(labelWrapper.tagName).toEqual('DEL');
    console.log('✔', 'createLabel() should return a label element wrapped in a <del> for complete todos');
  })();

  (function() {
    var label = toDoApp.createLabel('this is a todo', true, 'label-id').children[0];
    expct(label.tagName).toEqual('LABEL');
    console.log('✔', 'createLabel() should return an element where the first child is a label');
    expct(label.htmlFor).toEqual('label-id');
    console.log('✔', 'createLabel() should return a label element with the correct `for` attribute');
  })();

  (function() {
    var toDoElement = toDoApp.createToDoElement('this is the content', false, 'thisIsTheId');
    expct(toDoElement.tagName).toEqual('DIV');
    console.log('✔', 'createToDoElement() should return a <div>');
    expct(toDoElement.children[0].tagName).toEqual('INPUT');
    console.log('✔', 'the <div> should have a checkbox child element');
    expct(toDoElement.children[1].tagName).toEqual('SPAN');
    console.log('✔', 'the <div> should have a label child element');
    expct(toDoElement.children[2].tagName).toEqual('BUTTON');
    console.log('✔', 'the <div> should have a button child element');
  })();

  (function() {
    var oldState = [
      { content: 'peter pan' },
      { content: 'alice' },
      { content: 'harry potter' },
    ];
    var newState = toDoApp.addToDo(oldState, 'wonder woman');
    expct(newState.length).toEqual(4);
    expct(newState[3].content).toEqual('wonder woman');
    expct(newState[3].id).toEqual('wonderwoman');
    expct(newState[3].done).toEqual(false);
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
    expct(newState.length).toEqual(4);
    expct(newState[3].content).toEqual('luke skywalker');
    console.log('✔', 'removeToDo() should return the correct state object');
  })();

  (function() {
    var oldState = [{ done: false, id: 'special-id' }];
    var newState = toDoApp.toggleToDo(oldState, 'special-id');
    expct(newState[0].done).toEqual(true);
    console.log('✔', 'toggleToDo() should return the correct state object');
  })();
}
