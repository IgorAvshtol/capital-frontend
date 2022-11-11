import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import classes from '../styles/scss/navbar.module.scss'
import { useAppContext } from '../lib/context'
import dynamic from 'next/dynamic'



const Menu = dynamic(() => import('../components/Menu').then((mod) => mod.Menu))
const MobMenu = dynamic(() => import('../components/MobMenu').then((mod) => mod.MobMenu))


const servicesQuery = gql`query { services { title slug } }`


export const Navbar = () => {
    const { isMobMenu, toggleMobMenu } = useAppContext()
    const [isMenu, setIsMenu] = useState(false)
    const { data } = useQuery(servicesQuery)

    const moreBtnHandler = () => setIsMenu(!isMenu)

    return (
        <header className={classes.navbar}>
            <div className={classes.navbar__main}>
                <Link href={'/'}>
                    <a className={classes.navbar__logo}>
                        <Image
                            src="/images/logo.svg"
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left center"
                        />
                    </a>
                </Link>
                <Link href={'/'}>
                    <a className={classes.navbar__logo_mob}>
                        <Image
                            src="/images/logo-mob.svg"
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left center"
                        />
                    </a>
                </Link>
                <div className={classes.navbar__mainLinks}>
                    <Link href={'tel:+388002007918'}>
                        <a className={classes.navbar__tel}>8 800 200 79 18</a>
                    </Link>
                    <Link href={'https://lk.ikfk.ru/users/sign_in'}>
                        <a className={`btn btn_secondary ${classes.navbar__btn}`}>Войти</a>
                    </Link>
                    <Link href={'/registration'}>
                        <a className={`btn ${classes.navbar__btn}`}>Открыть счёт</a>
                    </Link>
                </div>
                <div className={classes.navbar__mobLinks}>
                    <Link href={'tel:+388002007918'}><a className={classes.navbar__mobTel} /></Link>
                    {data && <button className={classes.navbar__mobMenu} onClick={toggleMobMenu} />}
                </div>
            </div>
            <div className={classes.navbar__navWrapper}>
                <nav className={classes.navbar__nav}>
                    <Link href={'/categories/brokerskie-uslugi'}>
                        <a className={classes.navbar__navItem}>Брокерские услуги</a>
                    </Link>
                    <Link href={'/doveritelnoe-upravlenie'}>
                        <a className={classes.navbar__navItem}>Доверительное управление</a>
                    </Link>
                    <Link href={'/tariffs'}>
                        <a className={classes.navbar__navItem}>Тарифы</a>
                    </Link>
                    <Link href={'/training'}>
                        <a className={classes.navbar__navItem}>Обучение</a>
                    </Link>
                    <Link href={'/about'}>
                        <a className={classes.navbar__navItem}>О компании</a>
                    </Link>
                    <p
                        onClick={moreBtnHandler}
                        className={`${classes.navbar__navItem} ${classes.navbar__navItem_drop}
                        ${isMenu ? classes.navbar__navItem_active : ''}`}>
                        Еще
                    </p>
                </nav>
            </div>
            {isMenu && data && <Menu services={data.services} moreBtnHandler={moreBtnHandler} />}
            {isMobMenu && data && <MobMenu handler={toggleMobMenu} services={data.services} />}
        </header>
    )
}