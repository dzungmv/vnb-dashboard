import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logout } from '../../_redux/features/user';

import LoadingScreen from '../../common/LoadingScreen';
import styles from './Home.module.scss';

const ITEM_MENU = [
    {
        id: 1,
        name: 'Home',
        icon: 'fa-solid fa-home',
        url: '/',
    },
    {
        id: 2,
        name: 'Products',
        icon: 'fa-solid fa-boxes',
        url: '/products',
    },
    {
        id: 3,
        name: 'Orders',
        icon: 'fa-solid fa-cart-shopping',
        url: '/orders',
    },
    {
        id: 4,
        name: 'Pending',
        icon: 'fa-solid fa-clock',
        url: '/orders-pending',
    },
    {
        id: 5,
        name: 'Shipping',
        icon: 'fa-solid fa-truck-fast',
        url: '/orders-shipping',
    },
    {
        id: 6,
        name: 'Delivered',
        icon: 'fa-solid fa-clipboard-list-check',
        url: '/orders-delivered',
    },
    {
        id: 7,
        name: 'Returns',
        icon: 'fa-solid fa-undo',
        url: '/orders-returns',
    },
    {
        id: 8,
        name: 'Cancelled',
        icon: 'fa-solid fa-file-slash',
        url: '/orders-cancelled',
    },
];

const HomePage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user.user);

    const [logoutPending, setLogoutPending] = React.useState<boolean>(false);
    const handleLogout = async () => {
        try {
            setLogoutPending(true);
            await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/logout`,
                {},
                {
                    headers: {
                        authorization: user?.tokens?.accessToken,
                        'x-client-id': user?.user?.id,
                    },
                }
            );
            await dispatch(logout());
            setLogoutPending(false);
            navigate('/login');
        } catch (error: any) {
            setLogoutPending(false);
            console.error(error);
            if (error?.response?.status === 401) {
                dispatch(logout());
            }
        }
    };
    return (
        <>
            <main className={styles.wrapperHome}>
                <section className='section-left '>
                    <aside className='section-left--aside'>
                        <header className='section-left--header'>
                            <figure className='header-logo'>
                                <img src={'/icon.png'} alt='Jsound' />
                            </figure>
                            <h1>VNB Admin</h1>
                        </header>

                        <section className='section-left--content'>
                            <div className='main-content'>
                                {ITEM_MENU.map((item) => {
                                    return (
                                        <NavLink
                                            to={item.url}
                                            className={`item ${item.name}`}
                                            key={item.id}>
                                            <div className='item-label'>
                                                <i className={item.icon}></i>
                                            </div>
                                            <span>{item.name}</span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                            <div className='footer-section'>
                                <div className='item' onClick={handleLogout}>
                                    <i className='fa-solid fa-right-from-bracket'></i>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </section>
                    </aside>
                </section>
                <section className='section-right'>
                    <Outlet />
                </section>
            </main>

            {logoutPending && <LoadingScreen content={'Logout...'} />}
        </>
    );
};

export default HomePage;
