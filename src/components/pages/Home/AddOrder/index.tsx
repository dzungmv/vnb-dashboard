import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import LoadingScreen from '../../../common/LoadingScreen';
import useFetch from '../../../hooks/useFetch';
import { OrderType, ProductTypes, CartType, UserTypes } from '../../../types';
import styles from './AddOrder.module.scss';

const AddOrder: React.FC = () => {
    const navigate = useNavigate();
    const user: UserTypes = useSelector((state: any) => state.user.user);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const { data, isPending, error } = useFetch(
        `${process.env.REACT_APP_API_URL}/product/get-all-product`
    );

    const products = data?.data;

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ProductTypes[]>([]);

    const [cart, setCart] = useState<CartType[]>([]);

    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [payment, setPayment] = useState<string>('cash');

    const [nameError, setNameError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');

    const [isPendingOrder, setIsPendingOrder] = useState<boolean>(false);

    const total = cart.reduce((acc, item: CartType) => {
        return acc + item.product_price * item.product_quantity;
    }, 0);

    const HANDLE = {
        search: () => {
            const searchRes = products?.filter((item: ProductTypes) => {
                return (
                    item.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    item.brand
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    item.type.toLowerCase().includes(searchValue.toLowerCase())
                );
            });

            setSearchResult(searchRes);
        },
        addToCart: (
            productId: string,
            name: string,
            price: number,
            image: string
        ) => {
            return () => {
                const newCart = [...cart];

                newCart.push({
                    productId,
                    product_name: name,
                    product_price: price,
                    product_image: image,
                    product_quantity: 1,
                });

                setCart(newCart);
                setSearchResult([]);
                setSearchValue('');
            };
        },

        removeFromCart: (productId: string) => () => {
            const newCart = [...cart];

            const index = newCart.findIndex(
                (item) => item.productId === productId
            );

            if (index !== -1) {
                newCart.splice(index, 1);
            }

            setCart(newCart);
        },

        increaseQuantity: (productId: string) => {
            const newCart = [...cart];

            const index = newCart.findIndex(
                (item) => item.productId === productId
            );

            if (index !== -1) {
                newCart[index].product_quantity += 1;
            }

            setCart(newCart);
        },

        decreaseQuantity: (productId: string) => {
            const newCart = [...cart];

            const index = newCart.findIndex(
                (item) => item.productId === productId
            );

            if (index !== -1) {
                if (newCart[index].product_quantity > 1) {
                    newCart[index].product_quantity -= 1;
                }
            }

            setCart(newCart);
        },

        setQuantity: (quantity: number, productId: string) => {
            const newCart = [...cart];

            const index = newCart.findIndex(
                (item) => item.productId === productId
            );

            if (index !== -1) {
                newCart[index].product_quantity = quantity;
            }

            setCart(newCart);
        },

        createOrder: async () => {
            if (name === '') {
                setNameError('Please enter your name');
                return;
            }

            if (phone === '') {
                setPhoneError('Please enter your phone');
                return;
            }

            const data = {
                fullname: name,
                phone,
                products: cart,
                payment,
                total,
            };

            try {
                setIsPendingOrder(true);
                const res = await axios.post(
                    `${process.env.REACT_APP_API_URL}/admin/create-order`,
                    {
                        data,
                    },
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );
                console.log(res.data);

                setIsPendingOrder(false);

                swal('Success', 'Create order successfully!', 'success').then(
                    () => {
                        navigate('/orders-delivered');
                    }
                );
            } catch (error: any) {
                setIsPendingOrder(false);
                swal('Error', 'Something went wrong!', 'error');
            }
        },
    };

    // clear search result when search value is empty
    useEffect(() => {
        if (searchValue === '') {
            setSearchResult([]);
        }
    }, [searchValue]);

    // validate form
    useEffect(() => {
        if (name !== '') {
            setNameError('');
        }

        if (phone !== '') {
            setPhoneError('');
        }
    }, [name, phone]);

    // clear search result when click outside search box
    useEffect(() => {
        // clear search result when click outside search box
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (
                searchBoxRef.current &&
                !searchBoxRef.current.contains(target)
            ) {
                setSearchResult([]);
                setSearchValue('');
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            <section className={styles.wrapperAddOrder}>
                <header className='order-header'>
                    <h3>Add order</h3>

                    <Button
                        variant='outline-success'
                        onClick={HANDLE.createOrder}
                        disabled={isPendingOrder || cart.length === 0}>
                        <i className='fa-solid fa-plus'></i>{' '}
                        <span>Add new orders</span>
                    </Button>
                </header>

                <div className='search'>
                    <div className='search-wrapper'>
                        <div className='search-action'>
                            <i className='fa-light fa-magnifying-glass-plus'></i>
                            <input
                                type='text'
                                placeholder='Search product...'
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    HANDLE.search();
                                }}
                            />
                        </div>

                        {searchResult && searchResult.length > 0 && (
                            <div ref={searchBoxRef} className='search-box'>
                                {searchResult.map((item: ProductTypes) => {
                                    return (
                                        <div
                                            key={item._id}
                                            className='search-box--item'
                                            onClick={HANDLE.addToCart(
                                                item._id,
                                                item.name,
                                                item.price,
                                                item.image
                                            )}>
                                            <figure>
                                                <Image
                                                    src={item.image}
                                                    alt='product'
                                                />
                                            </figure>
                                            <div className='info'>
                                                <p>{item.name}</p>
                                                <p>{item.price}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {cart.length > 0 ? (
                    <div className='orders'>
                        <div className='cart'>
                            {cart.map((item: CartType, index: number) => {
                                return (
                                    <div key={index} className='cart-item'>
                                        <div className='cart-info'>
                                            <figure>
                                                <Image
                                                    src={item.product_image}
                                                    alt='product'
                                                />
                                            </figure>
                                            <div className='info'>
                                                <p className='info-name'>
                                                    {item.product_name}
                                                </p>
                                                <div className='info-quantity'>
                                                    <button
                                                        className='decrease'
                                                        onClick={() =>
                                                            HANDLE.decreaseQuantity(
                                                                item.productId
                                                            )
                                                        }
                                                        disabled={
                                                            item.product_quantity ===
                                                            1
                                                        }>
                                                        <i className='fa-solid fa-minus'></i>
                                                    </button>
                                                    <input
                                                        type='text'
                                                        value={
                                                            item.product_quantity
                                                        }
                                                        onChange={(e) =>
                                                            HANDLE.setQuantity(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                                item.productId
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className='increase'
                                                        onClick={() =>
                                                            HANDLE.increaseQuantity(
                                                                item.productId
                                                            )
                                                        }>
                                                        <i className='fa-solid fa-plus'></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='cart-action'>
                                            {' '}
                                            <p>
                                                {item.product_price.toLocaleString()}{' '}
                                                ₫
                                            </p>
                                            <Button
                                                variant='outline-danger'
                                                onClick={HANDLE.removeFromCart(
                                                    item.productId
                                                )}>
                                                {' '}
                                                X{' '}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='form'>
                            <div className='form-item'>
                                <input
                                    type='text'
                                    placeholder='Name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {nameError && (
                                    <p className='form-validate'>{nameError}</p>
                                )}
                            </div>
                            <div className='form-item'>
                                <input
                                    type='text'
                                    placeholder='Phone'
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {phoneError && (
                                    <p className='form-validate'>
                                        {phoneError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='payment'>
                            <div className='payment-item'>
                                <input
                                    type='radio'
                                    id='cash'
                                    onChange={() => setPayment('cash')}
                                    checked={payment === 'cash'}
                                />
                                <label htmlFor='cash'>Cash</label>
                            </div>

                            <div className='payment-item'>
                                <input
                                    type='radio'
                                    id='banking'
                                    onChange={() => setPayment('banking')}
                                    checked={payment === 'banking'}
                                />
                                <label htmlFor='banking'>Banking</label>
                            </div>
                        </div>

                        <hr />

                        <div className='total'>
                            <span>Total:</span>
                            <p>{total.toLocaleString()} ₫</p>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            src='https://jungjung261.blob.core.windows.net/nextjs-project/VNB_SHOP/icons/null-order.svg'
                            alt='null order'
                            style={{
                                width: '500px',
                                height: '500px',
                            }}
                        />
                    </div>
                )}
            </section>

            {isPendingOrder && <LoadingScreen content='Creating order...' />}
        </>
    );
};

AddOrder.displayName = 'AddOrder';

export default AddOrder;
