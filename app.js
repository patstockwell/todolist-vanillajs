(function(expct, redax) {

  // state management
  function reducer(state, action) {
    if (state === undefined) {
      return { todos: [] };
    }

    var toDosCopy = state.todos.slice();

    switch (action.type) {
      case 'ADD_TODO':
        return Object.assign({}, state, {
          todos: addToDo(toDosCopy, action.content),
        });
      case 'TOGGLE_TODO':
        return Object.assign({}, state, {
          todos: toggleToDo(toDosCopy, action.id),
        });
      case 'REMOVE_TODO':
        return Object.assign({}, state, {
          todos: removeToDo(toDosCopy, action.id),
        });
      default:
        return state;
    }
  }

  function addToDo(toDos, content) {
    return toDos.concat([{
      done: false,
      content: content,
      id: createId(content),
    }]);
  }

  function removeToDo(state, eventId) {
    for (var i = 0; i < state.length; i++) {
      if(eventId === state[i].id){
        return state.slice(0, i).concat(state.slice(i + 1));
      }
    }
    return state;
  }

  function toggleToDo(state, eventId) {
    for(var i = 0; i < state.length; i++) {
      if(eventId === state[i].id) {
        state[i].done = !state[i].done
      }
    }
    return state;
  }

  var store = redax.createStore(reducer);

  // DOM management

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

  function render(state) {
    rootElement.innerHTML = '';
    var toDoListElements = createToDoList(state.todos, createToDoElement);
    toDoListElements.forEach(function(element) {
      rootElement.appendChild(element);
    });
  }

  function handleDeleteClick(event) {
    var eventId = event.target.id.split('-')[1];
    store.dispatch({ type: 'REMOVE_TODO', id: eventId });
  }

  function handleCheckboxClick(event) {
    store.dispatch({ type: 'TOGGLE_TODO', id: event.target.id });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(input.value) {
      store.dispatch({ type: 'ADD_TODO', content: input.value });
      input.value = '';
    }
  }

  toDoForm.addEventListener('submit', handleSubmit);

  // run the tests
  toDoTests({
    createToDoList: createToDoList,
    createDeleteButton: createDeleteButton,
    createLabel: createLabel,
    createCheckbox: createCheckbox,
    createToDoElement, createToDoElement,
    createId: createId,
    addToDo: addToDo,
    removeToDo: removeToDo,
    toggleToDo: toggleToDo,
    reducer: reducer,
  }, expct);

  // render the initial state []
  store.subscribe(render);

})(expect, redax)

