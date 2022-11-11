import Link from 'next/link'
import { useState, useEffect } from 'react'
import classes from '../styles/scss/services.module.scss'


export const Services = ({ services, isPage }) => {
    const [serviceId, setServiceId] = useState(null)

    useEffect(() => {
        if (!!services[0]) setServiceId(services[0].id)
    }, [services])

    const overHandler = e => setServiceId(e.currentTarget.id)

    return (
        <div className={classes.services}>
            {services.map((service, index) =>
                <div
                    id={service.id}
                    key={service.id}
                    className={`${classes.service} ${service.id === serviceId ? classes.service_active : ''}`}
                    onMouseOver={overHandler}>
                    <p className={classes.service__title}>{service.bannerTitle}</p>
                    <p className={classes.service__desc}>{service.description}</p>
                    {isPage && index < 2 ?
                        <div className={classes.service__btns}>
                            <Link href={`/tariffs`}>
                                <a className={`btn btn_secondary ${classes.service__btn}`}>Тарифы</a>
                            </Link>
                            <Link href={`/${service.slug}`}>
                                <a className={`btn btn_secondary ${classes.service__btn}`}>Подробнее</a>
                            </Link>
                        </div>
                        :
                        <div className={classes.service__btns}>
                            <Link href={'/registration'}>
                                <a className={`btn btn_secondary ${classes.service__btn}`}>Открыть счёт</a>
                            </Link>
                            <Link href={`/${service.slug}`}>
                                <a className={`btn btn_secondary ${classes.service__btn}`}>Подробнее</a>
                            </Link>
                        </div>
                    }
                    <Link href={`/${service.slug}`}>
                        <a className={`${classes.service__mobBtn}`}>{service.bannerTitle}</a>
                    </Link>
                </div>)}
        </div >
    )
}