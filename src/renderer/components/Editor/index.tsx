import { toHTML } from '@portabletext/to-html';
import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import { Blocks, Block } from 'types';
import { last } from 'utils/array';
import { v4 as uuidv4 } from 'uuid';
import { HandleIcon } from '../Icons';
import { Context } from '../Provider';

export const Editor: React.FC = () => {
  const { value, setValue, selectedFile } = React.useContext(Context);
  const blockStackRef = React.useRef<HTMLDivElement>(null);
  const [saving, setSaving] = React.useState<'saving' | 'saved' | 'ready'>(
    'ready'
  );
  const [focus, setFocus] = React.useState<string>();
  const [blocks, setBlocks] = React.useState<Blocks>([]);

  const defaultBlock = React.useCallback<() => Block>(
    () => ({
      _key: uuidv4(),
      _type: 'p',
      children: []
    }),
    []
  );

  const addBlock = React.useCallback(({ _key }: BlockHandlerParams) => {
    const newBlock = defaultBlock();

    setBlocks((prev) => {
      const index = prev.findIndex((p) => p._key === _key) + 1;
      prev.splice(index, 0, newBlock);
      return [...prev];
    });

    setFocus(newBlock._key);
  }, []);

  const deleteBlock = React.useCallback(({ _key }: BlockHandlerParams) => {
    setBlocks((prev) => {
      const index = prev.findIndex((p) => p._key === _key);
      setFocus(prev[index - 1]?._key);
      return prev.filter((p) => p._key !== _key);
    });
  }, []);

  const focusLast = React.useCallback(() => {
    const lastBlock = last(blocks);
    setFocus(lastBlock._key);
  }, [blocks]);

  React.useEffect(() => {
    if (!blocks.length) {
      const newBlock = defaultBlock();
      setBlocks([newBlock]);
      setFocus(newBlock._key);
    }
  }, [blocks]);

  React.useEffect(() => {
    if (focus) {
      const elem = document.getElementById(focus) as HTMLDivElement;
      elem?.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(elem);
      range.collapse(false);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setFocus(undefined);
    }
  }, [focus]);

  React.useEffect(() => {
    function fileSaved() {
      setSaving('saved');
      setTimeout(() => {
        setSaving('ready');
      }, 300);
    }
    window.electron.ipcRenderer.on('saveFile', fileSaved);

    return function cleanup() {
      window.electron.ipcRenderer.off('saveFile', fileSaved);
    };
  }, []);

  React.useEffect(() => {
    if (!value) return;
    setBlocks(value.blocks);
  }, [value])

  const handleChange = () => {
    console.log(blocks);
    setSaving('saving');
    window.electron.saveFile(blocks);
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      ref={blockStackRef}
      id="BlockStack"
    >
      <p>{saving}</p>
      {blocks.map((block) => (
        <Block
          key={block._key}
          {...block}
          addBlock={addBlock}
          deleteBlock={deleteBlock}
          handleChange={handleChange}
        />
      ))}
      <div className="flex-grow" onClick={() => focusLast()} />
    </div>
  );
};

const Block: React.FC<
  Block & {
    addBlock: (params: BlockHandlerParams) => void;
    deleteBlock: (params: BlockHandlerParams) => void;
    handleChange: () => void;
  }
> = ({ addBlock, deleteBlock, handleChange, _key, ...block }) => {
  const ref = React.useRef<Ref>(null);

  const handleKeyPress = React.useCallback(
    (e) => {
      if (!_key) return;
      console.log(e);
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBlock({
          _key,
          ref,
        });
      }
      handleChange();
      // console.log(html);
    },
    [_key, ref]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      const text = e.target?.textContent;
      if (!_key) return;
      if (e.key === 'Backspace' && text.length <= 1) {
        deleteBlock({
          _key,
          ref,
        });
      }
    },
    [_key, ref]
  );

  const handlePaste = React.useCallback((e) => {
    console.log(e);
    // Stop data from being pasted
    e.stopPropagation();
    e.preventDefault();
    const { clipboardData } = e;
    const pastedData = clipboardData.getData('html');

    console.log(pastedData);
  }, []);

  return (
    <div className="group relative">
      <button className="group-hover:opacity-100 opacity-0 transition-opacity absolute top-0 left-0">
        <HandleIcon />
      </button>
      <ContentEditable
        id={_key}
        innerRef={ref}
        html={toHTML(block)}
        tagName={block._type}
        disabled={false}
        className="outline-none p-1 pl-10 font-serif text-2xl"
        onChange={(e) => {
          // setHtml(e.target.value);
        }}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

type BlockHandlerParams = { _key: string; ref: BlockRef };
type BlockRef = React.MutableRefObject<Ref>;
type Ref = HTMLDivElement | null;
