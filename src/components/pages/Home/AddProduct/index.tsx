import axios from 'axios';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import LoadingScreen from '../../../common/LoadingScreen';
import Modal from '../../../common/Modal';
import { logout } from '../../../_redux/features/user';

import styles from '../Home.module.scss';

type SizesTypes = {
    size_name: string;
    quantity: number;
};

const listBranchs = [
    {
        id: 1,
        name: 'VNB',
    },
    {
        id: 2,
        name: 'Yonex',
    },
    {
        id: 3,
        name: 'Lining',
    },
    {
        id: 4,
        name: 'Kawasaki',
    },
    {
        id: 5,
        name: 'Adidas',
    },
];

const listEndows = [
    {
        id: 1,
        name: 'Free 1 pair of VNB badminton socks',
    },
    {
        id: 2,
        name: 'Free 2 Badminton Rackets: VNB 001 , VS002 or Joto 001',
    },
    {
        id: 3,
        name: 'Genuine products',
    },
    {
        id: 4,
        name: 'Payment after checking and receiving goods',
    },
    {
        id: 5,
        name: 'Genuine warranty according to the manufacturer',
    },
];

const listStores = [
    'VNB 1 District',
    'VNB 2 District',
    'VNB 3 District',
    'VNB 4 District',
    'VNB 5 District',
    'VNB 6 District',
    'VNB 7 District',
    'VNB 8 District',
    'VNB 9 District',
    'VNB 10 District',
    'VNB 11 District',
    'VNB 12 District',
];

const listProductType = [
    'Racket',
    'Shoes',
    'Shirt',
    'Skirt',
    'Pant',
    'Bag',
    'Balo',
    'Accessories',
];

const AddProduct = () => {
    const richTextModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
        ],
    };

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.user);

    const navigate = useNavigate();

    const [open, setOpen] = useState<boolean>(false);
    const [isPendingAddProduct, setIsPendingAddProduct] =
        useState<boolean>(false);

    const [brandBox, setBrandBox] = useState<boolean>(false);
    const [endowsBox, setEndowsBox] = useState<boolean>(false);
    const [storesBox, setStoresBox] = useState<boolean>(false);
    const [typeBox, setTypeBox] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [priceMarket, setPriceMarket] = useState<number>(0);
    const [type, setType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [endows, setEndows] = useState<string[]>([]);
    const [size, setSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [sizes, setSizes] = useState<SizesTypes[]>([]);
    const [stores, setStores] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');

    const HANDLE = {
        chooseEndow(endow: string) {
            if (endows.includes(endow)) {
                setEndows(endows.filter((item) => item !== endow));
            }

            if (!endows.includes(endow)) {
                setEndows([...endows, endow]);
            }
        },

        addSizes() {
            if (size === '' || quantity === 0) {
                toast.error('Please fill all fields');
            }
            if (size && quantity) {
                setSizes([...sizes, { size_name: size, quantity }]);
                setSize('');
                setQuantity(1);
                toast.success('Add size successfully');
            }
        },

        async createProduct() {
            const data = {
                name,
                image,
                price,
                price_market: priceMarket,
                type,
                brand,
                endows,
                sizes,
                stores,
                description,
            };
            try {
                setIsPendingAddProduct(true);
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/product/add-product`,
                    data,
                    {
                        headers: {
                            authorization: user?.tokens?.accessToken,
                            'x-client-id': user?.user?._id,
                        },
                    }
                );
                setIsPendingAddProduct(false);

                toast.success('Create product successfully');
                setName('');
                setImage('');
                setType('');
                setPrice(0);
                setPriceMarket(0);
                setBrand('');
                setEndows([]);
                setSizes([]);
                setStores([]);
                setDescription('');
                navigate('/');
            } catch (error) {
                toast.error('Something went wrong');
                setIsPendingAddProduct(false);
            }
        },
    };

    return (
        <>
            <section className={styles.wrapperAddProduct}>
                <header className='add-product--header'>
                    <h3 className='title'>Add new product</h3>
                    <button onClick={HANDLE.createProduct}>Add</button>
                </header>

                <div
                    className={`${styles.wrapperEditModal} add-product--content`}>
                    <div className='modal-content'>
                        <form className='modal-form'>
                            <div className='wrapper-group'>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        value={name}
                                        id='input-product-name'
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor='input-product-name'
                                        className='label'>
                                        Product name
                                    </label>
                                </div>

                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='input-image-url'
                                        value={image}
                                        onChange={(e) =>
                                            setImage(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor='input-image-url'
                                        className='label'>
                                        Image url
                                    </label>
                                </div>
                            </div>
                            <div className='wrapper-group'>
                                <div
                                    className='form-group selection'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setBrandBox((prev) => !prev);
                                    }}>
                                    <span>
                                        {brand && brand.length > 0
                                            ? brand
                                            : 'Choose branch'}
                                    </span>
                                    <i
                                        className={`fa-regular ${
                                            brandBox
                                                ? `fa-regular fa-chevron-up`
                                                : `? fa-regular fa-chevron-down`
                                        } `}></i>

                                    {brandBox && (
                                        <div className='selection-box'>
                                            {listBranchs.map((item) => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={
                                                            brand === item.name
                                                                ? 'selection-item selection-item-active'
                                                                : 'selection-item'
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setBrand(item.name);
                                                            setBrandBox(false);
                                                        }}>
                                                        {item.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className='form-group selection'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTypeBox((prev) => !prev);
                                    }}>
                                    <span>
                                        {type && type.length > 0
                                            ? type
                                            : 'Choose type'}
                                    </span>
                                    <i
                                        className={`fa-regular ${
                                            typeBox
                                                ? `fa-regular fa-chevron-up`
                                                : `? fa-regular fa-chevron-down`
                                        } `}></i>

                                    {typeBox && (
                                        <div className='selection-box'>
                                            {listProductType.map(
                                                (item, index: number) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={
                                                                type === item
                                                                    ? 'selection-item selection-item-active'
                                                                    : 'selection-item'
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setType(item);
                                                                setTypeBox(
                                                                    false
                                                                );
                                                            }}>
                                                            {item}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='wrapper-group'>
                                <div className='form-group'>
                                    <input
                                        type='number'
                                        id='input-price'
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(Number(e.target.value))
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor='input-price'
                                        className='label'>
                                        Price
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='input-price-market'
                                        value={priceMarket}
                                        onChange={(e) =>
                                            setPriceMarket(
                                                Number(e.target.value)
                                            )
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor='input-price-market'
                                        className='label'>
                                        Price maret
                                    </label>
                                </div>
                            </div>

                            <div
                                className='form-group selection endows'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEndowsBox((prev) => !prev);
                                }}>
                                <span>Choose endows</span>
                                <i
                                    className={`fa-regular ${
                                        endowsBox
                                            ? `fa-regular fa-chevron-up`
                                            : `? fa-regular fa-chevron-down`
                                    } `}></i>

                                {endowsBox && (
                                    <div className='selection-box'>
                                        {listEndows.map((endow) => {
                                            return (
                                                <div
                                                    key={endow.id}
                                                    className={
                                                        endows.includes(
                                                            endow.name
                                                        )
                                                            ? 'selection-item selection-item-active'
                                                            : 'selection-item'
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        HANDLE.chooseEndow(
                                                            endow.name
                                                        );
                                                        setEndowsBox(false);
                                                    }}>
                                                    {endow.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className='wrapper-group'>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='input-size'
                                        value={size}
                                        onChange={(e) =>
                                            setSize(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor='input-size'
                                        className='label'>
                                        Size name
                                    </label>
                                </div>
                                {size && size.length > 0 && (
                                    <div className='form-size'>
                                        <div className='form-group'>
                                            <input
                                                type='number'
                                                id='input-quantity'
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                required
                                            />
                                            <label
                                                htmlFor='input-quantity'
                                                className='label'>
                                                Quantity
                                            </label>
                                        </div>

                                        <div
                                            className='add-size'
                                            onClick={HANDLE.addSizes}>
                                            Add size
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                className='form-group selection'
                                onClick={() => {
                                    setStoresBox((prev) => !prev);
                                }}>
                                <span>Choose store</span>
                                <i
                                    className={`fa-regular ${
                                        storesBox
                                            ? `fa-regular fa-chevron-up`
                                            : `fa-regular fa-chevron-down`
                                    } `}></i>

                                {storesBox && (
                                    <div className='selection-box'>
                                        {listStores.map(
                                            (item, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            stores.includes(
                                                                item
                                                            )
                                                                ? 'selection-item selection-item-active'
                                                                : 'selection-item'
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                stores.includes(
                                                                    item
                                                                )
                                                            ) {
                                                                setStores(
                                                                    stores.filter(
                                                                        (
                                                                            store
                                                                        ) =>
                                                                            store !==
                                                                            item
                                                                    )
                                                                );
                                                            } else {
                                                                setStores([
                                                                    ...stores,
                                                                    item,
                                                                ]);
                                                            }
                                                            setStoresBox(false);
                                                        }}>
                                                        {item}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className='custom-editor'>
                                <ReactQuill
                                    theme='snow'
                                    value={description}
                                    onChange={setDescription}
                                    modules={richTextModules}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className={styles.wrapperPreview}>
                <header>
                    <h3>Preview</h3>
                </header>
                <div className='preview-container'>
                    <div className='left'>
                        <figure className='left-img'>
                            {image && image.length > 0 ? (
                                <img src={image} alt='Preview' />
                            ) : (
                                <Skeleton />
                            )}
                        </figure>

                        <div className='left-info'>
                            <h3>
                                {name && name.length > 0
                                    ? name
                                    : 'Product name'}
                            </h3>

                            <div className='branch'>
                                <p>
                                    Branch: <span>{brand}</span>
                                </p>{' '}
                                |{' '}
                                <p className='status'>
                                    Status: <span>In stock</span>
                                </p>
                            </div>

                            <div className='price'>
                                <h4 className='price-real'>
                                    {price.toLocaleString()}₫
                                </h4>
                                <span>
                                    Market price: {priceMarket.toLocaleString()}
                                    ₫
                                </span>
                            </div>

                            <div className='endow'>
                                {endows &&
                                    endows.length > 0 &&
                                    endows.map((endow) => {
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

                            <div className='sizes'>
                                <p>Choose size:</p>
                                <div className='sizes-content'>
                                    {sizes &&
                                        sizes.length > 0 &&
                                        sizes.map(
                                            (
                                                item: SizesTypes,
                                                index: number
                                            ) => {
                                                return (
                                                    <div
                                                        className='size-item'
                                                        key={index}>
                                                        <span>
                                                            {item.size_name}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='stores'>
                            {stores &&
                                stores.length > 0 &&
                                stores.map((item, index: number) => {
                                    return (
                                        <>
                                            <div
                                                className='stores-item'
                                                key={index}>
                                                {item}
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                        <div className='stores-label'>Available at:</div>
                    </div>
                </div>

                <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </section>

            {isPendingAddProduct && (
                <LoadingScreen content='Creating product...' />
            )}

            {open && (
                <Modal title={'Error'} show={open} close={() => setOpen(false)}>
                    <div className={styles.wrapperExpModal}>
                        <div className='modal-content'>
                            <p> Expried token, please login again!</p>
                        </div>

                        <div className='modal-footer'>
                            <button
                                onClick={() => {
                                    dispatch(logout());
                                    setOpen(false);
                                }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AddProduct;
