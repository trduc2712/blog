import { useAuthContext } from '@contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuthContext();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {user ? (
        <strong>Bạn không có quyền truy cập trang này.</strong>
      ) : (
        <strong>Vui lòng đăng nhập.</strong>
      )}
    </div>
  );
};

export default Unauthorized;
