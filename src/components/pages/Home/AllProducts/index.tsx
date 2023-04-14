import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';

import useFetch from '../../../hooks/useFetch';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../../common/Modal';
import { ProductTypes } from '../../../types';
import styles from '../Home.module.scss';

const AllProduct = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user.user);

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const [productId, setProductId] = useState<string>('');
    const [productName, setProductName] = useState<string>('');

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ProductTypes[]>([]);

    const { data, isPending, error } = useFetch(
        `${process.env.REACT_APP_API_URL}/product/get-all-product`
    );

    const filterDataByDate = data?.data.sort((a: any, b: any) => {
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });

    const products = filterDataByDate;

    const HANDLE = {
        search: () => {
            const result = products.filter((product: ProductTypes) => {
                return (
                    product.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    product.brand
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    product.type
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                );
            });

            setSearchResult(result);
        },
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

    useEffect(() => {
        if (searchValue === '') {
            setSearchResult([]);
        }
    }, [searchValue]);

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
                            <div className='search-action'>
                                <i className='fa-solid fa-search'></i>
                                <input
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        HANDLE.search();
                                    }}
                                />
                            </div>

                            {searchResult && searchResult.length > 0 && (
                                <div className='search-box'>
                                    {searchResult.map(
                                        (product: ProductTypes) => {
                                            return (
                                                <Link
                                                    to={`/product-details/${product.slug}`}
                                                    key={product._id}
                                                    className='search-box--item'>
                                                    <figure className='item-img'>
                                                        <img
                                                            src={product.image}
                                                            alt='product'
                                                        />
                                                    </figure>
                                                    <div className='item-name'>
                                                        {product.name}
                                                    </div>
                                                </Link>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='product-table-section'>
                        <Table hover responsive borderless>
                            <thead>
                                <tr>
                                    <th className='center'>Image</th>
                                    <th>Name</th>

                                    <th className='center'>Price</th>

                                    <th className='center'>Market price</th>
                                    <th className='center'>Brand</th>

                                    <th className='center'>Type</th>

                                    <th className='center'>Quantity</th>
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
                                    products.map((item: ProductTypes) => {
                                        return (
                                            <tr
                                                key={item._id}
                                                className='table-item'>
                                                <td className='center'>
                                                    <Image
                                                        className='table-item--avatar'
                                                        fluid
                                                        thumbnail
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

                                                <td>
                                                    <div className='action'>
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

                                                        <div
                                                            className='action-item action-item-edit'
                                                            onClick={() =>
                                                                navigate(
                                                                    `/product-details/${item.slug}`
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
