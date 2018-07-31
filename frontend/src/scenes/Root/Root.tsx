import './root.scss';

import * as Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import * as React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { setAuthToken } from 'utils';

import { FrontEndUser, SetCurrentUser, AppState, LogoutUser, store, LeaveBattle } from 'store';

import { Landing } from 'scenes/Landing';

import { CaBattles } from 'scenes/Battles';

import { connect } from 'react-redux';

import { CaStatisticPage } from 'scenes/Statistic';

import { RootProps } from './Root.model';

import { CurrentBattle } from 'scenes/Battles';

import {
  CaButton,
  CaLogo,
  CaNavbar,
  LoginForm,
  RegistrationForm
} from 'components';

import { AuthStatus } from 'models';
import { PageNotFound } from '../PageNotFound';
import { translate } from 'react-i18next';

const token = Cookies.get('jwtToken');
if (token) {
  setAuthToken(token);
  const decoded: FrontEndUser = jwt_decode(token);
  store.dispatch(new SetCurrentUser(decoded));
}

export const RootComponent = translate('translations')(
  class extends React.Component<RootProps> {

    public logoutUser(): void {
      this.props.logoutUser();
      this.props.history.push('/');

      const userInBattle = !!this.props.battleName;

      if (userInBattle) {
        this.props.leaveBattle(this.props.battleName);
      }

    }

    public redToLogin(): void {
      this.props.logoutUser();
      this.props.history.push('/login');
    }

    public getButton(authStatus: number): JSX.Element {
      const isAuthorized = authStatus === AuthStatus.AUTHORIZED;
      return (
        isAuthorized ?
          <CaButton
            onClick={() => this.logoutUser()}
          >
            Logout
        </CaButton>
          :
          <CaButton
            onClick={() => this.redToLogin()}
          >
            Login
        </CaButton>
      );
    }

    public getNavbar(authStatus: number): JSX.Element {
      const isAuthorized = authStatus === AuthStatus.AUTHORIZED;

      const { t, i18n } = this.props;

      return (
        <CaNavbar
          linksToRender={[
            {
              text: 'Battles',
              to: '/battles',
              activeClassName: 'ca-navbar__nav-item--active',
              disabled: !isAuthorized
            },
            {
              text: 'Statistics',
              to: '/statistics',
              activeClassName: 'ca-navbar__nav-item--active',
              disabled: !isAuthorized
            }
          ]}
        >
          <CaLogo
            text='battlenet'
          />

          <p>{t('text')}</p>

          <button onClick={() => i18n.changeLanguage('en')} >{t('ENtoggle')}</button>
          <button onClick={() => i18n.changeLanguage('ru')} >{t('RUtoggle')}</button>

          <div className='ca-navbar__logout-btn-container'>
            {this.getButton(this.props.status)}
          </div>

        </CaNavbar>
      );
    }

    public render(): JSX.Element {
      return (
        <Router>
          <div className='App'>
            <Switch>
              <Route
                exact={true}
                path='/'
                render={props =>
                  <Landing {...props} >
                    {this.getNavbar(this.props.status)}
                  </Landing>
                }
              />

              <Route
                exact={true}
                path='/register'
                render={props =>
                  <RegistrationForm {...props} >
                    {this.getNavbar(this.props.status)}
                  </RegistrationForm>
                }
              />

              <Route
                exact={true}
                path='/login'
                render={props =>
                  <LoginForm {...props} >
                    {this.getNavbar(this.props.status)}
                  </LoginForm>
                }
              />
              <Route
                exact={true}
                path='/homepage'
                render={props => <Redirect to='/battles' />}
              />

              <Route
                exact={true}
                path='/statistics'
                render={props =>
                  <CaStatisticPage {...props}>
                    {this.getNavbar(this.props.status)}
                  </CaStatisticPage>
                }
              />

              <Route
                exact={true}
                path='/battles'
                render={
                  props =>
                    <CaBattles {...props}>
                      {this.getNavbar(this.props.status)}
                    </CaBattles>
                }
              />

              <Route
                exact={true}
                path='/battles/:id'
                render={props =>
                  <CurrentBattle {...props}>
                    {this.getNavbar(this.props.status)}
                  </CurrentBattle>
                }
              />

              <Route
                path='/*'
                render={() =>
                  <PageNotFound>
                    {this.getNavbar(this.props.status)}
                  </PageNotFound>
                }
              />
            </Switch>
          </div>
        </Router>
      );
    }
  });

const mapStateToProps = (state: AppState) => ({
  status: state.auth.status,
  battleName: state.battle.battleName
});

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => dispatch(new LogoutUser()),
  leaveBattle: (battleName: string) => dispatch(new LeaveBattle(battleName))
});

export const Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootComponent);
