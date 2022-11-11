import Image from 'next/image'
import { gql } from '@apollo/client'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import serviceClasses from '../styles/scss/service.module.scss'
import classes from '../styles/scss/tariffs.module.scss'
import { withApollo } from '../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../components/Feedback').then((mod) => mod.Feedback))


export default function Tariffs({ tariffs, stock, seo, refill, slug, tabs, contacts }) {
    const [isTabs, setIsTabs] = useState(false)
    const [tariffTitle, setTariffTitle] = useState(null)

    useEffect(() => {
        for (let tab of tabs) {
            if (tab.slug === slug)
                return setTariffTitle(tab.title)
            setTariffTitle('Все')
        }
    }, [tariffs])

    const tabHandler = e => {
        setIsTabs(false)

        Router.push({
            pathname: '/tariffs',
            query: e.target.id ? { slug: e.target.id } : null
        })
    }

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.tariffs}>
                <h3 className={classes.tariffs__title}>Тарифы</h3>
                <div className={classes.dropdown}>
                    <p
                        onClick={() => setIsTabs(true)}
                        className={classes.dropdown__title} >
                        {tariffTitle}
                    </p>

                    <ul className={`${classes.tariffs__tabs} ${isTabs && classes.tariffs__tabs_active}`}>
                        {tabs.map(tab =>
                            <li
                                id={tab.slug}
                                key={tab.slug}
                                className={`${classes.tariffs__tab} 
                                ${tab.slug === slug && classes.tariffs__tab_active}`}
                                onClick={tabHandler}>
                                {tab.title}
                            </li>
                        )}
                    </ul>

                </div>
                <div className={classes.tariffs__wrap}>
                    {tariffs.map(item => item && slug === null || item.slug === slug ?
                        item.tariffs.map(tariff =>
                            <div className={classes.tariff} key={tariff.id}>
                                <p className={classes.tariff__title}>{tariff.title}</p>
                                <p className={classes.tariff__desc}
                                    dangerouslySetInnerHTML={{ __html: tariff.description }} />
                                <p className={classes.tariff__price}>{tariff.price}</p>
                            </div>
                        ) : null
                    )}
                </div>
            </section>

            {refill && <section className={classes.how}>
                <div className={classes.how__content}>
                    <h3 className={classes.how__title}>{refill.title}</h3>
                    <div className={classes.how__steps}>
                        {refill.steps.map((step, index) => {
                            return (
                                <div className={classes.how__step} key={index}>
                                    <p className={classes.how__stepNum}>0{index + 1}</p>
                                    <div>
                                        <p className={classes.how__stepTitle}>{step.key}</p>
                                        <p>{step.value}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={classes.how__cover} />
            </section>}

            <section className={serviceClasses.capital}>
                <div className={serviceClasses.capital__content}>
                    <h3 className={serviceClasses.capital__title}>{stock.title}</h3>
                    <p className={serviceClasses.capital__desc}>{stock.description}</p>
                    <div className={serviceClasses.capital__numbers}>
                        {stock.details.map((detail, index) =>
                            <div className={serviceClasses.capital__number} key={index}>
                                <p className={serviceClasses.capital__numberTitle}>{detail.key}</p>
                                <p className={serviceClasses.capital__numberDesc}>{detail.value}</p>
                            </div>
                        )}
                    </div>
                    <div className={serviceClasses.capital__quote}
                        dangerouslySetInnerHTML={{ __html: stock.cta }} />
                </div>
                <div className={serviceClasses.capital__picWrapper}>
                    <div className={serviceClasses.capital__pic}>
                        <Image
                            src="/images/capital-pic.png"
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="120px 0"
                        />
                    </div>
                </div>
            </section>
            <Feedback contacts={contacts} />
        </MainLayout>
    )
}


export async function getServerSideProps({ res, query, resolvedUrl }) {
    if (!query.slug) {
        return {
            redirect: {
                permanent: false,
                destination: "/tariffs?slug=brokerskie-uslugi"
            }
        }
    }
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            tariffs ${query.slug ? `(where: {slug: "${query.slug}"})` : ""}{ 
                id
                slug
                title
                tariffs {
                    id
                    title
                    description
                    price
                }
            }

            tariffsConnection {
                values {
                    slug
                    title
                  } 
            }

            stock {
                title
                description
                details { key value }
                cta
            }

            seos(where: {link: "${decodeURI(resolvedUrl)}"}) {
                title
                description
                noindex
            }

            refill {
                title
                steps { key value }
            }

            contact {
                phones {
                    url
                    title
                }
                emails {
                    url
                    title
                }
                adresses {
                    string
                }
                location {
                    lat
                    lng
                }
            }
        }`
    })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            stock: data.stock,
            tariffs: data.tariffs,
            contacts: data.contact,
            slug: query.slug || null,
            seo: data.seos[0] || null,
            refill: data.refill || null,
            tabs: data.tariffsConnection.values
        }
    }
}