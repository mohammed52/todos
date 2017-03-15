/* global document */

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
import { Provider } from 'react-redux';
import Store from '../imports/redux/store';
import React  from 'react';
import {createElement} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// import '../imports/ui/helpers/ClientServerCommon.js';

function TodoAppRoot() {
  return (
      <Provider store={Store}>
        {renderRoutes()}
      </Provider>
  );
}

Meteor.startup(() => {
  render(
          <TodoAppRoot />
    , document.getElementById('app'));
});
