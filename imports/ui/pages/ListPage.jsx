import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

import { connect } from 'react-redux'
import {changeBackgroundColor} from '../../redux/actions/actions'


var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;

class ListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingTodo: null });
    this.onEditingChange = this.onEditingChange.bind(this);
    this.btnClickChangeColor = this.btnClickChangeColor.bind(this);

  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null,
    });
  }

  btnClickChangeColor(){
    console.log("button clicked");
    const { onBtnClickChangeColor } = this.props;
    onBtnClickChangeColor();
  }

  render() {
    const { list, listExists, loading, todos, backgroundColor } = this.props;
    console.log("backgroundColor: ", backgroundColor);

    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage />;
    }

    let Todos;
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title={i18n.__('pages.listPage.noTasks')}
          subtitle={i18n.__('pages.listPage.addAbove')}
        />
      );
    } else {
      Todos = todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo._id}
          editing={todo._id === editingTodo}
          onEditingChange={this.onEditingChange}
        />
      ));
    }

    return (
      <div>
      <div className="page lists-show list-area testbg-1">
        <ListHeader list={list} />
        <div className="content-scrollable list-items list-box testbg-1">
          {loading
            ? <Message title={i18n.__('pages.listPage.loading')} />
            : Todos}
        </div>  
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Button className="testbg-2" onClick={this.btnClickChangeColor}>Change Background</Button>
      </div>
    );
  }
}

ListPage.propTypes = {
  list: React.PropTypes.object,
  todos: React.PropTypes.array,
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  return {
    backgroundColor: state.backgroundColor,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBtnClickChangeColor: () => {
      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color1 = '#';
        for (var i = 0; i < 6; i++ ) {
            color1 += letters[Math.floor(Math.random() * 16)];
        }
        return color1;
      }

      dispatch(changeBackgroundColor(getRandomColor()))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPage)