import styles from './HomeComp.module.scss';

const HomeComp: React.FC = () => {
    return (
        <section className={styles.wrapperHomeComp}>
            <header className='header'>
                <h1>
                    <i className='fa-solid fa-city'></i>
                    <span>Dashboard</span>
                </h1>
            </header>

            <div className='summary'>
                <div className='summary-item'>
                    <h3 className='heading'>New account</h3>
                    <div className='content'>
                        <p className='number'>0</p>
                        <span className='unit'>account</span>
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
                    <h3 className='heading'>New order</h3>
                    <div className='content'>
                        <p className='number'>0</p>
                        <span className='unit'>order</span>
                    </div>
                </div>

                <div className='summary-item'>
                    <h3 className='heading'>New order</h3>
                    <div className='content'>
                        <p className='number'>0</p>
                        <span className='unit'>order</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

HomeComp.displayName = 'HomePage';
export default HomeComp;
