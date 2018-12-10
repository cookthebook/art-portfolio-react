import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import "./ZineFinal.scss"
import ZineData from './zine_final_data.json'
import ZineArtistStatement from './zine_final_statement.json'

export class ZineFinal extends Component {
  constructor(props) {
    super(props);

    this.get_rows_from_data = this.get_rows_from_data.bind(this);
  }

  get_rows_from_data() {
    var rows = [];
    var get_texts = (texts) => {
      var text_arr = [];
      texts.forEach((text) => {
        text_arr.push(<ZineImgText style={text.style} text={text.text} key={text.key} />);
      });
      return text_arr;
    };


    ZineData.forEach((entry) => {
      rows.push(
        <Row className="ZineImgRow" key={entry.key}>
          {entry.image ?
            <img className="ZineImg" src={"/images/zine_resources/" + entry.image} alt={entry.name} /> :
            null
          }
          {get_texts(entry.texts)}
        </Row>
      )
    });
    return rows;
  }

  render() {
    return (
      <div className="ZineImgContainer container-fluid">
        {this.get_rows_from_data()}
        <Link to="/zinefinal/artiststatement/" className="StatementLink">Artist Statement</Link>
        <a href="https://github.com/cookthebook/art-portfolio-react/tree/zines_project" className="StatementLink"><br />View the source code at GitHub</a>
      </div>
    )
  }
}

const ZineImgText = (props) => {
  var { style, text } = props;
  return (
    <pre style={style}>{text}</pre>
  )
}

export const ZinePageStatement = (props) => {
  const texts = ZineArtistStatement.texts;
  var paragraphs = [];

  texts.forEach(text => {
    paragraphs.push(
      <p className="ArtistStatement">{text}</p>
    )
  })

  return (
    <div className="ArtistStatementPage container-fluid">
      {paragraphs}
      <Link to="/zinefinal/" className="ZineBackLink"><br />Back to final</Link>
    </div>
  )
}

// text example:
// "texts": [
//   {
//     "text": "This is an image",
//     "style": {
//       "left": "2%",
//       "bottom": "80%",
//       "font-size": "70px",
//       "position": "absolute"
//     },
//     "key": 0
//   },
//   {
//     "text": "This is another text",
//     "style": {
//       "left": "90%",
//       "bottom": "20%",
//       "font-size": "70px",
//       "writing-mode": "vertical-rl",
//       "position": "absolute"
//     },
//     "key": 1
//   }
// ],
