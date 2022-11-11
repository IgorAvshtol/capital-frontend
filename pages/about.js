import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import { Tag } from '../components/Tag'
import serviceClasses from '../styles/scss/service.module.scss'
import classes from '../styles/scss/about.module.scss'
import { withApollo } from '../lib/with-qraphql'
import dynamic from 'next/dynamic'
import 'moment/locale/ru'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


const Slider = dynamic(() => import('react-slick'))
const Feedback = dynamic(() => import('../components/Feedback').then((mod) => mod.Feedback))


export default function About({
    seo,
    references,
    articles,
    requisites,
    employes,
    contacts }) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1124,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    }

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>О компании</h3>
                <p className={classes.head__desc}>
                    АО ИК «Фондовый Капитал» – успешный и стабильный участник российского фондового рынка.
                    За свою 25-летнюю историю компания показала себя как солидный игрок со взвешенной рыночной
                    стратегией и положительной репутацией.
                </p>
            </section>

            <section className={serviceClasses.documents}>
                <div className={serviceClasses.documents__picWrap}>
                    <div className={serviceClasses.documents__pic}>
                        <Image
                            priority
                            alt="pic"
                            width="525"
                            height="516"
                            objectFit="contain"
                            src="/images/docs-pic.png"
                            objectPosition="left center"
                        />
                    </div>
                </div>
                <div className={serviceClasses.documents__content}>
                    <h3 className={serviceClasses.documents__title}>
                        Тарифы, документы и лицензии
                    </h3>
                    <p className={serviceClasses.documents__desc}>
                        У нас есть все необходимые документы и лицензии чтобы оказать вам услуги качественно и законно.
                        Тут вы сможете познакомиться с нами ближе и убедиться в нашей компетенции.
                    </p>
                    <div className={serviceClasses.documents__btns}>
                        <Link href='/raskrytie-informatsii'>
                            <a className={`btn ${serviceClasses.documents__btn}`}>
                                Документы
                            </a>
                        </Link>
                        <Link href='/licenses'>
                            <a className={`btn btn_secondary ${serviceClasses.documents__btn}`}>
                                Лицензии
                            </a>
                        </Link>
                    </div>
                </div>
            </section>

            <section className={classes.team}>
                <h3 className={classes.team__title}>Наша команда</h3>
                <div className={classes.team__teammates}>
                    <Slider {...settings}>
                        {employes.map(employee =>
                            <div className={classes.teammate} key={employee.id}>
                                <div className={classes.teammate__wrap}>
                                    <div className={classes.teammate__pic}>
                                        <Image
                                            alt="pic"
                                            width="330"
                                            height="374"
                                            objectFit="cover"
                                            objectPosition="top"
                                            layout="responsive"
                                            placeholder="blur"
                                            blurDataURL="data: image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8fzzqPwAIDgMh0Cfg3wAAAABJRU5ErkJggg=="
                                            src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${employee.avatar.url}`} />
                                    </div>
                                    <p className={classes.teammate__name}>{employee.name}</p>
                                    <p className={classes.teammate__prof}>{employee.profession}</p>
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
            </section>

            <section className={classes.business}>
                <h3 className={classes.business__title}>
                    Бизнес-модель<br />АО ИК «Фондовый Капитал»
                </h3>
                <Link href='/business'>
                    <a className="btn">Подробнее</a>
                </Link>
            </section>

            <section className={classes.news}>
                <h3 className={classes.news__title}>Новости компании</h3>
                <div className={classes.news__wrap}>
                    {articles.map(article =>
                        <Link href={`/blog/${article.slug}`} key={article.id}>
                            <a className={classes.news__new}>
                                <Tag classes={`${classes.news__tag}`} text={article.tag.title} />
                                <div className={classes.news__newPic}>
                                    <Image
                                        alt="pic"
                                        layout="fill"
                                        objectFit="cover"
                                        objectPosition="center"
                                        src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${article.preview.url}`}
                                    />
                                </div>
                                <div className={classes.news__newContent}>
                                    <p className={classes.news__newTitle}>{article.title}</p>
                                    <p className={classes.news__newDate}>
                                        <Moment locale="ru" format="D MMM">
                                            {article.published_at}
                                        </Moment>
                                    </p>
                                </div>
                            </a>
                        </Link>
                    )}

                </div>
                <Link href='/blog'>
                    <a className={`details-btn ${classes.news__detailsBtn}`}>
                        Смотреть все новости
                    </a>
                </Link>
            </section>

            <section className={classes.media}>
                <h3 className={classes.media__title}>Мы в СМИ</h3>
                <div className={classes.media__wrap}>
                    {references.map(reference =>
                        <Link href={reference.link} key={reference.id}>
                            <a className={classes.media__item} target="_blank">
                                <p className={classes.media__itemCategory}>{reference.source}</p>
                                <p className={classes.media__itemTitle}>{reference.title}</p>
                                <p className={classes.media__itemDate}>
                                    <Moment locale="ru" format="D MMM">
                                        {reference.published_at}
                                    </Moment>
                                </p>
                            </a>
                        </Link>
                    )}
                </div>
                <Link href='/media'><a className={`details-btn`}>Смотреть больше</a></Link>
            </section>

            <section className={classes.requisites}>
                <h3 className={classes.requisites__title}>Реквизиты компании</h3>
                <div className={classes.requisites__wrap}>
                    {requisites.map(requisite =>
                        <div className={classes.requisites__row} key={requisite.id}>
                            <p className={classes.requisites__key}>{requisite.key}</p>
                            <p className={classes.requisites__value}>{requisite.value}</p>
                        </div>
                    )}
                </div>
            </section>

            <Feedback contacts={contacts} isAbout />
        </MainLayout>
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            team { 
                employes {
                    id
                    name
                    profession
                    avatar { url }
                }
            }

            requisite {
                requisites {
                    id
                    key
                    value
                }
            }

            references(sort: "published_at:desc", limit: 3) {
                id
                link
                title
                source
                published_at
            }

            articles(sort: "published_at:desc", where: { tag: {title: "Новости"} }, limit: 3) {
                id
                slug
                title
                published_at
                tag { title }
                cover { url }
                preview { url }
            }

            seos(where: {link: "/about"}) {
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
            articles: data.articles,
            references: data.references,
            employes: data.team.employes,
            requisites: data.requisite.requisites,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}
