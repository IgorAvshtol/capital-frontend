import Link from 'next/link'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { MainLayout } from '../../layouts/MainLayout'
import classes from '../../styles/scss/about.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback').then((mod) => mod.Feedback))


export default function Questions({ seo, slug, themes, contacts, services, questions }) {
    const [title, setTitle] = useState(null)
    const [isTabs, setIsTabs] = useState(false)

    useEffect(() => {
        if (!slug) {
            return setTitle('Популярное')
        }
        for (let service of services) {
            if (service.slug === slug) {
                return setTitle(service.title)
            }
        }

        for (let theme of themes) {
            if (theme.slug === slug) {
                return setTitle(theme.title)
            }
        }
    }, [slug])

    const tabHandler = e => {
        setIsTabs(false)
        const name = e.target.getAttribute('name')
        const datatype = e.target.getAttribute('datatype')
        Router.push({
            pathname: '/questions',
            query: name ? { datatype, slug: name } : null
        }, undefined, { scroll: false })

    }

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>
                    Вопросы по теме — <span>{title}</span></h3>
                <p className={classes.head__desc}>
                    Основные термины и определения фондового рынка.
                    Ответы на самые популярные вопросы начинающих инвесторов.</p>
            </section>

            <section className={classes.questions}>
                <div className={classes.questions__content}>
                    <div className={classes.questions__filters}>
                        <p className={classes.questions__filtersTitle}
                            onClick={() => setIsTabs(true)}>{title}</p>
                        <ul className={`${classes.questions__tabs} 
                        ${isTabs && classes.questions__tabs_active}`}>
                            <li className={`${classes.questions__tab} 
                                ${!slug && classes.questions__tab_active}`}
                                onClick={tabHandler}>Популярное</li>
                            {services.map(service =>
                                <li
                                    key={service.id}
                                    name={service.slug}
                                    onClick={tabHandler}
                                    datatype='service'
                                    className={`${classes.questions__tab} 
                                    ${slug === service.slug ? classes.questions__tab_active : null}`}>
                                    {service.title}
                                </li>
                            )}
                            {themes.map(theme =>
                                <li
                                    key={theme.id}
                                    name={theme.slug}
                                    onClick={tabHandler}
                                    datatype='question_theme'
                                    className={`${classes.questions__tab} 
                                    ${slug === theme.slug ? classes.questions__tab_active : null}`}>
                                    {theme.title}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={classes.questions__right}>
                        <ul className={classes.questions__list}>
                            {questions.map(question =>
                                <li className={classes.questions__question} key={question.slug}>
                                    <Link href={`/questions/${question.slug}`}><a>{question.title}</a></Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>

            <Feedback contacts={contacts} />
        </MainLayout>
    )
}


export async function getServerSideProps({ res, query, resolvedUrl }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            questions(sort: "published_at:desc"\
            ${query.datatype ? `, where: {${query.datatype}: {slug: "${query.slug}"}}` : ''}\
            ${!query.datatype ? `, where: {isPopular: true}` : ''}) {
                slug
                title
            }

            services {
                id
                slug
                title
            }

            questionThemes {
                id
                slug
                title
            }

            seos(where: {link: "${decodeURI(resolvedUrl)}"}) {
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

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            slug: query.slug || null,
            contacts: data.contact,
            services: data.services,
            questions: data.questions,
            themes: data.questionThemes,
            seo: data.seos[0] || null
        }
    }
}