import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminBookList from './components/AdminBookList';
import ReaderBookView from './components/ReaderBookView';
import LendList from './components/LendList';
import ManageReaders from './components/ManageReaders'; //  新增
import TypeTabView from './components/TypeTabView';

function App() {
  const userType = localStorage.getItem('userType');
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    console.warn('! localStorage user 解析失败', e);
    user = null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/books"
          element={
            userType === 'admin' ? <AdminBookList /> :
            userType === 'reader' ? <ReaderBookView readerId={user?.id} /> :
            <Navigate to="/" replace />
          }
        />
    
        <Route
          path="/lend"
          element={
            userType ? (
              <LendList userType={userType} readerId={user?.id} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
  path="/types"
  element={<TypeTabView />}
/>
        {/* 新增：管理员才能访问 */}
        <Route
          path="/readers"
          element={
            userType === 'admin' ? <ManageReaders /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
