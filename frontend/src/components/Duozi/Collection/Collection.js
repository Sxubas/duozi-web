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
        pinyins: [''],
        def: '',
        categories: []
      },
      editingWord: false,
      editedWord: {
        _id: '',
        simplified: '',
        traditional: '',
        pinyins: [
          ''
        ]
      }
    };

    this.sendForm = this.sendForm.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.sendDelete = this.sendDelete.bind(this);
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

  deleteCategory(index){
    this.state.newWord.categories.splice(index, 1);
    this.setState({ newWord: this.state.newWord });
  }

  addPinyin() {
    this.state.newWord.pinyins.push('');
    this.setState({ newWord: this.state.newWord });
  }

  addCategory(){
    this.state.newWord.categories.push('');
    this.setState({ newWord: this.state.newWord });
  }

  modifyAddPinyin(i, event) {
    const replaceWord = this.state.newWord;
    replaceWord.pinyins[i] = event.target.value;
    this.setState({ newWord: replaceWord });
  }

  modifyCategory(i, event){
    const replaceWord = this.state.newWord;
    replaceWord.categories[i] = event.target.value;
    this.setState({ newWord: replaceWord });
  }

  modifyEditPinyin(i, event) {
    const replaceWord = this.state.newWord;
    replaceWord.pinyins[i] = event.target.value;
    this.setState({ newWord: replaceWord });
  }

  sendForm() {
    let formData = this.state.newWord;
    formData.email = this.props.email;

    fetch('/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(resp => resp.json()).then(json => {
      this.state.collection.push(this.state.newWord);
      this.setState({
        newWord: { simplified: '', traditional: '', pinyins: [''] },
        addingWord: false
      });
    });

  }

  renderAddForm() {
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
              <input onInput={event => this.modifyAddPinyin(i, event)} value={this.state.newWord.pinyins[i]} />

              {i === 0 ? null : <i onClick={() => this.deletePinyin(i)} className="material-icons">remove</i>}
            </div>
          )}
          <div onClick={() => this.addPinyin()} className='collection-top-form-add-tooltip'><i className='material-icons'>add</i>Add another pinyin</div>
        </label>

        <label>
          Definition:
          <input onInput={event => this.setState({ newWord: { ...this.state.newWord, def: event.target.value } })} value={this.state.newWord.def} type="text" />
        </label>

        <label className='collection-top-form-pinyin'>
          Categories:
          {this.state.newWord.categories.map((pinyin, i) =>
            <div key={i}>
              <input onInput={event => this.modifyCategory(i, event)} value={this.state.newWord.categories[i]} />
              <i onClick={() => this.deleteCategory(i)} className="material-icons">remove</i>
            </div>
          )}
          <div onClick={() => this.addCategory()} className='collection-top-form-add-tooltip'><i className='material-icons'>add</i>Add another category</div>
        </label>

        <button onClick={this.sendForm}>Add word</button>
        <button onClick={() => this.setState({ addingWord: false })}>Cancel</button>
      </div>
    );
  }

  sendEdit() {
    let formData = this.state.editedWord;
    formData.email = this.props.email;

    fetch('/collections', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(resp => resp.json()).then(json => {
      this.componentWillMount();
      this.setState({
        editedWord: { simplified: '', traditional: '', pinyins: [''] },
        editingWord: false
      });
    });
  }

  sendDelete(){
    let formData = this.state.editedWord;
    formData.email = this.props.email;

    fetch('/collections', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(resp => {
      this.componentWillMount();
      this.setState({
        editedWord: { simplified: '', traditional: '', pinyins: [''] },
        editingWord: false
      });
    });
  }

  renderEditForm() {
    return (
      <div className='collection-top-form'>
        <label>
          Simplified hanzi:
          <input onInput={event => this.setState({ editedWord: { ...this.state.editedWord, simplified: event.target.value } })} value={this.state.editedWord.simplified} type="text" />
        </label>
        <label>
          Traditional hanzi:
          <input onInput={event => this.setState({ editedWord: { ...this.state.editedWord, traditional: event.target.value } })} value={this.state.editedWord.traditional} type="text" />
        </label>
        <label className='collection-top-form-pinyin'>
          Pinyin:
          {this.state.editedWord.pinyins.map((pinyin, i) =>
            <div key={i}>
              <input onInput={event => this.modifyEditPinyin(i, event)} value={this.state.editedWord.pinyins[i]} />

              {i === 0 ? null : <i onClick={() => this.state.editedWord.pinyins.splice(i, 1)} className="material-icons">remove</i>}
            </div>
          )}
          <div onClick={() => this.state.editedWord.pinyins.push('')} className='collection-top-form-add-tooltip'><i className='material-icons'>add</i>Add another pinyin</div>
        </label>
        <div className='collection-delete-form-buttons'>
          <button onClick={this.sendEdit}>Save changes</button>
          <button onClick={this.sendDelete}>Delete word</button>
        </div>
        <button onClick={() => this.setState({ editingWord: false })}>Cancel</button>
      </div>
    );
  }


  renderCharacters() {
    return this.state.collection.filter(word => {

      let inPinyin = false;
      for(const piny of word.pinyins){
        if(piny.toLowerCase().includes(this.state.search.toLowerCase())){
          inPinyin = true;
          break;
        }
      }

      let inCategories = false;
      for(const cat of word.categories){
        if(cat.toLowerCase().includes(this.state.search.toLowerCase())){
          inCategories = true;
          break;
        }
      }

      const inHanzi = word.simplified.includes(this.state.search) || word.traditional.includes(this.state.search);
      const inDef = word.def.toLowerCase().includes(this.state.search.toLowerCase());

      return inHanzi || inPinyin || inDef || inCategories;
    }).map(word =>
      <CollectionWord
        word={word}
        key={word._id}
        onEdit={() => {
          this.setState({
            editingWord: true,
            editedWord: word
          })
        }}
      />
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
              {this.state.collection.length} Characters
            </small>
          </div>
          <div className='collection-top-search'>
            <i className="material-icons">search</i>
            <input onInput={event => this.setState({ search: event.target.value })} placeholder='Search by pinyin or hanzi' value={this.state.search} type="text" />
          </div>
        </div>
        {this.state.addingWord ? this.renderAddForm() : null}
        {this.state.editingWord ? this.renderEditForm() : null}
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
