import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './components/pages/Auth/Login';
import HomePage from './components/pages/Home';
import AddProduct from './components/pages/Home/AddProduct';
import AllOrders from './components/pages/Home/Orders';
import AllProduct from './components/pages/Home/AllProducts';
import EditProduct from './components/pages/Home/EditProduct';

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }>
                        <Route path='/' element={<AllProduct />} />
                        <Route path='/add-product' element={<AddProduct />} />
                        <Route
                            path='/edit-product/:slug'
                            element={<EditProduct />}
                        />
                        <Route path='/orders' element={<AllOrders />} />
                    </Route>

                    <Route path='/login' element={<LoginPage />} />

                    <Route path='*' element={<h1>404</h1>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
