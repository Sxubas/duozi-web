import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      selectedFile: null,
      result: null
    };
  }

  fileSelectedHandler(e) {
    this.setState({selectedFile: e.target.files[0]});
  }

  handleChangeText(e) {
    this.setState({text: e.target.value});
  }

  ComponentDidMount() {
    if(this.props.routeParams.tool === 'h2p') {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/hanziToPinyin?hanzi='+text)
          .then(res => {
            if(res.status === 200 ) res.json().then(json => this.setState({result: json}));
          })
          .catch(err => console.log(err));
      }
    }
    else if(this.props.routeParams.tool === 'p2h') {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/pinyinToHanzi?pinyin='+text)
          .then(res => {
            if(res.status === 200 ) res.json().then(json => this.setState({result: json}));
          })
          .catch(err => console.log(err));
      }
    }
    else if(this.props.routeParams.tool === 'ocr') {
      this.setState({result: null});
      const formData = new FormData();
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.state.selectedFile);
      fileReader.onload = () => {
        formData.append('language', 'cht');
        formData.append('base64image', fileReader.result);
        fetch('/tools/recognize', {
          method: 'POST',
          body: formData
        }).then( response => response.json())
          .then( json => this.setState({result: json}))
          .catch(err => console.log(err));
      };
    }
    else {
      const text = this.state.text;
      if(text !== '') {
        fetch('/tools/librarySearch?search='+text)
          .then(res => {
            if(res.status === 200 ) res.json().then(json => this.setState({result: json}));
          })
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
          <span>Home</span>
        </button>
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
          <button onClick={() => this.ComponentDidMount()}><i className="material-icons">search</i>Search</button>
        </div>
      </div>
    );
    const uploadFiles = (
      <div className='uploadFiles'>
        <input type='file' onChange={this.fileSelectedHandler.bind(this)}/>
        <button onClick={() => this.ComponentDidMount()}>Upload</button>
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
        const pr = this.state.result.ParsedResults[0];
        result = pr.FileParseExitCode === 1 ? (
          <div id='parsedResult'>
            <h3>Parsed text:</h3>
            <span>{pr.ParsedText}</span>
          </div>
        ) : pr.ErrorMessage;
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
    const toolElement = (tool==='ocr' ? uploadFiles : searchBar);
    return (<div>{buttonBack}<br/>{toolElement}{result}</div>);
  }
}

Tools.propTypes = {
  navigate: PropTypes.func,
  routeParams: PropTypes.object
};

export default Tools;
