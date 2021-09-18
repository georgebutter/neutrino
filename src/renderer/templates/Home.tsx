import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {CREATE_REPO, GET_REPO} from 'renderer/queries';
import { Wrapper } from 'renderer/components/Wrapper';
import { Sidebar } from 'renderer/components/Sidebar';
import { Main } from 'renderer/components/Main';

export const Home: React.FC<Props> = () => {

  return (
    <Wrapper>
      <Sidebar />
      <Main />
    </Wrapper>
  );
};

  // const [createRepository, createResponse] = useMutation(CREATE_REPO);
  // const {loading, error, data} = useQuery(GET_REPO);
  // console.log(data);/

  // {data?.viewer?.login ? (
  //   <div>
  //     {data?.viewer?.repository ? (
  //       <Repo {...data.viewer.repository} />
  //     ) : loading ? (
  //       <p>loading...</p>
  //     ) : (
  //       <div>
  //         <p>
  //           Could not find a notes repository, click below to set one up.
  //         </p>
  //         <button onClick={() => createRepository()}>Setup</button>
  //       </div>
  //     )}
  //   </div>
  // ) : (
  //   <div>
  //     <p>Login to github to access your notes</p>
  //   </div>
  // )}

  // {data?.viewer?.login ? (
  //   <button onClick={() => window.electron.logout()}>logout</button>
  // ) : (
  //   <button onClick={() => window.electron.login()}>login</button>
  // )}

const Repo: React.FC<{
  sshUrl: string;
}> = () => {
  const [value, setValue] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("ready")


  const inputRef = React.createRef<HTMLInputElement>();

  React.useEffect(() => {


    window.electron.ipcRenderer.on('newFile', () => {
      setStatus("ready");
      setValue("");
    })


  }, [])

  return (
    <div>
      {status === "adding" ? (
        <form onSubmit={() => {
          window.electron.newFile(value);
        }}>
          <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)}/>
        </form>
      ) : (
        <>

          <button onClick={() => {
            inputRef.current?.focus()
            setStatus("adding")
          }}>Add file</button>
        </>

      )}
    </div>
  )
};

type Props = {};
