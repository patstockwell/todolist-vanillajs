var redax = (function() {
  var state;
  var reducer;
  var listeners = [];

  function getState() {
    return state;
  }

  function subscribe(func) {
    listeners.push(func);
  }

  function dispatch(action) {
    state = reducer(Object.assign({}, state), action);
    listeners.forEach(function(listener) {
      listener(state);
    });
  }

  function createStore(rdcer) {
    reducer = rdcer;
    state = reducer(); // set the initial state
    return {
      getState: getState,
      dispatch: dispatch,
      subscribe: subscribe,
    }
  }

  return {
    createStore: createStore,
  };
})()
