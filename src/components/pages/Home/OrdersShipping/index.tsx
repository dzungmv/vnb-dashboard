import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import LoadingScreen from '../../../common/LoadingScreen';
import Modal from '../../../common/Modal';
import { CartType, OrderType, UserTypes } from '../../../types';
import { logout } from '../../../_redux/features/user';

import styles from './orders.module.scss';

const OrderShipping: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user: UserTypes = useSelector((state: any) => state.user.user);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [detailsModal, setDetailsModal] = useState<boolean>(false);
    const [products, setProducts] = useState<CartType[]>([]);

    const [returnsModal, setReturnsModal] = useState<boolean>(false);
    const [returnsId, setReturnsId] = useState<string>('');
    const [isReturnsPending, setIsReturnsPending] = useState<boolean>(false);

    const [completedModal, setCompletedModal] = useState<boolean>(false);
    const [completedId, setCompletedId] = useState<string>('');
    const [completedTotal, setCompletedTotal] = useState<number>(0);
    const [isCompletedPending, setIsCompletedPending] =
        useState<boolean>(false);

    const mergeData = data?.map((item: any) => {
        return item?.orders?.map((order: any) => {
            return {
                ...order,
            };
        });
    });

    const flattenData = mergeData?.flat();

    const shippingData = flattenData?.filter(
        (item: OrderType) => item.status === 'shipping'
    );

    const finalData = shippingData?.sort((x: OrderType, y: OrderType) => {
        return new Date(x.updatedAt) < new Date(y.updatedAt) ? 1 : -1;
    });

    const HANDLE = {
        openDetailsModal: (products: CartType[]) => {
            setProducts(products);
            setDetailsModal(true);
        },
        openReturnsModal: (id: string) => {
            setReturnsId(id);
            setReturnsModal(true);
        },
        openCompletedModal: (id: string) => {
            setCompletedId(id);
            setCompletedModal(true);
        },

        changeToReturns: async () => {
            try {
                setIsReturnsPending(true);
                await axios.patch(
                    `${process.env.REACT_APP_API_URL}/admin/update-order/${returnsId}`,
                    {
                        status: 'returns',
                    },
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );

                setIsReturnsPending(false);
                setReturnsModal(false);
                swal({
                    title: 'Success',
                    text: 'Order status changed to returns',
                    icon: 'success',
                }).then(() => {
                    navigate('/orders-returns');
                });
            } catch (error: any) {
                setIsReturnsPending(false);
                if (error?.response?.status === 401) {
                    dispatch(logout());
                }
            }
        },
        changToCompleted: async () => {
            try {
                setIsCompletedPending(true);
                await axios.patch(
                    `${process.env.REACT_APP_API_URL}/admin/update-order/${completedId}`,
                    {
                        status: 'completed',
                        total: completedTotal,
                    },
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );

                setIsCompletedPending(false);
                setCompletedModal(false);
                swal({
                    title: 'Success',
                    text: 'Order status changed to completed',
                    icon: 'success',
                }).then(() => {
                    navigate('/orders-delivered');
                });
            } catch (error: any) {
                setIsCompletedPending(false);
                if (error?.response?.status === 401) {
                    dispatch(logout());
                }
            }
        },
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/admin/get-all-orders`,
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );
                setData(res?.data?.data);
                setLoading(false);
            } catch (error: any) {
                console.error(error);
                setLoading(false);

                if (error?.response?.status === 401) {
                    dispatch(logout());
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <section className={styles.wrapperOrders}>
                <h1>Orders shipping</h1>
                <div className='content'>
                    {finalData && finalData.length > 0 ? (
                        <div className='product-table-section'>
                            <Table hover responsive borderless>
                                <thead>
                                    <tr>
                                        <th className='center'>Orderer</th>
                                        <th>Phone number</th>

                                        <th className='center'>Payment</th>

                                        <th className='center'>Address</th>
                                        <th className='center'>Status</th>

                                        <th className='center'>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td>
                                                <Skeleton />
                                            </td>
                                            <td>
                                                <Skeleton />
                                            </td>
                                            <td>
                                                <Skeleton />
                                            </td>
                                            <td>
                                                <Skeleton />
                                            </td>
                                            <td>
                                                <Skeleton />
                                            </td>
                                        </tr>
                                    ) : (
                                        finalData.map((item: OrderType) => {
                                            return (
                                                <tr
                                                    key={item._id}
                                                    className='table-item'>
                                                    <td className='center'>
                                                        {item.fullname}
                                                    </td>
                                                    <td>{item.phone}</td>
                                                    <td className='center'>
                                                        {item.payment}
                                                    </td>

                                                    <td className='center'>
                                                        {item.address}
                                                    </td>
                                                    <td
                                                        className={
                                                            item.status ===
                                                                'shipping' &&
                                                            'center shipping'
                                                        }
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}>
                                                        {item.status}
                                                    </td>
                                                    <td
                                                        className='center'
                                                        style={{
                                                            color: 'red',
                                                        }}>
                                                        {item.total.toLocaleString()}
                                                        ₫
                                                    </td>
                                                    <td>
                                                        <div className='action'>
                                                            <div
                                                                className='action-item action-item-edit'
                                                                onClick={() =>
                                                                    HANDLE.openDetailsModal(
                                                                        item.products
                                                                    )
                                                                }>
                                                                Details
                                                            </div>

                                                            {item.status ===
                                                                'shipping' && (
                                                                <div className='action-wrapper'>
                                                                    <div
                                                                        className='action-item action-item-completed'
                                                                        onClick={() => {
                                                                            setCompletedTotal(
                                                                                item.total
                                                                            );
                                                                            HANDLE.openCompletedModal(
                                                                                item._id
                                                                            );
                                                                        }}>
                                                                        Completed
                                                                    </div>
                                                                    <div
                                                                        className='action-item action-item-returns'
                                                                        onClick={() =>
                                                                            HANDLE.openReturnsModal(
                                                                                item._id
                                                                            )
                                                                        }>
                                                                        Returns
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <h3>No orders</h3>
                    )}
                </div>
            </section>

            {detailsModal && (
                <Modal
                    title='Products in order'
                    show={detailsModal}
                    close={() => setDetailsModal(false)}>
                    <div className={styles.wrapperDetailsModal}>
                        {products?.map((item: CartType) => {
                            return (
                                <div key={item._id} className='content-item'>
                                    <div className='figure'>
                                        <figure>
                                            <img
                                                src={item.product_image}
                                                alt='item'
                                            />
                                        </figure>

                                        <div className='info'>
                                            <p className='info-name'>
                                                {item.product_name}
                                            </p>
                                            <p className='info-price'>
                                                Qty:{' '}
                                                <span>
                                                    {item.product_quantity}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className='price'>
                                        {item.product_price.toLocaleString()} ₫
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
            )}

            {completedModal && (
                <Modal
                    title='Change order to completed'
                    show={completedModal}
                    close={() => {
                        setCompletedId('');
                        setCompletedModal(false);
                        setCompletedTotal(0);
                    }}>
                    <div className={styles.wrapperShippingModal}>
                        <div className='content'>
                            <p>
                                Are you sure to change this order to completed?
                            </p>
                        </div>

                        <div className='btn-wrapper'>
                            <div
                                className='close'
                                onClick={() => {
                                    setCompletedId('');
                                    setCompletedModal(false);
                                    setCompletedTotal(0);
                                }}>
                                Close
                            </div>
                            <button onClick={HANDLE.changToCompleted}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {returnsModal && (
                <Modal
                    title='Change order to returns status'
                    show={returnsModal}
                    close={() => {
                        setReturnsId('');
                        setReturnsModal(false);
                    }}>
                    <div className={styles.wrapperShippingModal}>
                        <div className='content'>
                            <p>Are you sure to returns this order?</p>
                        </div>

                        <div className='btn-wrapper'>
                            <div
                                className='close'
                                onClick={() => {
                                    setReturnsId('');
                                    setReturnsModal(false);
                                }}>
                                Close
                            </div>
                            <button onClick={HANDLE.changeToReturns}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isCompletedPending ||
                (isReturnsPending && <LoadingScreen content='Loading...' />)}
        </>
    );
};

OrderShipping.displayName = 'OrderShipping';
export default OrderShipping;
