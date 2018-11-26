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


    ZineData.forEach((image) => {
      rows.push(
        <Row className="ZineImgRow" key={image.key}>
          <img className="ZineImg" src={"/images/zine_resources/" + image.image} alt={image.name} />
          {get_texts(image.texts)}
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
  if (!style.position) {
    style["position"] = "absolute";
  }
  return (
    <p style={style}>{text}</p>
  )
}
