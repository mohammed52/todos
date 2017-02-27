import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  logToConsole(msg) {
    check(msg, String);
    // debugger;
    console.log(msg);
  },
});
