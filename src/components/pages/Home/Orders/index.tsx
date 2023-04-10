import { useEffect, useState } from 'react';

import styles from './orders.module.scss';

const AllOrders: React.FC = () => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {}, []);

    return (
        <section className={styles.wrapperOrders}>
            <h1>All orders</h1>
            <nav className='navs'></nav>
        </section>
    );
};

AllOrders.displayName = 'AllOrders';
export default AllOrders;
