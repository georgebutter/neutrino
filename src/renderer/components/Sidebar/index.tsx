import React from "react";

export const Sidebar: React.FC<Props> = () => {
  const sidebarRef = React.createRef<HTMLDivElement>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    window.electron.getFileTree();
    window.electron.ipcRenderer.on('getFileTree', (files) => {
      setFiles(files);
    })
  }, [])

  return (
    <aside className="flex">
      <div ref={sidebarRef} className="flex flex-col h-screen bg-blue-500 overflow-hidden" style={{ width: '300px' }}>
        {files.map((f) => (
          <div key={f}>
            <button>{f}</button>
          </div>
        ))}
      </div>
      <div className="h-screen w-2 bg-green-500 cursor-col-resize" onMouseMove={(e) => {
        if (e.buttons > 0) {
          setDragging(true);
          const s = sidebarRef.current;
          if (s) {
            s.style.width = `${Number(s.style.width.replace("px", "")) + e.movementX}px`
          }
        } else {
          setDragging(false)
        }
      }}>
        {dragging ? <div className="fixed bg-purple opacity-50 inset-0 z-10" /> : null}
      </div>
    </aside>
  );
}

type Props = {}
