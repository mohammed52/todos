import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import i18n from 'meteor/universe:i18n';
import { Todos } from '../todos/todos.js';

// subclass Mongo.Collection and write our own insert() method
// set name of lists as List A, List B, List C etc...

// override insert and remove operations, set approp list name
class ListsCollection extends Mongo.Collection {
  insert(list, callback, locale = 'en') {
    const ourList = list;
    if (!ourList.name) {
      const defaultName = i18n.__(
        'api.lists.insert.list',
        null,
        { _locale: locale }
      );
      let nextLetter = 'A';
      ourList.name = `${defaultName} ${nextLetter}`;

      while (this.findOne({ name: ourList.name })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        ourList.name = `${defaultName} ${nextLetter}`;
      }
    }

    return super.insert(ourList, callback);
  }
  remove(selector, callback) {
    Todos.remove({ listId: selector });
    return super.remove(selector, callback);
  }
}

export const Lists = new ListsCollection('Lists');

// Deny all client-side updates since we will be using methods to manage this collection
Lists.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Lists.schema = new SimpleSchema({
  name: { type: String },
  incompleteCount: { type: Number, defaultValue: 0 },
  userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
  sumRank: { type: Number, defaultValue: 0 },
});

Lists.attachSchema(Lists.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Lists.publicFields = {
  name: 1,
  incompleteCount: 1,
  userId: 1,
  sumRank: 1,
};

// factory helps us encode test data,
Factory.define('list', Lists, {});

// additional helper methods with our collections
Lists.helpers({
  // A list is considered to be private if it has a userId set
  isPrivate() {
    return !!this.userId;
  },
  isLastPublicList() {
    const publicListCount = Lists.find({ userId: { $exists: false } }).count();
    return !this.isPrivate() && publicListCount === 1;
  },
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }

    return this.userId === userId;
  },
  // can also use helper methods to establish associations
  todos() {
    return Todos.find({ listId: this._id }, { sort: { createdAt: -1 } });
  },
});
