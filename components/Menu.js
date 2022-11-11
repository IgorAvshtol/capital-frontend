import Link from 'next/link'
import classes from '../styles/scss/navbar.module.scss'


export const Menu = ({ services, moreBtnHandler }) => {
    return (
        <div className={classes.menu} onMouseLeave={moreBtnHandler}>
            <div className={classes.menu__wrap}>
                <nav className={classes.menu__nav}>
                    <p className={classes.menu__navTitle}>Услуги</p>
                    {services && services.map(service =>
                        <Link href={`/${service.slug}`} key={service.slug}>
                            <a className={classes.menu__navItem}>{service.title}</a>
                        </Link>
                    )}
                </nav>
                <nav className={classes.menu__nav}>
                    <p className={classes.menu__navTitle}>О нас</p>
                    <Link href={'/about'}>
                        <a className={classes.menu__navItem}>О компании</a>
                    </Link>
                    <Link href={'/business'}>
                        <a className={classes.menu__navItem}>Бизнес-модель</a>
                    </Link>
                    <Link href={'/media'}>
                        <a className={classes.menu__navItem}>Мы в СМИ</a>
                    </Link>
                    <Link href={'/licenses'}>
                        <a className={classes.menu__navItem}>Лицензии</a>
                    </Link>
                    <Link href={'/raskrytie-informatsii'}>
                        <a className={classes.menu__navItem}>Раскрытие информации</a>
                    </Link>
                    <Link href={'/contacts'}>
                        <a className={classes.menu__navItem}>Контакты</a>
                    </Link>
                </nav>
                <nav className={classes.menu__nav}>
                    <p className={classes.menu__navTitle}>Информация</p>
                    <Link href={'/tariffs'}>
                        <a className={classes.menu__navItem}>Тарифы</a>
                    </Link>
                    <Link href={'/ideas'}>
                        <a className={classes.menu__navItem}>Инвестидеи</a>
                    </Link>
                    <Link href={'/training'}>
                        <a className={classes.menu__navItem}>Обучение</a>
                    </Link>
                    <Link href={'/questions'}>
                        <a className={classes.menu__navItem}>Вопросы и ответы</a>
                    </Link>
                    <Link href={'/blog'}>
                        <a className={classes.menu__navItem}>Блог, новости и аналитика</a>
                    </Link>
                    <Link href={'/korporativnyye-deystviya'}>
                        <a className={classes.menu__navItem}>Корпоративные действия</a>
                    </Link>
                </nav>
            </div>
        </div>
    )
}