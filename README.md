# FloginFE_BE

## 1. Backend

Backend được triển khai dưới dạng **Render Web Service** với các cấu hình:

- **Source Repository:** `vu-tm/FloginFE_BE`
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Docker
- **Instance Type:** Free

Render tự động thực hiện quá trình build Docker image, khởi tạo ứng dụng Spring Boot, kết nối H2 Database và đưa Web Service vào trạng thái Live.

### Environment

Thiết lập biến môi trường cho Backend trên Render:

```env
JAVA_TOOL_OPTIONS=-Xmx256m -XX:+UseSerialGC
```

**URL Backend:**  
https://floginfe-be-4tnt.onrender.com

### Backend Test

```bash
mvn test
```

## 2. Frontend

Frontend được triển khai bằng **Render Static Site** với cấu hình:

- **Source Repository:** `vu-tm/FloginFE_BE`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`

Biến môi trường được sử dụng để xác định địa chỉ API Backend:

```env
REACT_APP_API_BASE_URL=https://floginfe-be-4tnt.onrender.com/api
```

**URL Frontend:**  
https://flogin-frontend.onrender.com/login

### 2.1. Test

```bash
npm run test:coverage -- --runInBand
```

### 2.2. Cypress e2e

Chạy tất cả test:

```bash
npm run e2e:run
```

Mở giao diện Cypress:

```bash
npm run e2e:open
```

### Chạy local

Mở 3 terminal từ thư mục gốc dự án; giữ backend và frontend chạy:

```powershell
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: E2E
cd frontend
npx cypress run
```
