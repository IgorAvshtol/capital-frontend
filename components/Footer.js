import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import classes from '../styles/scss/footer.module.scss'


const servicesQuery = gql`
query { 
    services(sort: "title:asc") { 
        title 
        slug 
    } 
}`


export const Footer = () => {
    const [navId, setNavId] = useState('1')
    const { data } = useQuery(servicesQuery)

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    const navHandler = e => {
        setNavId(e.currentTarget.id)
    }

    return (
        <footer className={classes.footer}>
            <div className={classes.footer__header}>
                <Link href={'/'}>
                    <a className={classes.footer__logo}>
                        <Image
                            src="/images/logo.svg"
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left center"
                        />
                    </a>
                </Link>
                <div
                    onClick={scrollToTop}
                    className={classes.footer__topBtn} />

            </div>
            <div className={classes.footer__navWrapper}>
                <nav className={`${classes.footer__nav} 
                    ${navId === "1" ? classes.footer__nav_active : ''}`}>
                    <p
                        id="1"
                        className={classes.footer__navTitle}
                        onClick={navHandler}>
                        Услуги
                    </p>
                    <div className={`${classes.footer__navItems}`}>
                        {data && data.services && data.services.map((service) =>
                            <Link href={`/${service.slug}`} key={service.slug}>
                                <a className={classes.footer__navItem}>{service.title}</a>
                            </Link>
                        )}
                    </div>
                </nav>

                <nav className={`${classes.footer__nav} 
                    ${navId === '2' ? classes.footer__nav_active : ''}`}>
                    <p
                        id="2"
                        className={classes.footer__navTitle}
                        onClick={navHandler}>
                        О нас
                    </p>
                    <div className={`${classes.footer__navItems}`}>
                        <Link href={'/about'}>
                            <a className={classes.footer__navItem}>О компании</a>
                        </Link>
                        <Link href={'/business'}>
                            <a className={classes.footer__navItem}>Бизнес-модель</a>
                        </Link>
                        <Link href={'/media'}>
                            <a className={classes.footer__navItem}>Мы в СМИ</a>
                        </Link>
                        <Link href={'/licenses'}>
                            <a className={classes.footer__navItem}>Лицензии</a>
                        </Link>
                        <Link href={'/raskrytie-informatsii'}>
                            <a className={classes.footer__navItem}>Раскрытие информации</a>
                        </Link>
                        <Link href={'/contacts'}>
                            <a className={classes.footer__navItem}>Контакты</a>
                        </Link>
                    </div>
                </nav>

                <nav className={`${classes.footer__nav} 
                    ${navId === '3' ? classes.footer__nav_active : ''}`}>
                    <p
                        id="3"
                        className={classes.footer__navTitle}
                        onClick={navHandler}>
                        Информация
                    </p>
                    <div className={`${classes.footer__navItems}`}>
                        <Link href={'/tariffs'}>
                            <a className={classes.footer__navItem}>Тарифы</a>
                        </Link>
                        <Link href={'/ideas'}>
                            <a className={classes.footer__navItem}>Инвестидеи</a>
                        </Link>
                        <Link href={'/training'}>
                            <a className={classes.footer__navItem}>Обучение</a>
                        </Link>
                        <Link href={'/questions'}>
                            <a className={classes.footer__navItem}>Вопросы и ответы</a>
                        </Link>
                        <Link href={'/blog'}>
                            <a className={classes.footer__navItem}>Блог, новости и аналитика</a>
                        </Link>
                        <Link href={'/korporativnyye-deystviya'}>
                            <a className={classes.footer__navItem}>Корпоративные действия</a>
                        </Link>
                    </div>
                </nav>
            </div>
            <div className={`${classes.footer__text}`}>
                <p
                    id="info"
                    className={`${classes.footer__navTitle} 
                    ${navId === 'info' && classes.footer__navTitle_active}`}
                    onClick={navHandler}>
                    Правовая информация
                </p>
                <div className={`${classes.footer__textWrap}
                ${navId === 'info' && classes.footer__textWrap_active}`}>
                    <p>Лицензия на осуществление брокерской деятельности №045-10738-100000 от 13.11.2007. Выдана ФСФР России. Без ограничения срока действия.<br />
                        Лицензия на осуществление деятельности по управлению ценными бумагами №045-13475-001000 от 21.03.2013. Выдана ФСФР России. Без ограничения срока действия.<br />
                        Лицензия на осуществление депозитарной деятельности №045-13746-000100 от 21.03.2013. Выдана ФСФР России. Без ограничения срока действия.<br />
                        Лицензия на осуществление дилерской деятельности №045-10740-010000 от 13.11.2007. Выдана ФСФР России. Без ограничения срока действия.</p>
                    <Link href="https://cbr.ru/finorg/foinfo/?ogrn=1027700441196">
                        <a
                            rel="nofollow"
                            target="_blank"
                            className={classes.footer__qr}>
                            <Image
                                src="/images/qr.png"
                                alt="qr"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="center"
                            />
                        </a>
                    </Link>
                </div>
                <div className={`${classes.footer__textWrap}
                ${navId === 'info' && classes.footer__textWrap_active}`}>
                    <p>Представленная информация не является индивидуальной инвестиционной рекомендацией, ни при каких условиях,
                        в том числе при внешнем совпадении её содержания с требованиями нормативно-правовых актов,
                        предъявляемых к индивидуальной инвестиционной рекомендации.
                        Любое сходство представленной информации с индивидуальной инвестиционной рекомендацией является случайным.
                        Какие-либо из указанных финансовых инструментов или операций могут не соответствовать вашему инвестиционному профилю.
                        Упомянутые в представленном сообщении операции и (или) финансовые инструменты ни при каких обстоятельствах не гарантируют доход,
                        на который вы, возможно, рассчитываете, при условии использования предоставленной информации для принятия инвестиционных решений.
                        Инвестиционная компания не несёт ответственности за возможные убытки инвестора в случае совершения операций либо инвестирования в финансовые инструменты,
                        упомянутые в представленной информации. Во всех случаях определение соответствия финансового инструмента либо операции инвестиционным целям,
                        инвестиционному горизонту и толерантности к риску является задачей инвестора.<br /><br />
                        Обращения (жалобы) в ИК «ФОНДОВЫЙ КАПИТАЛ» могут быть направлены в бумажном или электронном виде по адресам,
                        указанным на сайте в разделе Контакты.<br /><br />
                        Использование материалов сайта возможно только с письменного разрешения правообладателя.</p>
                </div>
            </div>
            <div className={classes.footer__copyright}>
                <p className={classes.footer__copyrightText}>©1996 - 2021 АО ИК «ФОНДОВЫЙ КАПИТАЛ»</p>
                <ul className={classes.footer__social}>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://zen.yandex.ru/ikfk'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-zen.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://vk.com/ikfk_journal'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-vk.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://www.facebook.com/Инвестиционная-компания-Фондовый-Капитал-105976578349981'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-facebook.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://www.instagram.com/ikfk_company'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-instagram.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://www.youtube.com/channel/UCE5iz_En-W8RYS463JokTtg'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-youtube.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={classes.footer__socialItem}>
                        <Link href={'https://t.me/fondkapital'}>
                            <a
                                target="_blank"
                                className={classes.footer__socialIcon}>
                                <Image
                                    src="/images/ic-tg.svg"
                                    alt="facebook"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </footer >
    )
}