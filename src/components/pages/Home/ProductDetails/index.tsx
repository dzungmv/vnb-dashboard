import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { ProductTypes, UserTypes } from '../../../types';
import { logout } from '../../../_redux/features/user';
import styles from '../Home.module.scss';
import style from './ProductDetails.module.scss';

const ProductDetails: React.FC = () => {
    const user: UserTypes = useSelector((state: any) => state.user.user);

    const { slug } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isPending, setIsPending] = useState<boolean>(false);

    const [product, setProduct] = useState<ProductTypes>({} as ProductTypes);

    useEffect(() => {
        (async () => {
            try {
                setIsPending(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/product/get-product/${slug}`
                );

                setProduct(response?.data?.data);
                setIsPending(false);
            } catch (error) {
                toast.error('Something went wrong!');
                setIsPending(false);
            }
        })();
    }, [slug]);

    const deleteProduct = async () => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/product/delete-product/${product._id}`,
                {
                    headers: {
                        authorization: user?.tokens?.accessToken,
                        'x-client-id': user?.user?._id,
                    },
                }
            );
            swal({
                title: 'Delete product successfully!',
                icon: 'success',
            }).then(() => {
                navigate('/products');
            });
        } catch (error: any) {
            toast.error('Some thing went wrong!');

            if (error?.response?.status === 401) {
                dispatch(logout());
            }
        }
    };
    return (
        <section className={style.wrapperProductDetails}>
            <header className='header-wrap'>
                <h3>Product details</h3>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                    }}>
                    <Button variant='outline-danger' onClick={deleteProduct}>
                        <i className='fas fa-trash'></i> Delete product
                    </Button>
                    <Button
                        variant='outline-primary'
                        onClick={() => navigate(`/edit-product/${slug}`)}>
                        <i className='fas fa-pencil'></i> Edit product
                    </Button>
                </div>
            </header>

            {isPending ? (
                <Skeleton height={200} count={2} />
            ) : (
                <>
                    <div className={styles.wrapperPreview}>
                        <div className='preview-container'>
                            <div className='left'>
                                <figure className='left-img'>
                                    {product.image &&
                                    product.image.length > 0 ? (
                                        <img
                                            src={product.image}
                                            alt='Preview'
                                        />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </figure>

                                <div className='left-info'>
                                    <h3>
                                        {product.name && product.name.length > 0
                                            ? product.name
                                            : 'Product name'}
                                    </h3>

                                    <div className='branch'>
                                        <p>
                                            Branch: <span>{product.brand}</span>
                                        </p>{' '}
                                        |{' '}
                                        <p className='status'>
                                            Status: <span>In stock</span>
                                        </p>
                                    </div>

                                    <div className='price'>
                                        <h4 className='price-real'>
                                            {product?.price?.toLocaleString()}₫
                                        </h4>
                                        <span>
                                            Market price:{' '}
                                            {product?.price_market?.toLocaleString()}
                                            ₫
                                        </span>
                                    </div>

                                    <div className='endow'>
                                        {product?.endows &&
                                            product.endows.length > 0 &&
                                            product.endows.map((endow) => {
                                                return (
                                                    <div
                                                        className='endow-item'
                                                        key={endow}>
                                                        <i className='fas fa-check'></i>
                                                        <span>{endow}</span>
                                                    </div>
                                                );
                                            })}

                                        <div className='endow-icon'>
                                            <i className='fa-solid fa-gift'></i>
                                            <span>Endows</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='right'>
                                <div className='stores'>
                                    {product.stores &&
                                        product.stores.length > 0 &&
                                        product.stores.map(
                                            (item, index: number) => {
                                                return (
                                                    <>
                                                        <div
                                                            className='stores-item'
                                                            key={index}>
                                                            {item}
                                                        </div>
                                                    </>
                                                );
                                            }
                                        )}
                                </div>
                                <div className='stores-label'>
                                    Available at:
                                </div>
                            </div>
                        </div>

                        <div
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}></div>
                    </div>
                </>
            )}
        </section>
    );
};

ProductDetails.displayName = 'ProductDetails';
export default ProductDetails;
