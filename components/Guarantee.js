import Link from 'next/link'
import Image from 'next/image'
import classes from '../styles/scss/guarantee.module.scss'


export const Guarantee = () => {

    return (
        <section className={classes.guarantee}>
            <div className={classes.guarantee__picWrapper}>
                <div className={classes.guarantee__pic}>
                    <Image
                        src='/images/guarantee-pic.jpg'
                        alt="pic"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </div>
            </div>
            <div className={classes.guarantee__content}>
                <h3 className={classes.guarantee__title}>Гарантия надежности</h3>
                <div className={classes.guarantee__numbers}>
                    <div className={classes.guarantee__number}>
                        <p><span>420</span> млн руб.</p>
                        <p>уставной капитал</p>
                    </div>
                    <div className={classes.guarantee__number}>
                        <p><span>1996</span> год</p>
                        <p>год основания компании</p>
                    </div>
                    <div className={classes.guarantee__number}>
                        <p><span>4</span> лицензии</p>
                        <p>все основные виды деятельности</p>
                    </div>
                    <div className={classes.guarantee__number}>
                        <p><span>&gt; 1 </span> млрд руб.</p>
                        <p>активы компании на 30.06.2021</p>
                    </div>
                </div>
                <div className={classes.guarantee__bottom}>
                    <p className={classes.guarantee__desc}>Инвестиционная компания “Фондовый капитал” – успешный
                        и стабильный участник российского фондового рынка. За более чем двадцатилетнюю историю компания
                        показала себя как солидный игрок с взвешенной рыночной стратегией и положительной репутацией.</p>
                    <Link href={'/about'}>
                        <a className="btn btn_secondary">Подробнее</a>
                    </Link>
                </div>
            </div>
        </section>
    )
}