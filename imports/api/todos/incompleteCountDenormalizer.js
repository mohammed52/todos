import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Todos } from './todos.js';
import { Lists } from '../lists/lists.js';

// denormaliser - duplicate documents as per requirement
// in this case, lists updated after a todo updation
const incompleteCountDenormalizer = {
  _updateList(listId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const incompleteCount = Todos.find({
      listId,
      checked: false,
    }).count();

    const ranks = Todos.find({},{
      listId: 0,
      text: 0,
      createdAt: 0,
      checked: 0,
      rank: 1,}).fetch();
    let sumRanks = 0;
    for (var i = ranks.length - 1; i >= 0; i--) {
      sumRanks+= ranks[i].rank;
    }

    debugger
    Meteor.call("logNumberToConsole", incompleteCount);
    // Meteor.call("logObjectToConsole", ranks);

    Lists.update(listId, { $set: { incompleteCount } });
  },
  afterInsertTodo(todo) {
    
    this._updateList(todo.listId);
  },
  afterUpdateTodo(selector, modifier) {
    // debugger
    // Meteor.call('logToConsole', 'Hello World');
    
    // We only support very limited operations on todos
    check(modifier, { $set: Object });


    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      Todos.find(selector, { fields: { listId: 1 } }).forEach((todo) => {
        this._updateList(todo.listId);
      });
    }
  },
  // Here we need to take the list of todos being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)
  afterRemoveTodos(todos) {
    todos.forEach(todo => this._updateList(todo.listId));
  },
};

export default incompleteCountDenormalizer;
