import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollectionWord from './CollectionWord';
import './Collection.css';

class Collection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collection: [],
      search: '',
      addingWord: false,
      newWord: {
        simplified: '',
        traditional: '',
        pinyins: [
          ''
        ]
      }
    };
    
    this.sendForm = this.sendForm.bind(this);
  }

  //Fetches data from backend and sets state from route params
  componentWillMount() {
    fetch('/collections', {
      method: 'GET',
      headers: {
        email: this.props.email
      }
    }).then(resp => resp.json()).then(json => {
      const collection = json;
      collection.sort((a, b) => b.dateCreated - a.dateCreated);
      this.setState({ collection });
    }).catch(err => {
      console.log(err);
    });

    if (this.props.routeParams && this.props.routeParams.add) {
      this.setState({ addingWord: true });
    }

  }

  deletePinyin(index) {
    this.state.newWord.pinyins.splice(index, 1);
    this.setState({ newWord: this.state.newWord });
  }

  addPinyin() {
    this.state.newWord.pinyins.push('');
    this.setState({ newWord: this.state.newWord });
  }

  modifyPinyin(i, event) {
    const replaceWord = this.state.newWord;
    replaceWord.pinyin[i] = event.target.value;
    this.setState({ newWord: replaceWord });
  }

  sendForm() {

    let formData = this.state.newWord;
    formData.email = this.props.email;
    console.log(this.props.email);

    fetch('/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(resp => resp.json()).then(json => {
      this.setState({
        newWord: {simplified: '', traditional: '', pinyin: ['']}
      });
    });

  }

  renderForm() {
    return (
      <div className='collection-top-form'>
        <label>
          Simplified hanzi: 
          <input onInput={event => this.setState({ newWord: { ...this.state.newWord, simplified: event.target.value } })} value={this.state.newWord.simplified} type="text" />
        </label>
        <label>
          Traditional hanzi: 
          <input onInput={event => this.setState({ newWord: { ...this.state.newWord, traditional: event.target.value } })} value={this.state.newWord.traditional} type="text" />
        </label>
        <label className='collection-top-form-pinyin'>
          Pinyin:  
          {this.state.newWord.pinyins.map((pinyin, i) =>
            <div key={i}>
              <input onInput={event => this.modifyPinyin(i, event)} value={this.state.newWord.pinyins[i]} />

              {i === 0 ? null : <i onClick={() => this.deletePinyin(i)} className="material-icons">remove</i>}
            </div>
          )}
          <div onClick={() => this.addPinyin()} className='collection-top-form-add-tooltip'><i className='material-icons'>add</i>Add another pinyin</div>
        </label>
        <button onClick={this.sendForm}>Add word</button>
        <button onClick={() => this.setState({ addingWord: false })}>Cancel</button>
      </div>
    );
  }

  renderCharacters() {
    return this.state.collection.map(word =>
      <CollectionWord word={word} key={word._id} />
    );
  }

  render() {
    return (
      <div className='collection-container'>
        <div className='collection-top-container'>
          <div className='collection-top-title'>
            <h3>
              Your Collection
            </h3>
            <small>
              431 Characters
            </small>
          </div>
          <div className='collection-top-search'>
            <i className="material-icons">search</i>
            <input onInput={event => this.setState({ search: event.target.value })} placeholder='Search by pinyin or hanzi' value={this.state.search} type="text" />
          </div>
        </div>
        {this.state.addingWord ? this.renderForm() : null}
        <div className='collection-word-card-container'>
          <div className='collection-add-word' onClick={() => this.setState({ addingWord: !this.state.addingWord })}>
            <i className='material-icons'>{this.state.addingWord ? 'cancel' : 'add'}</i>
            <p>{this.state.addingWord ? 'Cancel' : 'Add new word'}</p>
          </div>
          {this.renderCharacters()}
        </div>
        <button onClick={() => this.props.navigate('home')} className='floating-left'> <i className='material-icons'>arrow_back</i> Home</button>
      </div>
    );
  }
}

Collection.propTypes = {
  email: PropTypes.string,
  navigate: PropTypes.func,
  routeParams: PropTypes.object
};

export default Collection;
