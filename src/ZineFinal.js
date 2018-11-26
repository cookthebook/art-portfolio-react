import React from 'react';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';

import "./ZineFinal.css"
import ZineData from './zine_final_data.json'

export const ZineFinal = (props) => {
  var get_rows_from_data = () => {
    var rows = [];
    var get_texts = (texts) => {
      var text_arr = [];
      texts.forEach((text) => {
        text_arr.push(<ZineImgText left={text.left} bottom={text.bottom} text={text.text} />);
      });
      return text_arr;
    };


    ZineData.forEach((image) => {
      rows.push(
        <Row className="ZineImgRow">
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
  const { left, bottom, text } = props;
  return (
    <p style={{ position: 'absolute', left: left + '%', bottom: bottom + '%' }}>{text}</p>
  )
}

ZineImgText.propTypes = {
  left: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
}
