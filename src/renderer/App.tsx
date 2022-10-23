import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { Home } from './templates/Home';
import './App.css';
import { Provider } from './components/Provider';
import { client } from 'utils/graph';

// TODO: implement theme changing
// const applyLight = () => {
//   const { style } = document.documentElement;
//   // style.setProperty("--primary", "#6979f8");
//   // style.setProperty("--primary-faded", "#A5AFFB");
//   // style.setProperty("--success", "#00C48C");
//   // style.setProperty("--warning", "#ffa26b");
//   // style.setProperty("--error", "#FF647C");
//   style.setProperty('--bg', '#fff');
//   style.setProperty('--text', '#202124');
//   style.setProperty('--faded', '#F7F5F9');
//   style.setProperty('--fg', '#35363a');
// };
// const applyDark = () => {
//   const { style } = document.documentElement;
//   // style.setProperty("--primary", "#6979f8");
//   // style.setProperty("--primary-faded", "#A5AFFB");
//   // style.setProperty("--success", "#00C48C");
//   // style.setProperty("--warning", "#ffa26b");
//   // style.setProperty("--error", "#FF647C");
//   style.setProperty('--bg', '#202124');
//   style.setProperty('--text', '#ffffff');
//   style.setProperty('--faded', '#35363a');
//   style.setProperty('--fg', '#ffffff');
// };
//   const prefersColourScheme = matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
//   const prefersDark = Store.get("prefersDark");
//   const [dark, setDark] = React.useState<boolean>(prefersDark || prefersColourScheme);
//   const [popup, setPopup] = React.useState<IPopup>(null);
//   const [menuActive, setMenuActive] = React.useState<boolean>(false);

//   const changeDarkMode = (change?: "dark" | "light") => {
//     setDark((prev) => {
//       const next = change === "dark" ? true : change === "light" ? false : !prev;
//       if (next) {
//         applyDark();
//       } else {
//         applyLight();
//       }
//       Store.set("prefersDark", next);
//       return next;
//     });
//   };

//   React.useEffect(() => {
//     if (typeof window.matchMedia("(prefers-color-scheme: dark)").addEventListener === "function") {
//       window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
//         const change = e.matches ? "dark" : "light";
//         if (!Store.get("prefersDark")) {
//           changeDarkMode(change);
//         }
//       });
//     }
//     if (prefersDark !== prefersColourScheme && matchMedia) {
//       changeDarkMode(prefersDark ? "dark" : "light");
//     }
//   }, []);


export default function App() {
  return (
    <Provider>
      <ApolloProvider client={client}>
        <Home />
      </ApolloProvider>
    </Provider>
  );
}


declare global {
  interface Window {
    electron: {
      error: () => void;
      login: () => void;
      logout: () => void;
      newFile: (name: string) => void;
      renameFile: (id: string, oldTitle: string, newTitle: string) => void;
      renamedFile: (id: string) => void;
      selectFile: (name: string) => void;
      deleteFile: (name: string) => void;
      // authenticate: (code: string) => void;
      getToken: () => string;
      getFileTree: () => Array<string>;
      ipcRenderer: {
        on: (channel: string, callback: (...args: any[]) => void) => void;
        once: (channel: string, callback: (...args: any[]) => void) => void;
        off: (channel: string, callback: (...args: any[]) => void) => void;
      };
    };
  }
}
