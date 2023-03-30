import React, { useRef, useCallback, LegacyRef } from 'react';

import styles from './Modal.module.scss';

type ModalTypes = {
    title: string;
    children: React.ReactNode;
    show: boolean;
    close: (value: boolean) => void;
    size?: 'small' | 'medium' | 'large' | 'auto';
    notCloseOutside?: boolean;
};

function Modal({
    title,
    children,
    show,
    close,
    size,
    notCloseOutside,
}: ModalTypes) {
    const modalRef: LegacyRef<HTMLDivElement> = useRef(null);

    // const keyProp = useCallback(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         const inputElement = e.target as HTMLInputElement;
    //         const keyValue = inputElement.value;
    //         if (keyValue === 'Escape' && show) {
    //             close(false);
    //         }
    //     },
    //     [close, show]
    // );

    // click outside modal
    const handleClickOutside = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                close(false);
            }
        },
        [close]
    );

    return (
        <>
            {show ? (
                <section
                    className={styles.wrapperModal}
                    ref={modalRef}
                    onClick={handleClickOutside}>
                    <section className={`container ${size}`}>
                        <header className='heading'>
                            <h4 className='title'>{title}</h4>
                            <span
                                className='close'
                                onClick={() => close(false)}>
                                <li className='fa-light fa-xmark'></li>
                            </span>
                        </header>
                        <section className='content'>{children}</section>
                    </section>
                </section>
            ) : null}
        </>
    );
}

export default Modal;
