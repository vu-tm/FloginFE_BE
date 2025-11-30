import axios from 'axios';
import { message, Modal } from 'antd';   // dùng Modal ở đây
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Tạo instance axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor bắt lỗi 401 toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Chỉ hiện Modal 1 lần duy nhất
      if (!window.isTokenExpiredModalShown) {
        window.isTokenExpiredModalShown = true;

        Modal.error({
          title: 'Phiên đăng nhập đã hết hạn',
          content: 'Bạn sẽ được chuyển về trang đăng nhập trong giây lát...',
          okText: 'Đồng ý',
          centered: true,
          onOk: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Nếu dùng react-router thì dùng navigate, còn không thì dùng window.location
            window.location.href = '/login';
            // Hoặc nếu bạn dùng history.push (không cần reload)
            // history.push('/login');
          },
          onCancel: () => {
            window.location.href = '/login';
          },
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;