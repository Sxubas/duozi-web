import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CollectionWord.css';

//Component to render a basic word visualization
class CollectionWord extends Component {

  render() {
    return (
      <div className='collection-word-container'>
        {!this.props.isPreview ? <i onClick={this.props.onEdit} className='material-icons word-edit'>edit</i> : null}
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
  mode: PropTypes.bool,
  onEdit: PropTypes.func,
  isPreview: PropTypes.bool
};

export default CollectionWord;