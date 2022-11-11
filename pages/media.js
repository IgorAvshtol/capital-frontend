import Link from 'next/link'
import { useState } from 'react'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/about.module.scss'
import { withApollo } from '../lib/with-qraphql'
import 'moment/locale/ru'


export default function Media({ references, seo }) {
    const [limit, setLimit] = useState(2)

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>Мы в СМИ</h3>
                <p className={classes.head__desc}>
                    Эксперты АО ИК «Фондовый Капитал» дают оценку современным тенденциям
                    в экономике и делятся своими прогнозами на будущее.</p>
            </section>

            <section className={`${classes.media} ${classes.media_page}`}>
                <div className={classes.media__wrap}>
                    {references.slice(0, limit).map(reference =>
                        <Link href={reference.link} key={reference.id}>
                            <a className={classes.media__item} target="_blank">
                                <p className={classes.media__itemCategory}>{reference.source}</p>
                                <p className={classes.media__itemTitle}>{reference.title}</p>
                                <p className={classes.media__itemDate}>
                                    <Moment locale="ru" format="D MMM">
                                        {reference.publish_at}
                                    </Moment>
                                </p>
                            </a>
                        </Link>
                    )}
                </div>
                {limit !== references.length && <button
                    className={`details-btn ${classes.media__detailsBtn}`}
                    onClick={() => setLimit(references.length)}>
                    Смотреть больше
                </button>}
            </section>
        </MainLayout>
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            references(sort: "publish_at:desc") { 
                id
                link
                title
                source
                published_at
                publish_at
            }

            seos(where: {link: "/media"}) {
                title
                description
                noindex
            }
        }`
    })

    return {
        props: {
            references: data.references,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}
