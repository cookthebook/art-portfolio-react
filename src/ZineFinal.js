import React from 'react';
import { Container, Row } from 'reactstrap';

import "./ZineFinal.css"

export const ZineFinal = (props) => {
  Container.propTypes = {
    fluid: true
  }

  return (
    <div className="ZineImgContainer container-fluid">
      <Row className="ZineImgRow">
        <img class="ZineImg" src="/images/zine_resources/1.jpg" alt="First" />
      </Row>
    </div>
  )
}
