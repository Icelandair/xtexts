import { Component } from "react"
import PropTypes from "prop-types"

// set up a passthrough so tooling will pick up the strings
const gettext = String
const actions = [
  { label: gettext("Up"),    value: 'up'    },
  { label: gettext("Down"),  value: 'down'  },
  { label: gettext("Left"),  value: 'left'  },
  { label: gettext("Right"), value: 'right' }
]

export default class CloseButton extends Component {
  static contextTypes = {
    gettext: PropTypes.func
  }
    
  render () {
    // reference the translations function indirectly
    // to prevent the tooling from pulling strings from it
    const _gettext = this.context.gettext
    return (
      <div>
      {actions.map(action => {
        <label>
        <input type="radio" name="dir" value={action.value} />
          {_gettext(action.label)}
        </label>
      })}
      </div>
    )
  }
}
