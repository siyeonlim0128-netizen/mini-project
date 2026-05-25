import React, { useState } from 'react';
import MainPage from './pages/MainPage';
import PostCreatePage from './pages/PostCreatePage';

function App() {
  const [currentPage, setCurrentPage] = useState('main');

  if (currentPage === 'create') {
    return <PostCreatePage onBack={() => setCurrentPage('main')} />;
  }

  return <MainPage onCreateClick={() => setCurrentPage('create')} />;
}

export default App;
