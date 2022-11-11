import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { MainLayout } from '../../layouts/MainLayout'
import { Feedback } from '../../components/Feedback'
import classes from '../../styles/scss/ideas.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import 'moment/locale/ru'


export default function Ideas({ ideas, seo, contacts }) {
    const [isActive, setIsActive] = useState(null)

    const tabHandler = e => {
        const active = e.target.getAttribute('data-active')
        setIsActive(!!active)
    }

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.ideas}>
                <h3 className={classes.ideas__title}>Инвестидеи</h3>
                <p className={classes.ideas__desc}>
                    Значимые движения на фондовом рынке.
                    Актуальные инвестиционные идеи от аналитиков АО ИК «Фондовый Капитал».
                </p>
                <ul className={`${classes.ideas__tabs}`}>
                    <li
                        onClick={() => setIsActive(null)}
                        className={`${classes.ideas__tab} 
                        ${isActive === null && classes.ideas__tab_active}`}>
                        Все
                    </li>
                    <li
                        data-active
                        onClick={tabHandler}
                        className={`${classes.ideas__tab} 
                        ${isActive === true && classes.ideas__tab_active}`}>
                        Активные
                    </li>
                    <li
                        onClick={tabHandler}
                        className={`${classes.ideas__tab} 
                        ${isActive === false && classes.ideas__tab_active}`}>
                        Завершённые
                    </li>
                </ul>
                <div className={classes.ideas__wrap}>
                    {ideas.map(idea => {
                        if (isActive === null | idea.isActive === isActive) {
                            return (
                                <Link href={`/ideas/${idea.slug}`} key={idea.slug}>
                                    <a className={classes.idea}>
                                        <div className={classes.idea__wrap}>
                                            <div className={classes.idea__content}>
                                                <div className={classes.idea__head}>
                                                    <div className={classes.idea__logo}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${idea.logo.url}`}
                                                            alt="pic"
                                                            layout="fill"
                                                            objectFit="contain"
                                                            objectPosition="left center" />
                                                    </div>
                                                    <span className={`${classes.idea__btn} ${idea.sell && classes.idea__btn_red}`}>
                                                        {idea.sell ? 'Продавать' : 'Покупать'}</span>
                                                </div>
                                                <div className={classes.idea__row}>
                                                    <div className={classes.idea__key}>
                                                        <p className={classes.idea__text}>Прогноз доходности</p>
                                                    </div>
                                                    <p className={`${classes.idea__value} 
                                                    ${classes.idea__value_green}`}>{idea.forecast}</p>
                                                </div>
                                                <div className={classes.idea__row}>
                                                    <div className={classes.idea__key}>
                                                        <p className={classes.idea__text}>Ожидаемые сроки</p>
                                                    </div>
                                                    <p className={`${classes.idea__value} 
                                                    ${classes.idea__value_time}`}>{idea.timing}</p>
                                                </div>
                                            </div>
                                            <div className={classes.idea__row}>
                                                <div className={classes.idea__key}>
                                                    <p className={classes.idea__name}>{idea.expert && idea.expert.username}</p>
                                                    <p className={classes.idea__position}>Независимый эксперт</p>
                                                </div>
                                                <div className={classes.idea__avatar}></div>
                                            </div>
                                        </div>
                                        <p className={classes.idea__date}>
                                            <Moment locale="ru" format="D MMM YYYY">{idea.published_at}</Moment>
                                        </p>
                                    </a>
                                </Link>
                            )
                        }
                    })}
                </div>
            </section>
            <Feedback contacts={contacts} />
        </MainLayout>
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            ideas {
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

            seos(where: {link: "/ideas"}) {
                title
                description
                noindex
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

    return {
        props: {
            ideas: data.ideas,
            contacts: data.contact,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}