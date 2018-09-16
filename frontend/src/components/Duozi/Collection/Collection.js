import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollectionWord from './CollectionWord';

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
    this.state.newWord.pinyin.splice(index, 1);
    this.setState({ newWord: this.state.newWord });
  }

  addPinyin() {
    this.state.newWord.pinyin.push('');
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
      <div>
        <label>
          Simplified hanzi
          <input onInput={event => this.setState({ newWord: { ...this.state.newWord, simplified: event.target.value } })} value={this.state.newWord.simplified} type="text" />
        </label>
        <label>
          Traditional hanzi
          <input onInput={event => this.setState({ newWord: { ...this.state.newWord, traditional: event.target.value } })} value={this.state.newWord.traditional} type="text" />
        </label>
        <label>
          Pinyin
          {this.state.newWord.pinyin.map((pinyin, i) =>
            <div key={i}>
              <input onInput={event => this.modifyPinyin(i, event)} value={this.state.newWord.pinyin[i]} />

              {i === 0 ? null : <i onClick={() => this.deletePinyin(i)} className="material-icons">remove</i>}
            </div>
          )}
          <i onClick={() => this.addPinyin()} className='material-icons'>add</i>
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
      <div>
        Currently in: collections {this.props.routeParams ? 'with params: ' + JSON.stringify(this.props.routeParams) : 'with no params'}
        <div>
          <div>
            <h3>
              Your Collection
            </h3>
            <small>
              431 Characters
            </small>
          </div>
          <div>
            <i className="material-icons">search</i>
            <input onInput={event => this.setState({ search: event.target.value })} value={this.state.search} type="text" />
          </div>
        </div>
        {this.state.addingWord ? this.renderForm() : null}
        <div>
          <div onClick={() => this.setState({ addingWord: !this.state.addingWord })}>
            <i className='material-icons'>{this.state.addingWord ? 'cancel' : 'add'}</i>
            <label>{this.state.addingWord ? 'Cancel' : 'Add new word'}</label>
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
