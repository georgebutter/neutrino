import * as React from 'react';
import { GET_REPO } from 'graphql/queries';
import { client } from 'utils/graph';
import { Maybe } from 'utils/maybe';
import { GetRepoQuery } from 'types/github';
import { FileJson } from 'types';

export const Context = React.createContext<ContextState>({
  selectedFile: undefined,
  areaRef: undefined,
  setValue: undefined,
  value: undefined,
  selectFile: () => {
    console.error('selectFile not defined');
  },
  deleteFile: () => {
    console.error('deleteFile not defined');
  },
  token: undefined,
  login: undefined,
});

export const Provider: React.FC<Props> = ({ children }) => {
  const [login, setLogin] = React.useState<string>();
  const [repo, setRepo] = React.useState<string>();
  const [token, setToken] = React.useState<string>();
  const [error, setError] = React.useState<Maybe<string>>();
  const [value, setValue] = React.useState<Maybe<FileJson>>();
  const [selectedFile, setSelectedFile] = React.useState<string>();

  const selectFile = (name: string) => {
    window.electron.selectFile(name);
    setSelectedFile(name);
  };

  const deleteFile = () => {
    console.log(selectedFile);
    if (selectedFile) {
      window.electron.deleteFile(selectedFile);
    }
  };

  React.useEffect(() => {
    function handleFileSelect(json: FileJson) {
      console.log(json);
      setValue(json);
      document.getElementById('TextArea')?.focus();
    }

    function authenticated(token: string) {
      console.log('authenticated');
      console.log(token);
      localStorage.setItem('token', token);
      setToken(token);
    }

    function logout() {
      localStorage.removeItem('token');
      setLogin(undefined);
      setToken(undefined);
    }

    function error(err: string) {
      console.log(err);
      setError(err);
    }
    window.electron.ipcRenderer.on('selectFile', handleFileSelect);
    window.electron.ipcRenderer.on('authenticated', authenticated);
    window.electron.ipcRenderer.on('token', authenticated);
    window.electron.ipcRenderer.on('logout', logout);
    window.electron.ipcRenderer.on('error', error);

    window.electron.getToken();

    return function cleanup() {
      window.electron.ipcRenderer.off('selectFile', handleFileSelect);
      window.electron.ipcRenderer.off('authenticated', authenticated);
      window.electron.ipcRenderer.off('token', authenticated);
      window.electron.ipcRenderer.off('logout', logout);
      window.electron.ipcRenderer.off('error', error);
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      if (token) {
        try {
          const { data } = await client.query<GetRepoQuery>({
            query: GET_REPO,
          });
          setLogin(data.viewer.login);
        } catch (err) {
          const error = err as Error;
          if (error.message === 'Bad credentials') {
            localStorage.removeItem('token');
            setLogin(undefined);
            setToken(undefined);
          }
        }
      }
    })();
  }, [token]);

  return (
    <Context.Provider
      value={{
        value,
        setValue,
        selectFile,
        selectedFile,
        deleteFile,
        token,
        login,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type Props = {};

export type ContextState = {
  selectFile: (name: string) => void;
  deleteFile: () => void;
  selectedFile?: string;
  value: Maybe<FileJson>;
  setValue?: React.Dispatch<React.SetStateAction<Maybe<FileJson>>>;
  areaRef?: React.RefObject<HTMLTextAreaElement>;
  token: Maybe<string>;
  login: Maybe<string>;
};
