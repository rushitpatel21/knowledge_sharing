import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Public/Login';
import Signup from '../pages/Public/Signup';
import NotFound from '../pages/NotFound';
import CreateArticle from '../pages/Protected/CreateArticle';
import ArticlesList from '../pages/Protected/ArticlesList';
import ArticleDetails from '../pages/Protected/ArticleDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/articles/new" 
        element={
          <ProtectedRoute>
            <CreateArticle />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/articles/edit/:id" 
        element={
          <ProtectedRoute>
            <CreateArticle />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/articles" 
        element={
          <ProtectedRoute>
            <ArticlesList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/articles/:id" 
        element={
          <ProtectedRoute>
            <ArticleDetails />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}