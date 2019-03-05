import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './Jank.scss'

const LEGAL_SETS = ['RNA', 'GRN', 'DOM', 'RIX', 'XLN', 'HOU', 'AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ', 'DTK', 'FRF', 'KTK', 'JOU', 'BNG', 'THS', 'DGM', 'GTC', 'RTR', 'M19', 'ORI', 'M15', 'M14']

const DREADED_CARDS = ['ramunap ruins', 'rogue refiner', 'felidar guardian', 'smuggler\'s copter', 'attune with aether', 'aetherworks marvel', 'reflector mage', 'emrakul, the promised end', 'treasure cruise', 'dig through time', 'deathrite shaman', 'collected company']

function cleanCardName(name) {
  let exactName = name.toLowerCase().trim();
  return exactName;
}

function getScryfallData(query) {
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', query);

    req.onload = function () {
      if (req.status === 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function () {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

const INFINITE_CARDS = ['persistent petitioners', 'rat colony', 'plains', 'forest', 'island', 'swamp', 'mountian', 'wastes'];

function checkDeckLegality(cardList) {
  var deckSize = 0;
  var deckPoints = 0;
  var ret = null;

  // Basic decksize check and point check
  cardList.forEach(card => {
    console.log('Checking card: ' + card.name);

    if (card.pointCost < 0) {
      ret = (<p>NOT LEGAL: Card {card.name} not found.</p>);
    }
  
    deckSize = deckSize + card.count;
    deckPoints = deckPoints + (card.count * card.pointCost);
  });

  if (ret) {
    return ret;
  }

  var xOfCount = 0;

  if (deckSize < 40) {
    return (<p>NOT LEGAL: Fewer than 40 cards</p>);
  } else if (deckSize >= 40 && deckSize < 50 ) {
    if (deckPoints > 22) {
      return (<p>NOT LEGAL: Too many card points used ({deckPoints}) for a less than 50 card deck (max 22)</p>);
    }
    xOfCount = 1;
  } else if (deckSize >= 50 && deckSize < 60) {
    if (deckPoints > 25) {
      return (<p>NOT LEGAL: Too many card points used ({deckPoints}) for a less than 60 card deck (max 25)</p>);
    }
    xOfCount = 2;
  } else if (deckSize >= 60 && deckSize < 70) {
    if (deckPoints > 28) {
      return (<p>NOT LEGAL: Too many card points used ({deckPoints}) for a less than 70 card deck (max 28)</p>);
    }
    xOfCount = 3;
  } else if (deckSize >= 70) {
    if (deckPoints > 31) {
      return (<p>NOT LEGAL: Too many card points used ({deckPoints}) for a 70 or greater card deck (max 31)</p>);
    }
    xOfCount = 4;
  }

  console.log('Can have ' + xOfCount.toString() + '-of\'s');

  cardList.forEach(card => {
    console.log('Checking count for ' + card.name);
    console.log('Count: ' + card.count.toString());
    if (!(INFINITE_CARDS.includes(card.name)) && card.count > xOfCount) {
      ret = (<p>NOT LEGAL: Cannot have {card.count} {card.name}</p>);
    }
  });

  if (ret) {
    return ret;
  }

  return (<p>DECK LEGAL</p>);
}

export class Jank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      cardsHTML: [],
      deckSize: -1,
      processedSize: 0,
      legalResult: (<div></div>)
    };

    this.processDeck = this.processDeck.bind(this);
    this.getCardInfo = this.getCardInfo.bind(this);
    this.updateResultList = this.updateResultList.bind(this);
  }

  updateResultList(card) {
    console.log('Adding card: ' + card.name);
    var oldCards = this.state.cards;
    var oldCardsHTML = this.state.cardsHTML;
    const oldProcessedSize = this.state.processedSize;
  
    this.setState({
      cards: oldCards.concat(card),
      cardsHTML: oldCardsHTML.concat(<MTGCard name={card.name} count={card.count} link={card.imageLink} />),
      processedSize: oldProcessedSize + card.count
    });

    console.log('Checking if done with processing');
    if (this.state.processedSize >= this.state.deckSize) {
      console.log('Final processed deck:');
      console.log(this.state.cards);
      this.setState({
        legalResult: checkDeckLegality(this.state.cards)
      });
    } else {
      console.log('Processed ' + this.state.processedSize.toString() + ' cards');
    }
  }

  getCardInfo(exactName, count) {
    // Form Scryfall API query
    let query = 'https://api.scryfall.com/cards/search?order=released&unique=prints&q=';
    query += '!"' + exactName + '"';
    query += '+(';
    LEGAL_SETS.forEach(set => {
      query += 'set%3A' + set + '+OR+'
    });
    query += ')';

    let cardJSON = null;

    getScryfallData(query).then(value => {
      cardJSON = JSON.parse(value);
      if (cardJSON === undefined || cardJSON['data'] === undefined) {
        console.log('No data found for card: ' + exactName);
        this.updateResultList({
          name: exactName,
          sets: [],
          count: count,
          pointCost: -1,
          imageLink: ''
        });
        return null;
      }

      exactName = cleanCardName(exactName);
      var newCard = {
        name: exactName,
        sets: [],
        count: count,
        pointCost: -1,
        imageLink: ''
      };

      if (DREADED_CARDS.includes(exactName)) {
        newCard.pointCost = 4;
      }

      cardJSON.data.forEach(cardObject => {
        cardObject.name = cleanCardName(cardObject.name);
        if (cardObject.name === newCard.name) {
          newCard.sets.push(cardObject.set.toUpperCase());

          // Use newest printing rarity
          if (newCard.pointCost === -1) {
            switch (cardObject.rarity) {
              case 'mythic':
                newCard.pointCost = 3;
                break;
              case 'rare':
                newCard.pointCost = 2;
                break;
              case 'uncommon':
                newCard.pointCost = 1;
                break;
              case 'common':
                newCard.pointCost = 0;
                break;
              default:
                break;
            }
          }

          if (newCard.imageLink === '') {
            newCard.imageLink = cardObject.image_uris.large;
          }
        }
      });
      console.log('Finished processing card: ' + newCard.name);
      this.updateResultList(newCard);
    }).catch(err => {
      this.updateResultList({
        name: exactName,
        sets: [],
        count: count,
        pointCost: -1,
        imageLink: ''
      });
      return null;
    });
  }

  processDeck() {
    if (this.state.cards.length > 0) {
      this.setState({
        cards: [],
        cardsHTML: [],
        legalResult: (<div></div>)
      });
    }
    let deckText = document.getElementById('deckList').value
    console.log('Deck list:')
    console.log(deckText)
    var totalDeckSize = 0;

    deckText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0])
      let card = cardText.split(' ').slice(1).join(' ')

      if (count && card) {
        totalDeckSize = totalDeckSize + count;
      }
    });
    console.log('Found deck of size: ' + totalDeckSize.toString());
    this.setState({
      deckSize: totalDeckSize
    });

    deckText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0])
      let card = cardText.split(' ').slice(1).join(' ')

      if (count && card) {
        this.getCardInfo(card, count);
      }
    });
  }

  render() {
    return (
      <div className='Jank'>
        <Form className='JankCardFinder container'>
          <FormGroup>
            <Label for='deckList'>Submit Decklist</Label>
            <Input type='textarea' id='deckList' placeholder='Enter card name' />
          </FormGroup>
          <Button onClick={this.processDeck}>Find!</Button>
          <br />
          <br />
          {this.state.cardsHTML}
          {this.state.legalResult}
        </Form>
      </div>
    )
  }
}

class MTGCard extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.count = props.count;
    this.link = props.link;
  }

  render() {
    return (<div>
      <p>{this.count} x <a href={this.link}>{this.name}</a></p>
    </div>);
  }
}
