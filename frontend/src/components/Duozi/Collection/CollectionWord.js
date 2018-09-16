import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CollectionWord extends Component {

  render() {
    return (
      <div>
        <strong>
          {this.props.mode ? this.props.word.simplified : this.props.word.traditional}
        </strong>
        <div>
          {this.props.word.pinyins.map(pinyin => 
            <p key={pinyin}>
              {pinyin}
            </p>
          )}
        </div>
      </div>
    );
  }
}

CollectionWord.propTypes = {
  word: PropTypes.object,
  mode: PropTypes.bool
};

export default CollectionWord;