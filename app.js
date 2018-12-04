window.onload = function() {
  const state = [
    {
      done: true,
      content: 'Book the car in for a service with the mechanic',
    },
    {
      done: false,
      content: 'Put the xmas tree up',
    },
    {
      done: true,
      content: 'Go to the gym',
    },
    {
      done: false,
      content: 'Call mum',
    },
    {
      done: false,
      content: 'Do the dishes',
    },
  ];

  const rootElement = document.getElementById('root');

  function createToDo(content, done) {
    const id = content.split(' ').join('');
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', id);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    const text = document.createTextNode(content);
    label.appendChild(text);
    div.appendChild(input);
    div.appendChild(label);
    return div;
  };

  function createToDoList(toDos, elementMaker) {
    return toDos.map(function(toDo) {
      return elementMaker(toDo.content, toDo.done);
    });
  };

  function render() {
    const toDoListElements = createToDoList(state, createToDo);
    toDoListElements.forEach(function(element) {
      rootElement.appendChild(element);
    });
  }

  function clearList() {
    rootElement.innerHTML = '';
  }

  render();
};
