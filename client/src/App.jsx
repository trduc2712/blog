import './App.scss';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Loading = lazy(() => import('@pages/Loading'));
const PostDetail = lazy(() => import('@pages/PostDetail'));
const Profile = lazy(() => import('@pages/Profile'));
const ProfileOverview = lazy(() => import('@pages/Profile/Overview'));
const CreatePost = lazy(() => import('@pages/CreatePost'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const DashboardOverview = lazy(() => import('@pages/Dashboard/Overview'));
const PostList = lazy(() => import('@pages/Dashboard/Posts/PostList'));
const EditPost = lazy(() => import('@pages/EditPost'));
const UserList = lazy(() => import('@pages/Dashboard/Users/UserList'));
const EditUser = lazy(() => import('@pages/Dashboard/Users/EditUser'));
const CreateUser = lazy(() => import('@pages/Dashboard/Users/CreateUser'));
const CategoryList = lazy(
  () => import('@pages/Dashboard/Categories/CategoryList')
);
const EditCategory = lazy(
  () => import('@pages/Dashboard/Categories/EditCategory')
);
const CreateCategory = lazy(
  () => import('@pages/Dashboard/Categories/CreateCategory')
);
const RoleBasedRoute = lazy(() => import('@pages/RoleBasedRoute'));
const Unauthorized = lazy(() => import('@pages/Unauthorized'));

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <RoleBasedRoute
                    allowedRole="ADMIN"
                    redirectPath="/unauthorized"
                  >
                    <Dashboard />
                  </RoleBasedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="posts" element={<PostList />} />
                <Route path="posts/edit/:postId" element={<EditPost />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/edit/:userId" element={<EditUser />} />
                <Route path="users/new" element={<CreateUser />} />
                <Route path="categories" element={<CategoryList />} />
                <Route
                  path="categories/edit/:categoryId"
                  element={<EditCategory />}
                />
                <Route path="categories/new" element={<CreateCategory />} />
              </Route>
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/profile/:username" element={<Profile />}>
                <Route index element={<ProfileOverview />} />
                <Route path="posts/edit/:postId" element={<EditPost />} />
              </Route>
              <Route path="/posts/new" element={<CreatePost />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
