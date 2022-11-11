import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'
import classes from '../styles/scss/training.module.scss'


export const Training = () => {

    const clickHandler = () => {
        Router.push(
            'training/kak-nachat-investirovat',
            undefined,
            { shallow: true }
        )
    }

    return (
        <section className={classes.training}>
            <h3 className={classes.training__title}>Обучение</h3>
            <p className={classes.training__desc}>
                Улучшите свою финансовую грамотность с помощью обучающих материалов
            </p>
            <div
                onClick={clickHandler}
                style={{ cursor: 'pointer' }}
                className={classes.training__contentWrapper}>
                <div className={classes.training__content}>
                    <span className={classes.training__contentTag}>Модуль 1</span>
                    <p className={classes.training__contentTitle}>Как начать инвестировать</p>
                    <p className={classes.training__contentDesc}>
                        Рассказываем, как открыть брокерский счёт и получить доступ к фондовому рынку.
                    </p>
                </div>
                <div className={classes.training__picWrapper}>
                    <div className={classes.training__pic}>
                        <Image
                            src="/images/training-pic.png"
                            alt="pic"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="top center"
                        />
                    </div>
                </div>
            </div>
            <Link href={'/training'}>
                <a className={`details-btn ${classes.training__detailsBtn}`}>
                    Смотреть все уроки
                </a>
            </Link>
        </section>
    )
}