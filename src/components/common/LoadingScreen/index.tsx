import React from 'react';
import styles from './LoadingSC.module.scss';

const Animation = require('react-reveal/Flip');

type Props = {
    content: string;
};
const LoadingScreen: React.FC<Props> = (props): JSX.Element => {
    return (
        <section className={styles.wrapperLoadingSC}>
            <Animation left forever cascade>
                <p className='content'>{props.content}</p>
            </Animation>
        </section>
    );
};

export default LoadingScreen;
