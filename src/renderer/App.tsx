import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

import { Home } from './templates/Home';
import './App.global.css';

export default function App() {
  const [token, setToken] = React.useState<string>();

  React.useEffect(() => {
    if (window.location.pathname === "/auth") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        window.electron.authenticate(code)
      }
    }

    window.electron.ipcRenderer.on('authenticated', (token) => {
      setToken(token);
    })
    window.electron.ipcRenderer.on('token', (token) => {
      setToken(token);
    })
    window.electron.ipcRenderer.on('logout', () => {
      setToken(undefined);
    })
    window.electron.getToken();
  }, []);

  const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

declare global {
  interface Window {
    electron: {
      login: () => void;
      logout: () => void;
      newFile: (name: string) => void;
      authenticate: (code: string) => void;
      getToken: () => string;
      getFileTree: () => Array<string>
      ipcRenderer: {
        on: (channel: string, callback: (...args: any[]) => void) => void;
      }
    };
  }
}
