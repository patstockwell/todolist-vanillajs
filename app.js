if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    console.log('attempting to install service worker');
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

/* exported toDoApp */
var toDoApp = (function(redax) {
  var RUN_UNIT_TESTS = false;

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
    case 'CHECK_LOCAL_STORAGE_FOR_TODOS':
      return Object.assign({}, state, {
        toDos: getLocalState(),
      });
    case 'SET_LOCAL_STORAGE':
      localStorage.setItem('toDoItems', JSON.stringify(state.toDos));
      return state;
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
        toDos: removeAllDoneToDos(toDosCopy, state.filter),
      });
    default:
      return state;
    }
  }

  function getLocalState() {
    var localState = localStorage.getItem('toDoItems')
      ? JSON.parse(localStorage.getItem('toDoItems'))
      : [];
    return localState;
  }

  function addToDo(toDos, content) {
    return toDos.concat([{
      done: false,
      deleted: false,
      content: content,
      id: createId(content),
    }]);
  }

  function removeToDo(toDos, eventId) {
    for (var i = 0; i < toDos.length; i++) {
      if(eventId === toDos[i].id){
        if (toDos[i].deleted) {
          return toDos.slice(0, i).concat(toDos.slice(i + 1));
        } else {
          toDos[i].deleted = true;
        }
      }
    }
    return toDos;
  }

  function toggleToDo(toDos, eventId) {
    for(var i = 0; i < toDos.length; i++) {
      if(eventId === toDos[i].id) {
        toDos[i].done = !toDos[i].done;
      }
    }
    return toDos;
  }

  function removeAllDoneToDos(toDos, filter) {
    if (filter === 'REMOVED') {
      const filteredtodos = toDos.filter(function(toDo) {
        if (!toDo.deleted) {
          return toDo;
        }
      });
      return filteredtodos;
    } else {
      return toDos.map(function(toDo) {
        if (toDo.done) {
          toDo.deleted = true;
        }
        return toDo;
      });
    }
  }

  function filterToDos(state) {
    return state.toDos.filter(function(toDo) {
      if (state.filter === 'NONE' && !toDo.deleted) {
        return toDo;
      } else if (state.filter === 'DONE' && toDo.done && !toDo.deleted) {
        return toDo;
      } else if (state.filter === 'NOT_DONE' && !toDo.done && !toDo.deleted) {
        return toDo;
      } else if (state.filter === 'REMOVED' && toDo.deleted) {
        return toDo;
      }
    });
  }

  var store = redax.createStore(reducer);

  // DOM management

  var rootElement = document.getElementById('root');
  var toDoForm = document.getElementById('form');
  var input = document.getElementById('input');
  var buttonAll = document.getElementById('button-all');
  var buttonActive = document.getElementById('button-active');
  var buttonCompleted = document.getElementById('button-completed');
  var buttonRemoved = document.getElementById('button-removed');
  var buttonRemoveAllDone = document.getElementById('button-remove-all-done');
  var buttons = [ buttonAll, buttonActive, buttonCompleted, buttonRemoved ];

  function createId(content) {
    return content.split(' ').join('');
  }

  function createToDoElement(toDo) {
    var div = document.createElement('div');
    div.setAttribute('class', 'to-do-item');
    var checkBox = createCheckbox(toDo, handleCheckboxClick);
    var label = createLabel(toDo);
    var deleteButton = createDeleteButton(toDo, handleDeleteClick);

    div.appendChild(checkBox);
    div.appendChild(label);
    div.appendChild(deleteButton);
    return div;
  }

  function createCheckbox(toDo, listener) {
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'checkbox');
    input.setAttribute('id', toDo.id);
    input.checked = toDo.done;
    input.addEventListener('change', listener);
    return input;
  }

  function createLabel(toDo) {
    var label = document.createElement('label');
    label.setAttribute('for', toDo.id);
    label.innerHTML = (toDo.done ? toDo.content.strike() : toDo.content);
    return label;
  }

  function createDeleteButton(toDo, listener) {
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('id', 'delete-' + toDo.id);
    deleteButton.setAttribute('class', 'delete-button');
    deleteButton.innerHTML = '&#10005;';
    deleteButton.addEventListener('click', listener);
    return deleteButton;
  }

  function render(state) {
    rootElement.innerHTML = '';
    filterToDos(state)
      .map(function(toDo) {
        return createToDoElement(toDo);
      })
      .forEach(function(element) {
        rootElement.appendChild(element);
      });
    renderButtonHighlight(state.filter);
  }

  function renderButtonHighlight(filter) {
    buttons.forEach(function(button) {
      button.setAttribute('class', '');
    });
    if (filter === 'DONE') {
      buttonCompleted.setAttribute('class', 'active');
    } else if (filter === 'NOT_DONE') {
      buttonActive.setAttribute('class', 'active');
    } else if (filter === 'REMOVED') {
      buttonRemoved.setAttribute('class', 'active');
    } else {
      buttonAll.setAttribute('class', 'active');
    }
  }


  function handleDeleteClick(event) {
    var eventId = event.target.id.split('-')[1];
    store.dispatch({ type: 'REMOVE_TODO', id: eventId });
    store.dispatch({ type: 'SET_LOCAL_STORAGE' });
  }

  function handleCheckboxClick(event) {
    store.dispatch({ type: 'TOGGLE_TODO', id: event.target.id });
    store.dispatch({ type: 'SET_LOCAL_STORAGE' });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(input.value) {
      store.dispatch({ type: 'ADD_TODO', content: input.value });
      store.dispatch({ type: 'SET_LOCAL_STORAGE' });
      input.value = '';
    }
  }

  function handleFilterButtonClick(event) {
    var id = event.target.id;

    if (id === 'button-all') {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'NONE' });
    } else if (id === 'button-active') {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'NOT_DONE' });
    } else if (id === 'button-removed') {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'REMOVED' });
    } else {
      store.dispatch({ type: 'CHANGE_FILTER', filter: 'DONE' });
    }
  }

  function handleRemoveAllDone() {
    store.dispatch({ type: 'REMOVE_ALL_DONE_TODOS' });
    store.dispatch({ type: 'SET_LOCAL_STORAGE' });
  }

  toDoForm.addEventListener('submit', handleSubmit);
  toDoForm.addEventListener('focusout', handleSubmit);
  buttonAll.addEventListener('click', handleFilterButtonClick);
  buttonActive.addEventListener('click', handleFilterButtonClick);
  buttonCompleted.addEventListener('click', handleFilterButtonClick);
  buttonRemoved.addEventListener('click', handleFilterButtonClick);
  buttonRemoveAllDone.addEventListener('click', handleRemoveAllDone);

  // register the render method with redax store
  store.subscribe(render);
  store.dispatch({ type: 'CHECK_LOCAL_STORAGE_FOR_TODOS' });

  if (RUN_UNIT_TESTS) {
    return {
      createDeleteButton: createDeleteButton,
      createLabel: createLabel,
      createCheckbox: createCheckbox,
      createToDoElement: createToDoElement,
      createId: createId,
      addToDo: addToDo,
      removeToDo: removeToDo,
      toggleToDo: toggleToDo,
      reducer: reducer,
      filterToDos: filterToDos,
      removeAllDoneToDos: removeAllDoneToDos,
    };
  }

})(redax);

