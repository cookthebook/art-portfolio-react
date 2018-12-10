import React from 'react';
import { Row } from 'reactstrap';

import "./ZineFinal.scss"
import ZineData from './zine_final_data.json'

export const ZineFinal = (props) => {
  var get_rows_from_data = () => {
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
  };

  return (
    <div className="ZineImgContainer container-fluid">
      {get_rows_from_data()}
    </div>
  )
}

const ZineImgText = (props) => {
  var { style, text } = props;
  return (
    <pre style={style}>{text}</pre>
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
