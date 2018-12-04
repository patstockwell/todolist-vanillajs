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
    const listElement = document.createElement('li');
    const textElement = document.createTextNode(content);
    listElement.appendChild(textElement);
    return listElement;
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

  render();
};
