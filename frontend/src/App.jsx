import { Navigate, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import ProductList from './components/Product/ProductList';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <>
      <Routes >
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
