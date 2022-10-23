import React from 'react';
import { FileJson } from 'types';
import { AccountIcon, GithubIcon, NewIcon } from '../Icons';
import { Context } from '../Provider';
import { File } from './File';

export const Sidebar: React.FC<Props> = () => {
  const { selectFile, login } = React.useContext(Context);
  const sidebarRef = React.createRef<HTMLDivElement>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<Array<FileJson>>([]);
  const [value, setValue] = React.useState<string>('New note');
  const [status, setStatus] = React.useState<string>('ready');
  const [renaming, setRenaming] = React.useState<string>();
  const [renamingValue, setRenamingValue] = React.useState<string>('');
  const inputRef = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    window.electron.getFileTree();
    window.electron.ipcRenderer.on('getFileTree', (files) => {
      console.log(files);
      setFiles(files);
    });
    window.electron.ipcRenderer.on('deleteFile', () => {
      window.electron.getFileTree();
    });
    window.electron.ipcRenderer.on('renamedFile', () => {
      window.electron.getFileTree();
      setRenaming(undefined);
    });
    window.electron.ipcRenderer.on('newFile', (id) => {
      setStatus('ready');
      setValue('New note');
      selectFile?.(id);
      window.electron.getFileTree();
    });
    window.electron.ipcRenderer.on('renameFile', (name) => {
      const id = name.replace('name:', '');
      setRenaming(id);
    });
  }, []);

  React.useEffect(() => {
    if (renaming && files) {
      const file = files.find(({ id, title }) => `${id}.${title}` === renaming);
      if (file) {
        setRenamingValue(file.title);
      }
      document.getElementById(`rename-${renaming}`)?.focus();
    }
  }, [renaming, files]);

  React.useEffect(() => {
    if (status === 'adding') {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [status]);

  return (
    <aside className="h-screen relative flex flex-col">
      <div className="drag w-full h-12" />
      <div
        ref={sidebarRef}
        className="flex flex-col flex-1 overflow-hidden p-4"
        style={{ width: '300px' }}
      >
        <div className="flex flex-col flex-1">
          {login ? (
            <button
              className="flex items-center p-2 mr-2"
              onClick={() => window.electron.logout()}
            >
              <GithubIcon />
              <span className="block ml-2">{login}</span>
            </button>
          ) : (
            <button
              className="p-2 mr-2"
              onClick={() => window.electron.login()}
            >
              <AccountIcon />
            </button>
          )}
          {files.map((props) => (
            <File
              {...props}
              key={props.id}
              renamingValue={renamingValue}
              renaming={renaming}
              onRename={(name: string) => setRenamingValue(name)}
              status={status}
              onBlur={() => {
                setRenamingValue('');
                setRenaming(undefined);
              }}
            />
          ))}
          <div className={`${status === 'adding' ? 'block' : 'hidden'}`}>
            <div
              className="opacity-50 bg-bg fixed inset-0 z-10"
              onClick={() => {
                setValue('New note');
                setStatus('ready');
              }}
            />
            <form
              className="z-20 relative w-full p-2 rounded-md bg-primary opacity-80"
              onSubmit={(e) => {
                e.preventDefault();
                if (value.length) {
                  window.electron.newFile(value);
                }
              }}
            >
              <input
                className="rounded px-2 bg-transparent text-bg"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div>
          {status === 'ready' ? (
            <button
              className="p-2 flex items-center outline-none"
              onClick={() => setStatus('adding')}
            >
              <NewIcon />
              <span className="ml-2">New note</span>
            </button>
          ) : null}
        </div>
      </div>
      <div
        className="w-px absolute inset-y-0 right-0 bg-border cursor-col-resize"
        onMouseMove={(e) => {
          if (e.buttons > 0) {
            setDragging(true);
            const s = sidebarRef.current;
            if (s) {
              s.style.width = `${
                Number(s.style.width.replace('px', '')) + e.movementX
              }px`;
            }
          } else {
            setDragging(false);
          }
        }}
      >
        {dragging ? <div className="fixed inset-0 z-10" /> : null}
      </div>
    </aside>
  );
};

type Props = {};
