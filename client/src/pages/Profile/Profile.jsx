import Header from '@components/Header';
import ToastList from '@components/ToastList';
import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer';

const MyProfile = () => {
  return (
    <>
      <Header isDashboard={false} />
      <div className="container">
        <Outlet />
      </div>
      <ToastList />
      <Footer />
    </>
  );
};

export default MyProfile;
