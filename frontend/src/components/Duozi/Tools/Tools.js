import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      inputImage: null,
      result: null
    };
  }

  handleChangeText(e) {
    this.setState({text: e.target.value});
  }

  ComponentDidMount() {
    if(this.props.routeParams.tool === 'h2p') {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/hanziToPinyin?hanzi='+text)
          .then(res => res.json())
          .then(json => this.setState({result: json}))
          .catch(err => console.log(err));
      }
    }
    else if(this.props.routeParams.tool === 'p2h') {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/pinyinToHanzi?pinyin='+text)
          .then(res => res.json())
          .then(json => this.setState({result: json}))
          .catch(err => console.log(err));
      }
    }
    else if(this.props.routeParams.tool === 'ocr') {
      //
    }
    else {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/librarySearch?search='+text)
          .then(res => res.json())
          .then(json => this.setState({result: json}))
          .catch(err => console.log(err));
      }
    }
  }

  render() {
    const tool = this.props.routeParams.tool;
    const searchLabel = 'Insert '+(tool === 'h2p' ? 'Hanzi' : (tool==='p2h' ? 'Pinyin' : 'meaning'))+' to search';
    const buttonBack = (
      <div>
        <button onClick={() => this.props.navigate('home', {})}>
          <i className='material-icons'>arrow_back</i>
        </button>
        <label>Home</label>
      </div>
    );
    const searchBar = (
      <div id='search'>
        <span>{searchLabel}</span>
        <div id='searchBar'>
          <input type='text'
            value={this.state.text}
            onChange={this.handleChangeText.bind(this)}
          />
          <button onClick={() => this.ComponentDidMount()}>Search</button>
        </div>
      </div>
    );
    let result = null;
    if(this.state.result) {
      if(tool==='h2p') {
        const list = this.state.result.map((r, i) => {
          return (
            <li key={i}>{r}</li>
          );
        });
        result = (
          <div>
            <h3>Results:</h3>
            <ul>{list}</ul>
          </div>
        );
      }
      else if(tool==='p2h') {
        const list = this.state.result.map((r, i) => {
          return (
            <div key={i}>
              <p>Simplified hanzi: {r.hanzi.simplified}</p>
              <p>Traditional hanzi: {r.hanzi.traditional}</p>
              <p>Pinyin: {r.pinyin}</p>
              <br/>
            </div>
          );
        });
        result = (
          <div>
            <h3>Results:</h3>
            {list}
          </div>
        );
      }
      else if(tool==='ocr') {
        //
      }
      else {
        const list = this.state.result.map((r, i) => {
          const meanings = r.meanings.map((m, i) => {
            return (<p key={i}><i>{m}</i></p>);
          });
          return (
            <div key={i}>
              <p>Simplified hanzi: {r.simplified}</p>
              <p>Traditional hanzi: {r.traditional}</p>
              <p>Pinyin: {r.pinyin}</p>
              <p>Meanings:</p>
              {meanings}
              <br/>
            </div>
          );
        });
        result = (
          <div>
            <h3>Results:</h3>
            {list}
          </div>
        );
      }
    }
    return (tool !== 'ocr'? (<div>{buttonBack}<br />{searchBar}{result}</div>) : (
      <div>
        Currently in: tools {this.props.routeParams ? 'with params: ' + JSON.stringify(this.props.routeParams) : 'with no params'}
      </div>)
    );
  }
}

Tools.propTypes = {
  navigate: PropTypes.func,
  routeParams: PropTypes.object
};

export default Tools;
