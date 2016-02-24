'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var HelloWorld = React.createClass({
  render: function () {
    return (
    <div>
      <h1>Hello World</h1>
    </div>
    )
  }
});

ReactDOM.render(<div><Hello World /><Hello World /></div>, document.body)



var HelloWorld = React.createClass({
  render: function () {
    return (
      <div>
      Hello World!
      </div>
      )
  }
});

ReactDom.render(<HelloWorld />, document.getElementById('app'));


var HelloUser = React.createClass({
  getInitialState: function () {
    return {
      username: '@codyss'
    }
  },
  handleChange: function(elem) {
    this.setState({
      username: elem.target.value
    })
  }
  render: fucntion () {
    return (
      <div>
      Hello {this.state.username}
      Change Name: <input type="text" value={this.state.username} onChange={this.handleChange} />
      </div>
    )
  }
});

// onChange will call the specified method every time the value in the input box changes