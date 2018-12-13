var toDoApp = (function() {
  var state = [
    {
      done: true,
      content: 'Book the car in for a service with the mechanic',
      id: 'bookthecar',
    },
    {
      done: false,
      content: 'Put the xmas tree up',
      id: 'putthexmas',
    },
    {
      done: true,
      content: 'Go to the gym',
      id: 'gotothegym',
    },
    {
      done: false,
      content: 'Call mum',
      id: 'callmum',
    },
    {
      done: false,
      content: 'Do the dishes',
      id: 'dothedishes',
    },
  ];

  var rootElement = document.getElementById('root');
  var toDoForm = document.getElementById('form');
  var input = document.getElementById('input');

  function createId(content) {
    return content.split(' ').join('');
  }

  function createToDoElement(content, done, id) {
    var div = document.createElement('div');
    var checkBox = createCheckbox(done, id, handleCheckboxClick);
    var label = createLabel(content, done, id);
    var deleteButton = createDeleteButton(id, handleDeleteClick);

    div.appendChild(checkBox);
    div.appendChild(label);
    div.appendChild(deleteButton);
    return div;
  };

  function createCheckbox(done, id, listener) {
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', id);
    input.checked = done;
    input.addEventListener('change', listener);
    return input;
  }

  function createLabel(content, done, id) {
    var labelWrapper = document.createElement(done ? 'del' : 'span');
    var label = document.createElement('label');
    label.setAttribute('for', id);
    var labelText = document.createTextNode(content);
    label.appendChild(labelText);
    labelWrapper.appendChild(label);
    return labelWrapper;
  }

  function createDeleteButton(id, listener) {
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('id', 'delete-' + id);
    deleteButton.onclick = listener;
    deleteButton.innerHTML = '&#10005;';
    deleteButton.addEventListener('click', listener);
    return deleteButton;
  }

  function createToDoList(toDos, elementMaker) {
    return toDos.map(function(toDo) {
      return elementMaker(toDo.content, toDo.done, toDo.id);
    });
  };

  function addToDo(state, content) {
    return state.concat([{
      done: false,
      content: content,
      id: createId(content),
    }]);
  }

  function render() {
    var toDoListElements = createToDoList(state, createToDoElement);
    toDoListElements.forEach(function(element) {
      rootElement.appendChild(element);
    });
  }

  function reRender() {
    rootElement.innerHTML = '';
    render();
  }

  function handleCheckboxClick(event) {
    state.forEach(function(toDo) {
      if(event.target.id === toDo.id){
        toDo.done = !toDo.done;
      }
    });
    reRender();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(input.value) {
      state = addToDo(state, input.value);
      input.value = '';
      reRender();
    }
  }

  function handleDeleteClick(event) {
    var eventId = event.target.id.split('-')[1];
    state.forEach(function(toDo, i) {
      if(eventId === toDo.id){
        console.log('found');
        state.splice(i, 1);
      }
    });
    reRender();
  }

  toDoForm.addEventListener('submit', handleSubmit);

  return {
    render: render,
    createToDoList: createToDoList,
    createDeleteButton: createDeleteButton,
    createLabel: createLabel,
    createCheckbox: createCheckbox,
    createToDoElement, createToDoElement,
    createId: createId,
    addToDo: addToDo,
  }

})()

toDoApp.render();
