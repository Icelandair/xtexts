const React = require('react');
const PropTypes = require('prop-types');
const styles = require('./styles.scss');

class TestComponent extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      on: false
    };
  }

  render () {
    const on = this.state.on;
    return (
      <button
        type="button"
        onClick={e => this.setState({ on: !on })}
        >
        {on ? gettext("On") : gettext("Off")}
      </button>
    );
  }

}

module.exports = TestComponent;