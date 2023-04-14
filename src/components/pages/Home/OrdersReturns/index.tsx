import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../common/Modal';
import { CartType, OrderType, UserTypes } from '../../../types';
import { logout } from '../../../_redux/features/user';

import styles from './orders.module.scss';

const OrderReturns: React.FC = () => {
    const dispatch = useDispatch();
    const user: UserTypes = useSelector((state: any) => state.user.user);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [detailsModal, setDetailsModal] = useState<boolean>(false);
    const [products, setProducts] = useState<CartType[]>([]);

    const mergeData = data?.map((item: any) => {
        return item?.orders?.map((order: any) => {
            return {
                ...order,
            };
        });
    });

    const flattenData = mergeData?.flat();

    const completedData = flattenData?.filter((item: OrderType) => {
        return item.status === 'returns';
    });

    const finalData = completedData?.sort((x: OrderType, y: OrderType) => {
        return new Date(x.updatedAt) < new Date(y.updatedAt) ? 1 : -1;
    });

    const HANDLE = {
        openDetailsModal: (products: CartType[]) => {
            setProducts(products);
            setDetailsModal(true);
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
                <h1>Orders returns</h1>
                <div className='content'>
                    {finalData && finalData.length > 0 ? (
                        <div className='product-table-section'>
                            <Table hover responsive borderless>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th className=' center'>Orderer</th>
                                        <th className=' center'>Phone</th>

                                        <th className=' center'>Payment</th>

                                        <th className=' center'>Address</th>
                                        <th className=' center'>Status</th>

                                        <th className=' center'>Total</th>
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
                                                    <td>
                                                        {moment(
                                                            item.updatedAt
                                                        ).format('lll')}
                                                    </td>
                                                    <td className='center'>
                                                        {item.fullname}
                                                    </td>
                                                    <td className='center'>
                                                        {item.phone}
                                                    </td>
                                                    <td className='center'>
                                                        {item.payment}
                                                    </td>

                                                    <td className='center'>
                                                        {item.address}
                                                    </td>
                                                    <td
                                                        className={
                                                            item.status ===
                                                                'returns' &&
                                                            'center returns'
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
        </>
    );
};

OrderReturns.displayName = 'OrderReturns';
export default OrderReturns;
