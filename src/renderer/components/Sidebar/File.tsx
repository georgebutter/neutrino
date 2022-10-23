import React from 'react';
import { Maybe } from 'utils/maybe';
import { Context } from '../Provider';

export const File: React.FC<{
  title: string;
  id: string;
  onBlur: () => void;
  onRename: (name: string) => void;
  renamingValue: string;
  renaming: Maybe<string>;
  status: string;
}> = ({ id, title, renamingValue, renaming, status, onBlur, onRename }) => {
  const { selectFile, selectedFile } = React.useContext(Context);

  return (
    <div className="mb-2">
      {`${id}.${title}` === renaming ? (
        <>
          <div
            className="opacity-50 bg-bg fixed inset-0 z-10"
            onClick={() => onBlur()}
          />
          <form
            className="w-full p-2 rounded text-left opacity-80 bg-primary relative z-20"
            onSubmit={(e) => {
              e.preventDefault();
              if (renamingValue?.length) {
                window.electron.renameFile(id, title, renamingValue);
              }
            }}
          >
            <input
              id={`rename-${id}.${title}`}
              className="rounded bg-transparent text-bg"
              value={renamingValue}
              onChange={(e) => onRename(e.target.value)}
            />
          </form>
        </>
      ) : (
        <button
          title={`name:${id}.${title}`}
          className={`w-full p-2 rounded text-left opacity-80${
            selectedFile === `${id}.${title}` && status !== 'adding'
              ? ' bg-primary text-bg'
              : ''
          }`}
          onClick={() => {
            selectFile?.(`${id}.${title}`);
          }}
        >
          {title}
        </button>
      )}
    </div>
  );
};
