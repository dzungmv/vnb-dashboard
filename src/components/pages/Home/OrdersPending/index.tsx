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

const OrdersPending: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user: UserTypes = useSelector((state: any) => state.user.user);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [detailsModal, setDetailsModal] = useState<boolean>(false);
    const [products, setProducts] = useState<CartType[]>([]);

    const [shippingModal, setShippingModal] = useState<boolean>(false);
    const [shippingId, setShippingId] = useState<string>('');
    const [isShippingPending, setIsShippingPending] = useState<boolean>(false);

    const [cancelledModal, setCancelledModal] = useState<boolean>(false);
    const [cancelledId, setCancelledId] = useState<string>('');
    const [isCancelledPending, setIsCancelledPending] =
        useState<boolean>(false);

    const mergeData = data?.map((item: any) => {
        return item?.orders?.map((order: any) => {
            return {
                ...order,
            };
        });
    });

    const flattenData = mergeData?.flat();

    const pedingData = flattenData?.filter(
        (item: OrderType) => item?.status === 'pending'
    );

    const finalData = pedingData?.sort((x: OrderType, y: OrderType) => {
        return new Date(x.updatedAt) < new Date(y.updatedAt) ? 1 : -1;
    });

    const HANDLE = {
        openDetailsModal: (products: CartType[]) => {
            setProducts(products);
            setDetailsModal(true);
        },
        openShippingModal: (id: string) => {
            setShippingId(id);
            setShippingModal(true);
        },
        openCancelledModal: (id: string) => {
            setCancelledId(id);
            setCancelledModal(true);
        },

        changeToShipping: async () => {
            try {
                setIsShippingPending(true);
                axios.patch(
                    `${process.env.REACT_APP_API_URL}/admin/update-order/${shippingId}`,
                    {
                        status: 'shipping',
                    },
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );

                setIsShippingPending(false);
                setShippingModal(false);
                swal({
                    title: 'Success',
                    text: 'Order status changed to shipping',
                    icon: 'success',
                }).then(() => {
                    navigate('/orders-shipping');
                });
            } catch (error) {
                console.log(error);
                setIsShippingPending(false);
            }
        },

        changeToCancelled: async () => {
            try {
                setIsCancelledPending(true);
                await axios.patch(
                    `${process.env.REACT_APP_API_URL}/admin/update-order/${cancelledId}`,
                    {
                        status: 'cancelled',
                    },
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );

                setIsCancelledPending(false);
                setCancelledModal(false);
                swal({
                    title: 'Success',
                    text: 'Order status changed to cancelled',
                    icon: 'success',
                }).then(() => {
                    navigate('/orders-cancelled');
                });
            } catch (error: any) {
                setIsCancelledPending(false);
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
                <h1>Orders pending</h1>
                <div className='content'>
                    {finalData && finalData.length > 0 ? (
                        <div className='product-table-section'>
                            <Table hover responsive borderless>
                                <thead>
                                    <tr className=''>
                                        <th className='center'>Orderer</th>
                                        <th className=''>Phone number</th>

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
                                                                'pending' &&
                                                            'center pending'
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

                                                            <div className='action-wrapper'>
                                                                <div
                                                                    className='action-item action-item-shipping'
                                                                    onClick={() =>
                                                                        HANDLE.openShippingModal(
                                                                            item._id
                                                                        )
                                                                    }>
                                                                    Shipping
                                                                </div>

                                                                <div
                                                                    className='action-item action-item-delete'
                                                                    onClick={() =>
                                                                        HANDLE.openCancelledModal(
                                                                            item._id
                                                                        )
                                                                    }>
                                                                    Cancel
                                                                </div>
                                                            </div>
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

            {shippingModal && (
                <Modal
                    title='Change order to shipping'
                    show={shippingModal}
                    close={() => {
                        setShippingId('');
                        setShippingModal(false);
                    }}>
                    <div className={styles.wrapperShippingModal}>
                        <div className='content'>
                            {/* <p>{shippingId}</p> */}
                            <p>
                                Are you sure to change this order to shipping?
                            </p>
                        </div>

                        <div className='btn-wrapper'>
                            <div
                                className='close'
                                onClick={() => {
                                    setShippingId('');
                                    setShippingModal(false);
                                }}>
                                Close
                            </div>
                            <button onClick={HANDLE.changeToShipping}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {cancelledModal && (
                <Modal
                    title='Change order to cancelled'
                    show={cancelledModal}
                    close={() => {
                        setCancelledId('');
                        setCancelledModal(false);
                    }}>
                    <div className={styles.wrapperShippingModal}>
                        <div className='content'>
                            <p>Are you sure to cancel this order?</p>
                        </div>

                        <div className='btn-wrapper'>
                            <div
                                className='close'
                                onClick={() => {
                                    setCancelledId('');
                                    setCancelledModal(false);
                                }}>
                                Close
                            </div>
                            <button onClick={HANDLE.changeToCancelled}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isShippingPending ||
                (isCancelledPending && <LoadingScreen content='Loading...' />)}
        </>
    );
};

OrdersPending.displayName = 'OrdersPending';
export default OrdersPending;
