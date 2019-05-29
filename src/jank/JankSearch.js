import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { LEGAL_SETS, getWebData } from './Jank';

import './JankSearch.scss'

export class JankSearch extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    let checkboxes = [];
    LEGAL_SETS.forEach(set => {
      checkboxes.push(<Input type='checkbox' id={set}>{set}</Input>)
    })
    return (<div className='JankSearch'>
      <Form>
        <FormGroup>
          {checkboxes}
        </FormGroup>
      </Form>
    </div>)
  }
}
