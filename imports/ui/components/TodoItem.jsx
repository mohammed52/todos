import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';

import {
  setCheckedStatus,
  updateText,
  updateRank,
  remove,
} from '../../api/todos/methods.js';

export default class TodoItem extends BaseComponent {
  constructor(props) {
    super(props);
    
    this.throttledUpdate = _.throttle((value) => {
      if (value) {
        updateText.call({
          todoId: this.props.todo._id,
          newText: value,
        }, displayError);
      }
    }, 300);

    this.throttledUpdateRank = _.throttle((value) => {
      if (value) {
        updateRank.call({
          todoId: this.props.todo._id,
          newRank: parseInt(value),
        }, displayError);
      }
    }, 300);

    this.setTodoCheckStatus = this.setTodoCheckStatus.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.updateTodoRank = this.updateTodoRank.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onEditingChange(this.props.todo._id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.todo._id, false);
  }

  setTodoCheckStatus(event) {
    setCheckedStatus.call({
      todoId: this.props.todo._id,
      newCheckedStatus: event.target.checked,
    });
  }

  updateTodo(event) {
    this.throttledUpdate(event.target.value);
  }

  updateTodoRank(event) {
    this.throttledUpdateRank(event.target.value);
  }

  deleteTodo() {
    remove.call({ todoId: this.props.todo._id }, displayError);
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing,
    });

    return (
      <div className={todoClass}>
        <label className="checkbox" htmlFor={this.props.todo._id}>
          
          <input
            id={this.props.todo._id}
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus}
          />
          <span className="checkbox-custom" />
        </label>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder={i18n.__('components.todoItem.taskName')}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodo}
        />
        <input
          type="text"
          defaultValue={todo.rank}
          // className="testbg-3 rank-number"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodoRank}
        />
        <a
          className="delete-item"
          href="#delete"
          onClick={this.deleteTodo}
          onMouseDown={this.deleteTodo}
        >
          <span className="icon-trash" />
        </a>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todo: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};
