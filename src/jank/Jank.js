import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './Jank.scss'

const LEGAL_SETS = ['WAR', 'RNA', 'GRN', 'DOM', 'RIX', 'XLN', 'HOU', 'AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ', 'DTK', 'FRF', 'KTK', 'JOU', 'BNG', 'THS', 'DGM', 'GTC', 'RTR', 'M19', 'ORI', 'M15', 'M14'];

const DREADED_CARDS = ['ramunap ruins', 'rogue refiner', 'felidar guardian', 'smuggler\'s copter', 'attune with aether', 'aetherworks marvel', 'reflector mage', 'emrakul, the promised end', 'treasure cruise', 'dig through time', 'deathrite shaman', 'collected company'];

const BASIC_LANDS = ['plains', 'forest', 'island', 'swamp', 'mountain'];
const INFINITE_CARDS = ['persistent petitioners', 'rat colony', 'plains', 'snow-covered plains', 'forest', 'snow-covered forest', 'island', 'snow-covered island', 'swamp', 'snow-covered swamp', 'mountain', 'snow-covered mountain', 'wastes'];

function cleanCardName(name) {
  let exactName = name.toLowerCase()
    .trim()
    // This is NOT a space, its a fixed width space!!!
    // Trouble from Tapped Out HTML
    .replace(/ /g, ' ');
  return exactName;
}

function getWebData(query) {
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();

    if (!query.includes('api.scryfall.com')) {
      query = 'https://cors-anywhere.herokuapp.com/' + query;
      console.log('Reformatting to work around CORS ' + query);
    }

    req.open('GET', query, true);

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
    req.send(null);
  });
}



function powerSet(array, maxLength) {
  var result = [[]];

  for (var i = 0; i < array.length; i++) {
    //this line is crucial! It prevents us from infinite loop
    var len = result.length;
    if (len > maxLength) len = maxLength;
    for (var x = 0; x < len; x++) {
      result.push(result[x].concat(array[i]))
    }
  }

  return result;
}



function validSubset(deck, setList) {
  if (setList.length > 6) return false;

  let cardList = deck.mainboard.concat(deck.sideboard);

  var valid = true;
  cardList.forEach(card => {
    var validCard = false;
    card.sets.forEach(set => {
      if (setList.includes(set)) {
        validCard = true;
      }
    })
    if (!validCard) {
      valid = false;
    }
  });

  return valid;
}



function checkSetPermutations(deck, necessarySets, possibleSets) {
  const extraSets = powerSet(possibleSets, 6 - necessarySets.length);
  var ret = [];
  extraSets.forEach(permutation => {
    if (ret.length === 0 && validSubset(deck, necessarySets.concat(permutation))) {
      ret = necessarySets.concat(permutation);
    }
  });

  return ret;
}



function checkSetCount(deck) {
  const cardList = deck.mainboard.concat(deck.sideboard);
  var necessarySets = [];
  var possibleSets = [];
  var resultSets = [];

  // Find necessary sets
  cardList.forEach(card => {
    if (card.sets.length === 1 && !necessarySets.includes(card.sets[0])) {
      necessarySets.push(card.sets[0]);
    }
  });

  cardList.forEach(card => {
    if (card.sets.length > 1 && !BASIC_LANDS.includes(card.name)) {
      var inNecessarySet = false;
      card.sets.forEach(set => {
        if (necessarySets.includes(set)) {
          inNecessarySet = true;
        }
      });

      if (!inNecessarySet) {
        card.sets.forEach(set => {
          if (!possibleSets.includes(set)) {
            possibleSets.push(set);
          }
        });
      }
    }
  });

  if (necessarySets.length > 6) {
    var html = '';
    necessarySets.forEach(set => {
      html += set + ' ';
    });
    return [<div><p>Greater than 6 sets necessary: {'{'}{html.trim()}{'}'}</p></div>, false];
  } else if (necessarySets.length === 0) {
    necessarySets.push(LEGAL_SETS[0]);
  }

  console.log(necessarySets);
  console.log(possibleSets);

  if (validSubset(deck, necessarySets)) {
    resultSets = necessarySets;
  } else {
    resultSets = checkSetPermutations(deck, necessarySets, possibleSets);
    if (resultSets.length === 0) {
      var html1 = '';
      necessarySets.forEach(set => {
        html1 += set + ' ';
      });
      var html2 = '';
      possibleSets.forEach(set => {
        html2 += set + ' ';
      });
      return [
        <div>
          <p>too many sets needed</p>
          <p>required sets: {'{'}{html1.trim()}{'}'}</p>
          <p>possible sets from cards not in required sets: {'{'}{html2.trim()}{'}'}</p>
        </div>,
        false
      ];
    }
  }

  var formatedHTML = '';
  resultSets.forEach(set => {
    formatedHTML += set + ' ';
  });
  return [<div><p>using sets: {'{'}{formatedHTML.trim()}{'}'}</p></div>, true];
}



function checkDeckLegality(deck) {
  const goodDeckImg = <img src={process.env.PUBLIC_URL + '/images/jankmtg/good_deck.png'} alt='good_deck' className='ResultImage' />;
  const badDeckImg = <img src={process.env.PUBLIC_URL + '/images/jankmtg/bad_deck.png'} alt='bad_deck' className='ResultImage' />;
  var deckSize = deck.getSize();
  var deckPoints = 0;
  var maxPoints = 22;
  var ret = null;

  // Basic decksize check and point check
  console.log('Checking mainboard');
  deck.mainboard.forEach(card => {
    if (card.cost < 0) {
      ret = (<p>NOT LEGAL: card {card.name} not found.</p>);
    }

    deckPoints = deckPoints + (card.count * card.cost);
  });

  if (ret) {
    return ret;
  }

  var xOfCount = 0;

  if (deckSize < 40) {
    return (
      <div>
        <p>NOT LEGAL: fewer than 40 cards</p>
        {badDeckImg}
      </div>
    );
  } else if (deckSize >= 40 && deckSize < 50) {
    maxPoints = 22;
    if (deckPoints > 22) {
      return (
        <div>
          <p>NOT LEGAL: too many card points used ({deckPoints}) for a less than 50 card deck (max 22)</p>
          {badDeckImg}
        </div>
      );
    }
    xOfCount = 1;
  } else if (deckSize >= 50 && deckSize < 60) {
    maxPoints = 25;
    if (deckPoints > 25) {
      return (
        <div>
          <p>NOT LEGAL: too many card points used ({deckPoints}) for a less than 60 card deck (max 25)</p>
          {badDeckImg}
        </div>
      );
    }
    xOfCount = 2;
  } else if (deckSize >= 60 && deckSize < 70) {
    maxPoints = 28;
    if (deckPoints > 28) {
      return (
        <div>
          <p>NOT LEGAL: too many card points used ({deckPoints}) for a less than 70 card deck (max 28)</p>
          {badDeckImg}
        </div>
      );
    }
    xOfCount = 3;
  } else if (deckSize >= 70) {
    maxPoints = 31;
    if (deckPoints > 31) {
      return (
        <div>
          <p>NOT LEGAL: too many card points used ({deckPoints}) for a 70 or greater card deck (max 31)</p>
          {badDeckImg}
        </div>
      );
    }
    xOfCount = 4;
  }

  console.log('Can have ' + xOfCount.toString() + '-of\'s');

  deck.mainboard.forEach(card => {
    if (!(INFINITE_CARDS.includes(card.name)) && card.count > xOfCount) {
      ret = (
        <div>
          <p>NOT LEGAL: cannot have {card.count} {card.name}</p>
          {badDeckImg}
        </div>
      );
    }
  });

  if (ret) {
    return ret;
  }

  // Check sideboard
  console.log('Checking sideboard');
  var sideboardCount = deck.getSideboardSize();
  deck.sideboard.forEach(card => {
    deck.mainboard.forEach(mainCard => {
      if (!(INFINITE_CARDS.includes(card.name)) && mainCard.name === card.name && mainCard.count + card.count > xOfCount) {
        ret = (
          <div>
            <p>NOT LEGAL: cannot have {mainCard.count + card.count} {card.name} (sideboard)</p>
            {badDeckImg}
          </div>
        );
      }
    });

    if (!(INFINITE_CARDS.includes(card.name)) && card.count > xOfCount) {
      ret = (<p>NOT LEGAL: cannot have {card.count} {card.name} (sideboard)</p>)
    }
  });

  if (ret) {
    return ret;
  }

  if (deckSize < 40) {
    return (<p>NOT LEGAL: fewer than 40 cards</p>);
  } else if (deckSize >= 40 && deckSize < 50 && sideboardCount > 8) {
    return (<p>NOT LEGAL: too many sidebard cards ({sideboardCount}) for a less than 50 card deck (max 8)</p>);
  } else if (deckSize >= 50 && deckSize < 60 && sideboardCount > 10) {
    return (<p>NOT LEGAL: too many sidebard cards ({sideboardCount}) for a less than 60 card deck (max 10)</p>);
  } else if (deckSize >= 60 && deckSize < 70 && sideboardCount > 12) {
    return (<p>NOT LEGAL: too many sidebard cards ({sideboardCount}) for a less than 70 card deck (max 12)</p>);
  } else if (deckSize >= 70 && sideboardCount > 14) {
    return (<p>NOT LEGAL: too many sidebard cards ({sideboardCount}) for a greater than 70 card deck (max 14)</p>);
  }

  if (ret) {
    return ret;
  }

  const setCheck = checkSetCount(deck);
  if (!setCheck[1]) {
    return (
      <div>
        <p>DECK NOT LEGAL</p>
        {setCheck[0]}
        {badDeckImg}
      </div>
    );
  }
  return (
    <div>
      <p>DECK LEGAL</p>
      <p>using {deckPoints} of {maxPoints} points ({deckSize} card deck)</p>
      {setCheck[0]}
      {goodDeckImg}
    </div>
  );
}



class MTGCard {
  constructor(exactName, count, sideboard = false) {
    this.name = cleanCardName(exactName);
    this.sideboard = sideboard;
    this.count = count;
    this.sets = [];
    this.cost = null;
    this.imageLink = '';

    this.getInfo = this.getInfo.bind(this);
    this.toJSX = this.toJSX.bind(this);
  }

  getInfo(callback) {
    // Form Scryfall API query
    let query = 'https://api.scryfall.com/cards/search?order=released&unique=prints&q=';
    query += '!"' + this.name + '"';
    query += '+(';
    LEGAL_SETS.forEach(set => {
      query += 'set%3A' + set + '+OR+'
    });
    query += ')';

    console.log('Searching for ' + this.name);
    console.log(query);

    let cardJSON = null;

    getWebData(query).then(value => {
      cardJSON = JSON.parse(value);
      if (cardJSON === undefined || cardJSON['data'] === undefined) {
        console.log('No data found for card: ' + this.name);
        callback(this);
        return;
      }

      if (DREADED_CARDS.includes(this.name)) {
        this.cost = 4;
      }

      cardJSON.data.forEach(cardObject => {
        cardObject.name = cleanCardName(cardObject.name);
        if (cardObject.name === this.name) {
          this.sets.push(cardObject.set.toUpperCase());

          // Use newest printing rarity
          if (this.cost === null) {
            switch (cardObject.rarity) {
              case 'mythic':
                this.cost = 3;
                break;
              case 'rare':
                this.cost = 2;
                break;
              case 'uncommon':
                this.cost = 1;
                break;
              case 'common':
                this.cost = 0;
                break;
              default:
                break;
            }
          }

          if (this.imageLink === '') {
            if (cardObject.image_uris) {
              this.imageLink = cardObject.image_uris.large;
            } else {
              // Double sided card
              this.imageLink = cardObject.card_faces[0].image_uris.large + ',' + cardObject.card_faces[1].image_uris.large
            }
          }
        }
      });
      console.log('Finished processing card: ' + this.name);
      callback(this);
    }).catch(err => {
      console.log('ERROR PROCESSING CARD');
      console.log(err);
    });
  }

  toJSX() {
    return (<div>
      {this.imageLink.includes(',') ?
        <p>{this.count} x <a href={this.imageLink.split(',')[0]}>{this.name.split('//')[0]}</a> {'//'} <a href={this.imageLink.split(',')[1]}>{this.name.split('//')[1]}</a> ({this.cost}pts)</p> :
        <p>{this.count} x <a href={this.imageLink}>{this.name}</a> ({this.cost}pts)</p>
      }
    </div>);
  }
}

class MTGDeck {
  constructor() {
    this.mainboard = [];
    this.sideboard = [];
    this.updateCallback = null;
    this.processedCount = 0;

    this.addCard = this.addCard.bind(this);
    this.getSize = this.getSize.bind(this);
    this.getSideboardSize = this.getSideboardSize.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.toJSX = this.toJSX.bind(this);
  }

  addCard(exactName, count, sideboard = false) {
    let tempCard = new MTGCard(exactName, count, sideboard);
    if (sideboard) {
      this.sideboard.push(tempCard);
    } else {
      this.mainboard.push(tempCard);
    }
  }

  getSize() {
    let size = 0;
    this.mainboard.forEach(card => {
      size += card.count;
    });
    return size;
  }

  getSideboardSize() {
    let size = 0;
    this.sideboard.forEach(card => {
      size += card.count;
    });
    return size;
  }

  onUpdate(card) {
    this.processedCount = this.processedCount + card.count;
    console.log('Processed ' + this.processedCount + ' cards');
    this.updateCallback(
      this,
      this.processedCount === (this.getSize() + this.getSideboardSize())
    );
  }

  getInfo(callback) {
    // Reprocess deck
    this.processedCount = 0;
    this.updateCallback = callback;
    console.log('Getting card info for deck');
    this.mainboard.forEach(card => {
      card.getInfo(this.onUpdate);
    });
    this.sideboard.forEach(card => {
      card.getInfo(this.onUpdate);
    });
  }

  toJSX() {
    let mainJSX = [];
    let sideJSX = [];

    this.mainboard.forEach(card => {
      mainJSX.push(card.toJSX());
    });
    this.sideboard.forEach(card => {
      sideJSX.push(card.toJSX());
    });

    return (<div>
      <p>mainboard</p>
      {mainJSX}
      <p>sideboard</p>
      {sideJSX}
    </div>);
  }
}

export class Jank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      deckHTML: (<div></div>),
      legalResult: (<div></div>)
    };

    this.updateLegalityHTML = this.updateLegalityHTML.bind(this);
    this.updateDeckHTML = this.updateDeckHTML.bind(this);
    this.processDeck = this.processDeck.bind(this);
    this.processLink = this.processLink.bind(this);
    this.processTappedOut = this.processTappedOut.bind(this);
    this.processGoldfish = this.processGoldfish.bind(this);
  }

  updateLegalityHTML(deck) {
    this.setState({
      legalResult: checkDeckLegality(deck)
    });
  }

  updateDeckHTML(deck, checkLegality = false) {
    console.log('Updating deck to:');
    console.log(deck);
    this.setState({
      deck: deck,
      deckHTML: deck.toJSX()
    });
    if (checkLegality) {
      this.updateLegalityHTML(deck);
    }
  }

  processDeck() {
    // Reset deck information on process
    this.setState({
      deck: null,
      deckHTML: (<div></div>),
      legalResult: (<div></div>)
    });

    let unprocessedDeck = new MTGDeck();

    let deckText = document.getElementById('deckList').value;
    let sideboardText = document.getElementById('sideboard').value;
    console.log('Deck list:');
    console.log(deckText);
    console.log(sideboardText);

    deckText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0]);
      let card = cardText.split(' ').slice(1).join(' ');
      if (count && card) unprocessedDeck.addCard(card, count);
    });

    sideboardText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0]);
      let card = cardText.split(' ').slice(1).join(' ');
      if (count && card) unprocessedDeck.addCard(card, count, true);
    });

    console.log('Found deck of size: ' + (unprocessedDeck.getSize() + unprocessedDeck.getSideboardSize()));
    console.log(unprocessedDeck);
    unprocessedDeck.getInfo(this.updateDeckHTML);
  }

  processLink() {
    this.setState({
      deck: null,
      deckHTML: (<div></div>),
      legalResult: (<div></div>)
    });
    const query = document.getElementById('deckLink').value;
    console.log(query);
    getWebData(query).then(value => {
      if (query.includes('tappedout.net')) {
        this.processTappedOut(value);
      } else if (query.includes('mtggoldfish.com')) {
        this.processGoldfish(value);
      }
    }).catch(err => {
      console.log('ERROR PROCESSING LINK');
      console.log(err);
    });
  }

  processTappedOut(value) {
    var toHtml = document.createElement('html');
    toHtml.innerHTML = value;
    let htmlCards = toHtml.getElementsByClassName('member');
    console.log(htmlCards);
    let unprocessedDeck = new MTGDeck();

    var i;
    for (i = 0; i < htmlCards.length; i++) {
      const count = parseInt(htmlCards[i].innerText.trim().split('x')[0]);
      const name = htmlCards[i].innerText.trim().split('x').slice(1).join('x');
      if (htmlCards[i].id.includes('boardContainer-main') && htmlCards[i].children.length === 1) {
        unprocessedDeck.addCard(name, count, false);
      } else if (htmlCards[i].id.includes('boardContainer-side') && htmlCards[i].children.length === 1) {
        unprocessedDeck.addCard(name, count, true);
      }
    }

    console.log('Processed deck of size: ' + (unprocessedDeck.getSize() + unprocessedDeck.getSideboardSize()));
    console.log(unprocessedDeck);
    unprocessedDeck.getInfo(this.updateDeckHTML);
  }

  processGoldfish(value) {
    var toHtml = document.createElement('html');
    toHtml.innerHTML = value;
    let table = toHtml.getElementsByClassName('deck-view-deck-table')[0].children[0];

    var unprocessedDeck = new MTGDeck();

    var i;
    var inSideboard = false;
    for(i = 0; i < table.children.length; i++) {
      const child = table.children[i];
      if (child.children.length > 1) {
        const count = parseInt(child.getElementsByClassName('deck-col-qty')[0].innerText);
        const name = child.getElementsByClassName('deck-col-card')[0].children[0].innerText;
        unprocessedDeck.addCard(name, count, inSideboard);
      } else if(child.children.length === 1 && child.children[0].innerText.includes('Sideboard')) {
        inSideboard = true;
      }
    }

    unprocessedDeck.getInfo(this.updateDeckHTML);
  }

  render() {
    return (
      <div className='Jank'>
        <h1 style={{ padding: '1em' }}>JANK DECK CHECKER</h1>
        <Form className='JankCardFinder container'>
          <FormGroup>
            <Label for='deckLink'>mtg goldfish or tapped out link</Label>
            <Input type='url' id='deckLink' placeholder='deck link' />
          </FormGroup>
          <Button onClick={this.processLink}>Import!</Button>
          <FormGroup>
            <Label for='deckList'><br />or manually<br />submit main board</Label>
            <Input type='textarea' id='deckList' placeholder='<card count> <card name>' />
            <Label for='sideboard'>submit sideboard</Label>
            <Input type='textarea' id='sideboard' placeholder='<card count> <card name>' />
          </FormGroup>
          <Button onClick={this.processDeck}>Find!</Button>
          <br />
          <br />
          {this.state.legalResult}
          <br />
          {this.state.deckHTML}
        </Form>
      </div>
    )
  }
}
