import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { UserTypes } from '../../../types';
import { logout } from '../../../_redux/features/user';
import styles from './HomeComp.module.scss';

const HomeComp: React.FC = () => {
    const dispatch = useDispatch();

    const user: UserTypes = useSelector((state: any) => state.user.user);

    const [sasData, setSasData] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                setIsPending(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/admin/get-statistical`,
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );

                setSasData(res?.data?.data);
                setIsPending(false);
            } catch (error: any) {
                console.log(error);

                setIsPending(false);
                if (
                    error?.response?.status === 401 ||
                    error?.response?.status === 500
                ) {
                    dispatch(logout());
                }
            }
        })();
    }, []);

    return (
        <section className={styles.wrapperHomeComp}>
            <header className='header'>
                <h1>
                    <i className='fa-solid fa-city'></i>
                    <span>Dashboard</span>
                </h1>
            </header>

            <div className='creation'>
                <Button variant='outline-success'>
                    <Link to='/add-product'>
                        <i className='fa-solid fa-plus'></i>{' '}
                        <span>Add new product</span>
                    </Link>
                </Button>
                <Button variant='primary'>
                    <Link to='/add-order'>
                        <i className='fa-solid fa-plus'></i>{' '}
                        <span>Create new order</span>
                    </Link>
                </Button>
            </div>

            <div className='summary'>
                {isPending ? (
                    <>
                        <div
                            className='summary-item'
                            style={{
                                padding: '0',
                                height: '50px',
                            }}>
                            <Skeleton
                                style={{
                                    height: '100%',
                                }}
                            />
                        </div>
                        <div
                            className='summary-item'
                            style={{
                                padding: '0',
                                height: '50px',
                            }}>
                            <Skeleton
                                style={{
                                    height: '100%',
                                }}
                            />
                        </div>
                        <div
                            className='summary-item'
                            style={{
                                padding: '0',
                                height: '50px',
                            }}>
                            <Skeleton
                                style={{
                                    height: '100%',
                                }}
                            />
                        </div>
                        <div
                            className='summary-item'
                            style={{
                                padding: '0',
                                height: '50px',
                            }}>
                            <Skeleton
                                style={{
                                    height: '100%',
                                }}
                            />
                        </div>
                    </>
                ) : (
                    sasData && (
                        <>
                            <div className='summary-item'>
                                <h3 className='heading'>New account</h3>
                                <div className='content'>
                                    <p className='number'>
                                        {sasData?.users - 1} account
                                    </p>
                                    <span className='unit'>
                                        <i className='fa-solid fa-user-plus'></i>
                                    </span>
                                </div>
                            </div>
                            <div className='summary-item'>
                                <h3 className='heading'>All order</h3>
                                <div className='content'>
                                    <p className='number'>
                                        {sasData?.orders} orders
                                    </p>
                                    <span className='unit'>
                                        <i className='fa-solid fa-shopping-cart'></i>
                                    </span>
                                </div>
                            </div>
                            <div className='summary-item'>
                                <h3 className='heading'>New order</h3>
                                <div className='content'>
                                    <p className='number'>0</p>
                                    <span className='unit'>order</span>
                                </div>
                            </div>
                            <div className='summary-item'>
                                <h3 className='heading'>Revenue</h3>
                                <div className='content'>
                                    <p className='number'>
                                        {sasData?.revenue?.amount?.toLocaleString() ||
                                            0}{' '}
                                        ₫
                                    </p>
                                    <span className='unit'>
                                        <i className='fa-solid fa-coins'></i>
                                    </span>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </section>
    );
};

HomeComp.displayName = 'HomePage';
export default HomeComp;
