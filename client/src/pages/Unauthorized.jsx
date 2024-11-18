import { useAuthContext } from "../contexts/AuthContext";

const Unauthorized = () => {
  const { user } = useAuthContext();

  return (
    <strong style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {user ? <p>Bạn không có quyền truy cập trang này.</p> : <p>Vui lòng đăng nhập.</p>}
    </strong>
  )
}

export default Unauthorized;