import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';
import { ZineFinal, ZinePageStatement } from './ZineFinal';


import './ArtProjects.scss';

export class ArtProjects extends Component {

  render() {
    const ZinePage = () => {
      return (
        <div>
          <ZineFinal />
        </div>
      )
    }

    const ZineStatement = () => {
      return (
        <div>
          <ZinePageStatement />
        </div>
      )
    }

    var projects = [
      <ProjectLink link='/zinefinal/' name='Voluntary Necessity (2018)' description='Web comic for the Fall 2018 class Zines, Comics, and Books Final' />,
      <ProjectLink link='/artprojects/' name='Epic OC (2018)' description='Animated web comic for the Spring 2018 class Intro Digital Drawing' />
    ]

    return (
      <BrowserRouter>
        <div className="ArtProjectsIndex">
          <Switch>
            <Route exact path="/zinefinal/" component={ZinePage} className="ViewSwitcher" />
            <Route exact path="/zinefinal/artiststatement/" component={ZineStatement} className="ViewSwitcher" />
          </Switch>
          <h1 className='ArtProjectsTitle'>Art Projects</h1>
            {projects}
        </div>
      </BrowserRouter>
    );
  }
}

const ProjectLink = (props) => {
  return (
    <div className='ProjectLinkContainer'>
      <Link to={props.link} className='ProjectLink'>{props.name}</Link>
      <p className='ProjectDescription'>{props.description}</p>
    </div>
  )
}
