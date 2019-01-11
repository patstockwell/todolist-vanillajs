if (typeof toDoApp === 'object') {
  (function() {
    function expect(left) {
      return {
        toEqual: function(right) {
          if (JSON.stringify(left) !== JSON.stringify(right)) {
            throw new Error(`Test failed.
              Expected: ${JSON.stringify(right)}
              Received: ${JSON.stringify(left)}
              `
            );
          }
        },
      };
    }

    (function() {
      var deleteButton = toDoApp.createDeleteButton('myId', () => {});
      expect(deleteButton.tagName).toEqual('BUTTON');
      expect(deleteButton.id).toEqual('delete-myId');
      console.log('✔', 'createDeleteButton() should return a button element with the specified id')
    })();

    (function() {
      var idWordList = toDoApp.createId('this sentence has spaces').split(' ');
      expect(idWordList.length).toEqual(1);
      console.log('✔', 'createId() should return a string without spaces');
    })();

    (function() {
      var checkbox = toDoApp.createCheckbox(false, 'checkbox-id', () => {});
      expect(checkbox.tagName).toEqual('INPUT');
      expect(checkbox.id).toEqual('checkbox-id');
      console.log('✔', 'createCheckbox() should return a checkbox element with the specified id');
    })();

    (function() {
      var label = toDoApp.createLabel('this is a todo', true, 'label-id');
      expect(label.firstChild.tagName).toEqual('STRIKE');
      console.log('✔', 'createLabel() should return a label element with a <strike> tag for complete todos');
    })();

    (function() {
      var label = toDoApp.createLabel('this is a todo', false, 'label-id');
      expect(label.firstChild.textContent).toEqual('this is a todo');
      console.log('✔', 'createLabel() should return a label element with the correct text for incomplete todos');
    })();

    (function() {
      var label = toDoApp.createLabel('this is a todo', true, 'label-id');
      expect(label.tagName).toEqual('LABEL');
      console.log('✔', 'createLabel() should return an element where the first child is a label');
      expect(label.htmlFor).toEqual('label-id');
      console.log('✔', 'createLabel() should return a label element with the correct `for` attribute');
    })();

    (function() {
      var toDoElement = toDoApp.createToDoElement('this is the content', false, 'thisIsTheId');
      expect(toDoElement.tagName).toEqual('DIV');
      console.log('✔', 'createToDoElement() should return a <div>');
      expect(toDoElement.children[0].tagName).toEqual('INPUT');
      console.log('✔', 'the <div> should have a checkbox child element');
      expect(toDoElement.children[1].tagName).toEqual('LABEL');
      console.log('✔', 'the <div> should have a label child element');
      expect(toDoElement.children[2].tagName).toEqual('BUTTON');
      console.log('✔', 'the <div> should have a button child element');
    })();

    (function() {
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
      expect(newState.length).toEqual(4);
      expect(newState[3].content).toEqual('luke skywalker');
      console.log('✔', 'removeToDo() should return the correct state object');
    })();

    (function() {
      var oldState = [{ done: false, id: 'special-id' }];
      var newState = toDoApp.toggleToDo(oldState, 'special-id');
      expect(newState[0].done).toEqual(true);
      console.log('✔', 'toggleToDo() should return the correct state object');
    })();

    (function() {
      var oldState = {
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript890' },
        ],
      };
      var newState = toDoApp.reducer(oldState, { type: 'ADD_TODO', content: 'pass this test' });
      expect(newState).toEqual({
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript890'},
          { done: false, content: 'pass this test', id: 'passthistest'},
        ],
      });
      console.log('✔', 'reducer() ADD_TODO should return the correct state object');
    })();

    (function() {
      var oldState = {
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript890' },
        ],
      };
      var newState = toDoApp.reducer(oldState, { type: 'TOGGLE_TODO', id: 'learnjavascript890' });
      expect(newState).toEqual({
        toDos: [
          { done: true, content: 'learn javascript', id: 'learnjavascript890'},
        ],
      });
      console.log('✔', 'reducer() TOGGLE_TODO should return the correct state object');
    })();

    (function() {
      var oldState = {
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript890' },
          { done: false, content: 'clean the kitchen', id: 'cleanthekitchen' },
        ],
      };
      var newState = toDoApp.reducer(oldState, { type: 'REMOVE_TODO', id: 'cleanthekitchen' });
      expect(newState).toEqual({
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript890'},
        ],
      });
      console.log('✔', 'reducer() REMOVE_TODO should return the correct state object');
    })();

    (function() {
      var newState = toDoApp.reducer();
      expect(newState).toEqual({
        filter: 'NONE',
        toDos: [],
      });
      console.log('✔', 'reducer() should return the correct state object when no state is given');
    })();

    (function() {
      var oldState = {
        filter: 'NONE',
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
          { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
        ],
      };
      var filteredToDos = toDoApp.filterToDos(oldState);
      expect(filteredToDos).toEqual([
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
          { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
      ]);
      console.log('✔', 'filterToDos() NONE should return an unfiltered array of toDos');
    })();

    (function() {
      var oldState = {
        filter: 'DONE',
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
          { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
        ],
      };
      var filteredToDos = toDoApp.filterToDos(oldState);
      expect(filteredToDos).toEqual([
          { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
      ]);
      console.log('✔', 'filterToDos() DONE should return an unfiltered array of toDos');
    })();

    (function() {
      var oldState = {
        filter: 'NOT_DONE',
        toDos: [
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
          { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
        ],
      };
      var filteredToDos = toDoApp.filterToDos(oldState);
      expect(filteredToDos).toEqual([
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
      ]);
      console.log('✔', 'filterToDos() DONE should return an unfiltered array of toDos');
    })();

    (function() {
      var allToDos = [
        { done: false, content: 'learn javascript', id: 'learnjavascript'},
        { done: true, content: 'clean the kitchen', id: 'cleanthekitchen' },
      ];
      var clearedToDos = toDoApp.removeAllDoneToDos(allToDos);
      expect(clearedToDos).toEqual([
          { done: false, content: 'learn javascript', id: 'learnjavascript'},
      ]);
      console.log('✔', 'removeAllDoneToDos() should remove all completed toDos from the array');
    })();
  })();
}
