import React from 'react';
import ReactDOM from 'react-dom';
import Elknow from './scripts/elknow';
import SignUp from './scripts/sign_up';
import Create from './scripts/create';
import Knowledge from './scripts/knowledge';
import Management from './scripts/management';
import UserInfo from './scripts/userInfo';
import Course from './scripts/course';

import { Route, BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';

ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={ Elknow } />
            <Route path="/sign_up" component={ SignUp } />            
            <Route path="/create" component={ Create } />
            <Route path="/knows/:id" component={ Knowledge } />
            <Route path="/users/:id" component={ UserInfo } />
            <Route path="/management/:module" component={ Management } />
            <Route path="/course" component={Course} />
        </div>
    </Router>
), document.getElementById('root'));
