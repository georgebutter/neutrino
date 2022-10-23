import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import { last } from 'utils/array';
import { v4 as uuidv4 } from 'uuid';
import { HandleIcon } from '../Icons';

// import { Context } from '../Provider';

export const Editor: React.FC = () => {
  const blockStackRef = React.useRef<HTMLDivElement>(null);
  const [focus, setFocus] = React.useState<string>();
  // const { value, setValue, selectedFile } = React.useContext(Context);
  const [blocks, setBlocks] = React.useState<Blocks>([]);

  const defaultBlock = React.useCallback<() => Block>(
    () => ({
      id: uuidv4(),
      html: '',
      tag: 'p',
    }),
    []
  );

  const addBlock = React.useCallback(({ id }) => {
    const newBlock = defaultBlock();

    setBlocks((prev) => {
      const index = prev.findIndex((p) => p.id === id) + 1;
      prev.splice(index, 0, newBlock);
      return [...prev];
    });

    setFocus(newBlock.id);
  }, []);

  const deleteBlock = React.useCallback(({ id }) => {
    setBlocks((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      setFocus(prev[index - 1]?.id);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const focusLast = React.useCallback(() => {
    const lastBlock = last(blocks);
    setFocus(lastBlock.id);
  }, [blocks]);

  React.useEffect(() => {
    if (!blocks.length) {
      const newBlock = defaultBlock();
      setBlocks([newBlock]);
      setFocus(newBlock.id);
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

  const handleChange = () => {
    console.log(blocks);
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      ref={blockStackRef}
      id="BlockStack"
    >
      {blocks.map((block) => (
        <Block
          key={block.id}
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
> = ({ addBlock, deleteBlock, handleChange, id, ...block }) => {
  const ref = React.useRef<Ref>(null);
  const [htmlBackup, setHtmlBackup] = React.useState<string>(block.html);
  const [html, setHtml] = React.useState<string>(block.html);

  const handleKeyPress = React.useCallback(
    (e) => {
      if (e.key === '/') {
        setHtmlBackup(html);
      }
      console.log(e);
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBlock({
          id,
          ref,
        });
      }
      handleChange();
      console.log(html);
    },
    [html, id, ref]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      const text = e.target.textContent;
      if (e.key === 'Backspace' && text.length <= 1) {
        deleteBlock({
          id,
          ref,
        });
      }
    },
    [id, ref]
  );

  const handlePaste = React.useCallback((e: React.ClipboardEvent) => {
    console.log(e);
    // Stop data from being pasted
    e.stopPropagation();
    e.preventDefault();
    const { clipboardData } = e;
    const pastedData = clipboardData.getData('html');

    console.log(pastedData);
  }, []);

  React.useEffect(() => {}, [html]);

  return (
    <div className="group relative">
      <button className="group-hover:opacity-100 opacity-0 transition-opacity absolute top-0 left-0">
        <HandleIcon />
      </button>
      <ContentEditable
        id={id}
        innerRef={ref}
        html={html}
        tagName={block.tag}
        disabled={false}
        className="outline-none p-1 pl-10 font-serif text-2xl"
        onChange={(e) => {
          setHtml(e.target.value);
        }}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

type Blocks = Array<Block>;

type Block = {
  id: string;
  html: string;
  tag: 'p';
};

type BlockHandlerParams = { id: string; ref: BlockRef };
type BlockRef = React.MutableRefObject<Ref>;
type Ref = HTMLDivElement | null;
