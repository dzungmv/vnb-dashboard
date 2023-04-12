import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import useFetch from '../../../hooks/useFetch';

import { useSelector } from 'react-redux';
import { ProductTypes } from '../../../types';
import styles from '../Home.module.scss';
import { useState } from 'react';
import Modal from '../../../common/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';

const AllProduct = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user.user);

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const [productId, setProductId] = useState<string>('');
    const [productName, setProductName] = useState<string>('');

    const { data, isPending, error } = useFetch(
        `${process.env.REACT_APP_API_URL}/product/get-all-product`
    );

    const filterDataByDate = data?.data.sort((a: any, b: any) => {
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });

    const songs = filterDataByDate;

    const HANDLE = {
        deleteProduct: async () => {
            try {
                await axios.delete(
                    `${process.env.REACT_APP_API_URL}/product/delete-product/${productId}`,
                    {
                        headers: {
                            authorization: user.tokens.accessToken,
                            'x-client-id': user.user.id,
                        },
                    }
                );
                toast.success('Delete product success!');
                setOpenModalDelete(false);
                navigate(0);
            } catch (error) {
                toast.error('Some thing went wrong!');
            }
        },
    };

    if (error) return <div>{error}</div>;

    return (
        <>
            <section className={styles.wrapperAllProduct}>
                <header className='product-header'>
                    <h2 className='product-header--title'>All products</h2>
                    <div className='product-header--right'>
                        <div
                            className='add-product'
                            onClick={() => navigate('/add-product')}>
                            <i className='fa-solid fa-plus'></i>
                            <span>Add new product</span>
                        </div>
                    </div>
                </header>

                <section className='product-content'>
                    <div className='product-content--header'>
                        <h3 className='title'>Current product</h3>
                        <div className='search'>
                            <i className='fa-solid fa-search'></i>
                            <input />
                        </div>
                    </div>

                    <div className='product-table-section'>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>

                                    <th>Price</th>

                                    <th>Market price</th>
                                    <th>Brand</th>

                                    <th>Type</th>

                                    <th>Quantity</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
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
                                    songs.map((item: ProductTypes) => {
                                        return (
                                            <tr
                                                key={item._id}
                                                className='table-item'>
                                                <td>
                                                    <img
                                                        className='table-item--avatar'
                                                        src={item.image}
                                                        alt='avatar'
                                                        loading='lazy'
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>
                                                    {item.price.toLocaleString()}
                                                </td>

                                                <td>
                                                    {item.price_market.toLocaleString()}
                                                </td>
                                                <td>{item.brand}</td>
                                                <td>{item.type}</td>

                                                <td>{item.quantity}</td>

                                                <td className='action'>
                                                    <div
                                                        className='action-item action-item-edit'
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit-product/${item.slug}`
                                                            )
                                                        }>
                                                        Edit
                                                    </div>
                                                    <div
                                                        className='action-item action-item-delete'
                                                        onClick={() => {
                                                            setOpenModalDelete(
                                                                true
                                                            );
                                                            setProductId(
                                                                item._id
                                                            );
                                                            setProductName(
                                                                item.name
                                                            );
                                                        }}>
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </Table>
                        {/* <table id='table-product'>
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header--col1 center'>
                                        Image
                                    </th>
                                    <th>Product name</th>

                                    <th className='table-header--col1 center'>
                                        Price
                                    </th>

                                    <th className='table-header--col1 center'>
                                        Market price
                                    </th>
                                    <th className='table-header--col1 center'>
                                        Brand
                                    </th>

                                    <th className='table-header--col1 center'>
                                        Type
                                    </th>

                                    <th className='table-header--col1 center'>
                                        Quantity
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
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
                                    songs.map((item: ProductTypes) => {
                                        return (
                                            <tr
                                                key={item._id}
                                                className='table-item'>
                                                <td className='center'>
                                                    <img
                                                        className='table-item--avatar'
                                                        src={item.image}
                                                        alt='avatar'
                                                        loading='lazy'
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td className='center'>
                                                    {item.price.toLocaleString()}
                                                </td>

                                                <td className='center'>
                                                    {item.price_market.toLocaleString()}
                                                </td>
                                                <td className='center'>
                                                    {item.brand}
                                                </td>
                                                <td className='center'>
                                                    {item.type}
                                                </td>

                                                <td className='center'>
                                                    {item.quantity}
                                                </td>

                                                <td className='action'>
                                                    <div
                                                        className='action-item action-item-edit'
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit-product/${item.slug}`
                                                            )
                                                        }>
                                                        Edit
                                                    </div>
                                                    <div
                                                        className='action-item action-item-delete'
                                                        onClick={() => {
                                                            setOpenModalDelete(
                                                                true
                                                            );
                                                            setProductId(
                                                                item._id
                                                            );
                                                            setProductName(
                                                                item.name
                                                            );
                                                        }}>
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table> */}
                    </div>
                </section>
            </section>

            {openModalDelete && (
                <Modal
                    title='Delete Song'
                    show={openModalDelete}
                    close={() => {
                        setOpenModalDelete(false);
                        setProductId('');
                        setProductName('');
                    }}
                    size='auto'>
                    <section className={styles.wrapperDeleteModal}>
                        <div className='modal-content'>
                            <h4 className='title'>
                                Are you sure delete this song?
                            </h4>
                            <p className='description'>{productName}</p>
                        </div>

                        <div className='modal-footer'>
                            <div
                                className='close'
                                onClick={() => {
                                    setOpenModalDelete(false);
                                    setProductId('');
                                    setProductName('');
                                }}>
                                Close
                            </div>
                            <button onClick={HANDLE.deleteProduct}>
                                Delete
                            </button>
                        </div>
                    </section>
                </Modal>
            )}
        </>
    );
};

export default AllProduct;
