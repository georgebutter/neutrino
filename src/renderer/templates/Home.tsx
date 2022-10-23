import React from 'react';
import { Wrapper } from 'renderer/components/Wrapper';
import { Sidebar } from 'renderer/components/Sidebar';
import { Main } from 'renderer/components/Main';

export const Home: React.FC<Props> = () => (
  <Wrapper>
    <Sidebar />
    <Main />
  </Wrapper>
);

type Props = {};
