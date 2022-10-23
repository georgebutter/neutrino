import React from 'react';

import { Editor } from '../Editor';
import { Trash } from '../Icons';
import { Context } from '../Provider';

export const Main: React.FC<Props> = () => {
  const { deleteFile, selectedFile } = React.useContext(Context);
  return (
    <main className="flex-1 h-screen bg-bg flex flex-col">
      {selectedFile ? (
        <nav className="flex items-center drag bg-fg h-14 w-full border-b border-border p-2">
          <div className="w-1/2">
            <button
              className="rounded p-2 bg-fg hover:bg-hover transition mr-2"
              onClick={() => deleteFile()}
            >
              <Trash />
            </button>
          </div>

          <div className="w-1/2 flex justify-end" />
        </nav>
      ) : null}

      <div className="relative h-full w-full">
        {selectedFile ? (
          <Editor />
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <p className="text-xl text-faded">
              Select a note from the left hand side or ⌘ + N to create a new
              one.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

type Props = {};
