import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { useState, useEffect } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { withApollo } from '../lib/with-qraphql'
import ideasClasses from '../styles/scss/ideas.module.scss'
import dynamic from 'next/dynamic'
import 'moment/locale/ru'


const Steps = dynamic(() => import('../components/Steps').then((mod) => mod.Steps))
const Services = dynamic(() => import('../components/Services').then((mod) => mod.Services))
const Benefits = dynamic(() => import('../components/Benefits').then((mod) => mod.Benefits))
const Training = dynamic(() => import('../components/Training').then((mod) => mod.Training))


export default function Index({ banners, services, categories, seo, ideas }) {
    const [slug, setSlug] = useState(null)
    const [filteredServices, setFilteredServices] = useState([])

    useEffect(() => {
        categories[0]?.slug && setSlug(categories[0]?.slug)
    }, [categories])

    useEffect(() => {
        const filtered = []
        for (let service of services) {
            if (service.category?.slug === slug) {
                filtered.push(service)
            }
        }
        return setFilteredServices(filtered)
    }, [slug])

    const tabHandler = e => setSlug(e.target.id)

    return (
        <MainLayout seo={{ ...seo }}>
            <section className="head">
                <div className="head-slider">
                    {banners.map(banner => {
                        const src = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${banner.picture.url}`
                        return (
                            <div className="head-slider__slide" key={banner.id}>
                                <div className="head-slider__content">
                                    <h1 className="head__title">{banner.title}</h1>
                                    <p className="head__desc">{banner.description}</p>
                                    <div className="head-slider__btns">
                                        <Link href={banner.buttons[0]?.url || '/'}>
                                            <a className="btn head__btn">{banner.buttons[0]?.title}</a>
                                        </Link>
                                        <Link href={banner.buttons[1]?.url || '/'}>
                                            <a className="btn btn_secondary head__btn">{banner.buttons[1]?.title || '/'}</a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="head-slider__pic">
                                    <Image
                                        priority
                                        alt="pic"
                                        src={src}
                                        width={525}
                                        height={475}
                                        quality={40}
                                        objectFit="contain"
                                        objectPosition="center"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <Steps />

            <section className="section" style={{ marginBottom: 0 }}>
                <h3 className="section__title">Услуги</h3>
                <ul className="section__tabs">
                    {categories.map(category =>
                        <li
                            id={category.slug}
                            key={category.slug}
                            className={`section__tab ${category.slug === slug ? 'section__tab_active' : ''}`}
                            onClick={tabHandler}>
                            {category.title}
                        </li>
                    )}
                </ul>
                <div>{filteredServices && <Services services={filteredServices} />}</div>
                <Link href={`/categories/${slug ? slug : ''}`}>
                    <a className="details-btn services-details-btn">Смотреть все услуги</a>
                </Link>
            </section>

            <Benefits title='Мы в цифрах' />

            <section className={`ideas`}>
                <h3 className={`ideas__title`}>Инвест-идеи</h3>
                <p className={`ideas__desc`}>Инвестиционные идеи от лучших аналитиков нашей компании</p>
                <div className={ideasClasses.ideas__wrap}>
                    {ideas.map((idea =>
                        <Link href={`/ideas/${idea.slug}`} key={idea.slug}>
                            <a className={ideasClasses.idea}>
                                <div className={ideasClasses.idea__wrap}>
                                    <div className={ideasClasses.idea__content}>
                                        <div className={ideasClasses.idea__head}>
                                            <div className={ideasClasses.idea__logo}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${idea.logo.url}`}
                                                    alt="pic"
                                                    layout="fill"
                                                    objectFit="contain"
                                                    objectPosition="left center" />
                                            </div>
                                            <span
                                                className={`${ideasClasses.idea__btn} 
                                                ${idea.sell && ideasClasses.idea__btn_red}`}>
                                                {idea.sell ? 'Продавать' : 'Покупать'}
                                            </span>
                                        </div>
                                        <div className={ideasClasses.idea__row}>
                                            <div className={ideasClasses.idea__key}>
                                                <p className={ideasClasses.idea__text}>Прогноз доходности</p>
                                            </div>
                                            <p
                                                className={`${ideasClasses.idea__value} 
                                                ${ideasClasses.idea__value_green}`}>
                                                {idea.forecast}
                                            </p>
                                        </div>
                                        <div className={ideasClasses.idea__row}>
                                            <div className={ideasClasses.idea__key}>
                                                <p className={ideasClasses.idea__text}>Ожидаемые сроки</p>
                                            </div>
                                            <p
                                                className={`${ideasClasses.idea__value}  
                                                ${ideasClasses.idea__value_time}`}>
                                                {idea.timing}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={ideasClasses.idea__row}>
                                        <div className={ideasClasses.idea__key}>
                                            <p className={ideasClasses.idea__name}>
                                                {idea.expert && idea.expert.username}
                                            </p>
                                            <p className={ideasClasses.idea__position}>Независимый эксперт</p>
                                        </div>
                                        <div className={ideasClasses.idea__avatar} />
                                    </div>
                                </div>
                                <p className={ideasClasses.idea__date}>
                                    <Moment locale="ru" format="D MMM YYYY">{idea.published_at}</Moment>
                                </p>
                            </a>
                        </Link>
                    ))}
                </div>
                <Link href="/ideas">
                    <a className='details-btn ideas__details-btn'>
                        Смотреть все инвестидеи
                    </a>
                </Link>
            </section>

            <Training />
        </MainLayout >
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            banners { 
                id
                title 
                description
                picture { url } 
                buttons {
                    url
                    title
                }
            } 
            services {
                id
                slug
                title
                bannerTitle
                description
                category { slug }
            }

            categories {
                id
                slug
                title
            }

            seos(where: {link: "/"}) {
                title
                description
                noindex
            }

            ideas(limit: 2) {
                slug
                name
                sell
                title
                timing
                forecast
                isActive
                published_at
                logo { url }
                expert { username }
            }
        }`
    })

    return {
        props: {
            ideas: data.ideas,
            banners: data.banners,
            services: data.services,
            categories: data.categories,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}