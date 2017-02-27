import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  logNumberToConsole(msg) {
    check(msg, Number);
    // debugger;
    console.log(msg);
  },

  logObjectToConsole(msg) {
    check(msg, Object);
    // debugger;
    console.log(msg);
  },
});
