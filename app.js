(function(expct, redax) {

  // state management
  function reducer(state, action) {
    if (state === undefined) {
      return {
        filter: 'NONE',
        toDos: [],
      };
    }

    var toDosCopy = state.toDos.slice();

    switch (action.type) {
      case 'ADD_TODO':
        return Object.assign({}, state, {
          toDos: addToDo(toDosCopy, action.content),
        });
      case 'TOGGLE_TODO':
        return Object.assign({}, state, {
          toDos: toggleToDo(toDosCopy, action.id),
        });
      case 'REMOVE_TODO':
        return Object.assign({}, state, {
          toDos: removeToDo(toDosCopy, action.id),
        });
      case 'CHANGE_FILTER':
        return Object.assign({}, state, {
          filter: action.filter,
        });
      case 'REMOVE_ALL_DONE_TODOS':
        return Object.assign({}, state, {
          toDos: removeAllDoneToDos(toDosCopy),
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

  function removeToDo(toDos, eventId) {
    for (var i = 0; i < toDos.length; i++) {
      if(eventId === toDos[i].id){
        return toDos.slice(0, i).concat(toDos.slice(i + 1));
      }
    }
    return toDos;
  }

  function toggleToDo(toDos, eventId) {
    for(var i = 0; i < toDos.length; i++) {
      if(eventId === toDos[i].id) {
        toDos[i].done = !toDos[i].done
      }
    }
    return toDos;
  }

  function removeAllDoneToDos(toDos) {
    return toDos.reduce(function(accumulator, currentValue) {
      if (currentValue.done) {
        return accumulator;
      } else {
        return accumulator.concat([currentValue])
      }
    }, []);
  }

  function filterToDos(state) {
    var filteredToDos = state.toDos.map(function(toDo) {
      if (state.filter === 'NONE') {
        return toDo;
      } else if (state.filter === 'DONE' && toDo.done) {
        return toDo;
      } else if (state.filter === 'NOT_DONE' && !toDo.done) {
        return toDo;
      } else {
        return null;
      }
    }).reduce(function(accumulator, currentValue) {
      if (currentValue === null) {
        return accumulator;
      } else {
        return accumulator.concat([currentValue])
      }
    }, []);

    return filteredToDos;
  }

  var store = redax.createStore(reducer);

  // DOM management

  var rootElement = document.getElementById('root');
  var toDoForm = document.getElementById('form');
  var input = document.getElementById('input');
  var buttonAll = document.getElementById('button-all');
  var buttonActive = document.getElementById('button-active');
  var buttonCompleted = document.getElementById('button-completed');
  var buttonRemoveAllDone = document.getElementById('button-remove-all-done');

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
    var filteredToDos = filterToDos(state);
    rootElement.innerHTML = '';
    var toDoListElements = createToDoList(filteredToDos, createToDoElement);
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

  function handleFilterButtonClick(event) {
    var id = event.target.id;
    if (id === 'button-all') {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'NONE' });
    } else if (id === 'button-active') {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'NOT_DONE' });
    } else {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'DONE' });
    }
  }

  function handleRemoveAllDone(event) {
    store.dispatch({ type: 'REMOVE_ALL_DONE_TODOS' });
  }

  toDoForm.addEventListener('submit', handleSubmit);
  buttonAll.addEventListener('click', handleFilterButtonClick);
  buttonActive.addEventListener('click', handleFilterButtonClick);
  buttonCompleted.addEventListener('click', handleFilterButtonClick);
  buttonRemoveAllDone.addEventListener('click', handleRemoveAllDone);

  // run the tests
  false && toDoTests({
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
    filterToDos: filterToDos,
    removeAllDoneToDos: removeAllDoneToDos,
  }, expct);

  // render the initial state []
  store.connect(render);

})((false && expect), redax)

