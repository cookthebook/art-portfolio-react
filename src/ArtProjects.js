import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { ZineFinal, ZinePageStatement } from './ZineFinal';


import './ArtProjects.scss';

export class ArtProjects extends Component {
  render() {
    var projects = [
      <ProjectLink link='/zinefinal/' name='Voluntary Necessity (2018)' description='Web comic for the Fall 2018 class Zines, Comics, and Books Final' />,
      <ProjectLink link='/artprojects/' name='Epic OC (2018)' description='Animated web comic for the Spring 2018 class Intro Digital Drawing' />
    ]

    return (
      // <BrowserRouter>
      <div className="ArtProjectsIndex">
        <h1 className='ArtProjectsTitle'>Art Projects</h1>
        {projects}
      </div>
      // </BrowserRouter>
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

export const ArtProjectRoutes = () => {
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

  return (
    <div>
      <Route exact path={"/zinefinal/"} component={ZinePage} className="ViewSwitcher" />
      <Route exact path={"/zinefinal/artiststatement/"} component={ZineStatement} className="ViewSwitcher" />
    </div>
  )
}
