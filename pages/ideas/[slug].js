import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { useCallback, useState, useEffect } from 'react'
import { Feedback } from '../../components/Feedback'
import { MainLayout } from '../../layouts/MainLayout'
import classes from '../../styles/scss/ideas.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import { getStrapiUrl } from '../../lib/api'
import 'moment/locale/ru'


export default function IdeasPage({ ideaData, seo, contacts }) {
    const [ip, setIP] = useState('')
    const [idea, setIdea] = useState(null)
    const [loading, setLoading] = useState(false)

    const getData = useCallback(async () => {
        fetch('https://geolocation-db.com/json/')
            .then((res) => res.json())
            .then((data) => setIP(data.IPv4))
    }, [])

    useEffect(() => {
        getData()
        setIdea(ideaData)
    }, [])

    const indicatorHandler = async (e) => {
        if (!loading) {
            if (idea.actions && idea.actions.split(',').includes(ip)) {
                return alert('Вы уже проголосовали')
            }
            setLoading(true)
            const resp = await fetch(getStrapiUrl(`/ideas/${idea.id}`), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    actions: idea.actions ? idea.actions + ',' + ip : '' + ip,
                    likes: e.currentTarget.id === 'likes' ? ++idea.likes : idea.likes,
                    dislikes: e.currentTarget.id === 'dislikes' ? ++idea.dislikes : idea.dislikes,
                })
            })

            const data = await resp.json()
            setIdea(data)
        }

        setLoading(false)
    }

    if (!idea) return null

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.main}>
                <div className={classes.main__head}>
                    <div className={classes.main__content}>
                        <span
                            className={`${classes.main__tag} ${!idea.isActive && classes.main__tag_red}`}>
                            {idea.isActive ? 'Активная идея' : 'Завершенная идея'}
                        </span>
                        <h3 className={classes.main__title}>{idea.title}</h3>
                        <p className={classes.main__desc}>{idea.description}</p>
                    </div>
                    <div className={classes.main__snippet}>
                        <div className={classes.main__snippetPic}>
                            <Image
                                alt="pic"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="center"
                                src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${idea.logo.url}`} />
                        </div>
                        <p className={classes.main__snippetTitle}>{idea.name}</p>
                        <div className={classes.main__snippetPrice}>
                            <p>Текущая цена</p>
                            <span>{idea.currentPrice}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.ins}>
                    <div className={classes.ins__details}>
                        <div className={classes.ins__detail}>
                            <p className={classes.ins__key}>Справедливая цена</p>
                            <p className={`${classes.ins__price} ${classes.ins__price_cup}`}>{idea.fairPrice}</p>
                        </div>
                        <div className={classes.ins__detail}>
                            <p className={classes.ins__key}>Прогноз доходности</p>
                            <p className={`${classes.ins__price} ${classes.ins__price_green}`}>{idea.forecast}</p>
                        </div>
                        <div className={classes.ins__detail}>
                            <p className={classes.ins__key}>Ожидаемые сроки</p>
                            <p className={`${classes.ins__price}`}>{idea.timing}</p>
                        </div>
                        <Link href="/registration">
                            <a className={`btn ${classes.ins__btn}`}>купить</a>
                        </Link>
                    </div>
                    <div className={classes.ins__extra}>
                        <p>Верите в идею?</p>
                        <div className={classes.ins__indicators}>
                            <div
                                id="likes"
                                onClick={indicatorHandler}
                                className={`${classes.indicator} ${classes.indicator_green}`}>
                                <span /><p>{idea.likes}</p>
                            </div>
                            <div
                                id="dislikes"
                                onClick={indicatorHandler}
                                className={`${classes.indicator} ${classes.indicator_red}`}>
                                <span /><p>{idea.dislikes}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.main__footer}>
                    <p className={classes.main__date}>
                        <Moment locale="ru" format="D MMM, YYYY">
                            {idea.published_at}
                        </Moment>
                    </p>
                    <p className={classes.main__time}>7 минут для ознакомления</p>
                    {idea.expert &&
                        <p className={classes.main__author}>
                            Независимый эксперт: {idea.expert.username}
                        </p>
                    }
                </div>
            </section>
            <section
                className={classes.textBlock}
                dangerouslySetInnerHTML={{ __html: idea.text }} />
            <section className={classes.purchase}>
                <div
                    className={classes.purchase__body}
                    dangerouslySetInnerHTML={{ __html: idea.idea }} />
                {idea.document && <div className={classes.purchase__doc}>
                    <p>{idea.document.text}</p>
                    {idea.document.file &&
                        <Link href={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${idea.document.file.url}`}>
                            <a className="btn" target="_blank">Читать документ</a>
                        </Link>
                    }
                </div>}
            </section>
            <section className={classes.factors}>
                <div className={classes.factors__wrap}>
                    <div className={classes.factors__content}>
                        <h3 className={classes.factors__title}>Факторы ЗА</h3>
                        <ul className={classes.factors__list}>
                            {idea.benefits.map((benefit, index) =>
                                <li
                                    key={index}
                                    className={classes.factors__listItem} >
                                    {benefit.string}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={classes.factors__risks}>
                        <h4 className={classes.factors__risksTitle}>Риски</h4>
                        <ul className={`${classes.factors__list} ${classes.factors__list_risks}`}>
                            {idea.risks.map((risk, index) =>
                                <li
                                    key={index}
                                    className={classes.factors__listItem}>
                                    {risk.string}
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


export async function getServerSideProps({ params }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            ideas(where: {slug: "${params.slug}"}) {
                id
                slug
                name
                sell
                text
                idea
                title
                timing
                likes
                dislikes
                actions
                forecast
                isActive
                fairPrice
                description
                currentPrice
                published_at
                logo { url }
                expert { username }
                benefits {
                    string
                }
                risks {
                    string
                }
                document {
                    text
                    file { url }
                } 
            }

            seos(where: {link: "/ideas/${decodeURI(params.slug)}"}) {
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
            contacts: data.contact,
            ideaData: data.ideas[0],
            seo: data.seos[0] || null
        }
    }
}