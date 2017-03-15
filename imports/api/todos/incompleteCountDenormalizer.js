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

    const ranks = Todos.find({listId, checked: false},
      {fields: { 
        listId: 0,
        text: 0,
        createdAt: 0,
        checked: 0
      }}).fetch();
    let sumRank = 0;
    //get name of list

    const listName = Lists.find({ _id: listId},{fields: { 
        name: 1
      }}).fetch();
    
    debugger
    
    Meteor.call("logStringToConsole", "List Name: "+listName[0].name);
    Meteor.call("logStringToConsole", "Counting...");
    
    for (var i = ranks.length - 1; i >= 0; i--) {
      sumRank+= ranks[i].rank;
      Meteor.call("logStringToConsole", "rank[i]...");
      Meteor.call("logNumberToConsole", ranks[i].rank);  
      Meteor.call("logNumberToConsole", sumRank);  
      Meteor.call("logStringToConsole", "------------------");
    }

    
    Meteor.call("logNumberToConsole", sumRank);
    // Meteor.call("logObjectToConsole", ranks);

    Lists.update(listId, { $set: { incompleteCount: incompleteCount, sumRank: sumRank} });
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
