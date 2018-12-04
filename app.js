window.onload = function() {
  const state = [
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

  const rootElement = document.getElementById('root');
  const toDoForm = document.getElementById('form');
  const input = document.getElementById('input');

  function createId(content) {
    return content.split(' ').join('');
  }

  function createToDoElement(content, done, id) {
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', id);
    input.checked = done;
    input.addEventListener('change', toggleDone);
    const wrapper = done ? 'del' : 'span';
    const labelWrapper = document.createElement(wrapper);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    const text = document.createTextNode(content);
    label.appendChild(text);
    labelWrapper.appendChild(label);
    div.appendChild(input);
    div.appendChild(labelWrapper);
    return div;
  };

  function createToDoList(toDos, elementMaker) {
    return toDos.map(function(toDo) {
      return elementMaker(toDo.content, toDo.done, toDo.id);
    });
  };

  function render() {
    const toDoListElements = createToDoList(state, createToDoElement);
    toDoListElements.forEach(function(element) {
      rootElement.appendChild(element);
    });
  }

  function addToDo(content) {
    state.push({
      content: content,
      done: false,
      id: createId(content),
    });
  }

  function reRender() {
    addToDo(input.value);
    input.value = '';
    rootElement.innerHTML = '';
    render();
  }

  function toggleDone(event) {
    state.forEach(function(toDo) {
      if(event.target.id === toDo.id){
        toDo.done = !toDo.done;
      }
    });
    rootElement.innerHTML = '';
    render();
  }


  toDoForm.addEventListener('submit', function() {
    // stop the form from reloading the page
    event.preventDefault();
    reRender();
  })

  render();
};
