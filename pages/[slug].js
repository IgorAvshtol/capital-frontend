import Link from 'next/link'
import Image from 'next/image'
import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/service.module.scss'
import { withApollo } from '../lib/with-qraphql'
import { fetchApi } from '../lib/api'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../components/Feedback').then((mod) => mod.Feedback))


export default function Service({
    seo,
    stock,
    service,
    contacts,
    potential,
    contribution }) {
    const { isInvestment, isManagement, isDep, isProfit } = service

    return (
        <MainLayout seo={{ ...seo }}>
            {isInvestment ?
                <section className={classes.investHead}>
                    <h1 className={classes.investHead__title}>{service.title}</h1>
                    <div className={classes.investHead__text}
                        dangerouslySetInnerHTML={{ __html: service.text }} />
                    <div className={classes.investHead__benefits}>
                        {service.benefits.map(benefit =>
                            <div className={classes.investHead__benefit} key={benefit.id}>
                                <p className={classes.investHead__benefitTitle}>{benefit.title}</p>
                                <p className={classes.investHead__benefitDesc}>{benefit.description}</p>
                            </div>
                        )}
                    </div>
                    <p className={classes.investHead__quote}>{service.quote}</p>
                    {service.cta && <Link href={service.cta.url}><a className={`btn btn_small`}>{service.cta.title}</a></Link>}
                </section>
                :
                <section className={classes.head}>
                    <div className={classes.head__titleWrapper}>
                        <h1 className={classes.head__title}>{service.title}</h1>
                        {service.cta && <Link href={service.cta.url}>
                            <a className={`btn ${classes.head__btn}`}>
                                {service.cta.title}
                            </a>
                        </Link>}
                    </div>
                    <div className={classes.head__textWrapper}>
                        <div className={classes.head__text}
                            dangerouslySetInnerHTML={{ __html: service.text }} />
                        <p className={classes.head__quote}>{service.quote}</p>
                    </div>
                </section>
            }

            {!isInvestment && !!service.benefits.length && <section className={classes.benefits}>
                {service.benefitsTitle && <h3 className={classes.benefits__title}>
                    {service.benefitsTitle}
                </h3>}
                <div className={classes.benefits__wrap}>
                    {service.benefits.map(benefit =>
                        <div className={classes.benefits__benefit} key={benefit.id}>
                            <p className={classes.benefits__benefitTitle}>{benefit.title}</p>
                            <p className={classes.benefits__benefitDesc}>{benefit.description}</p>
                        </div>
                    )}
                </div>
            </section>}

            <section className={classes.steps}>
                {service.stepsTitle && <h3 className={classes.steps__title}>
                    {service.stepsTitle}
                </h3>}
                <div className={classes.steps__wrap}>
                    {service.steps.map((step, index) =>
                        <div className={classes.step} key={index}>
                            <span className={classes.step__num}>0{index + 1}</span>
                            <p className={classes.step__title}>{step.title}</p>
                            <p className={classes.step__desc}>{step.description}</p>
                        </div>
                    )}
                </div>
                {service.processDescription && <div className={classes.steps__quote}
                    dangerouslySetInnerHTML={{ __html: service.processDescription }} />}
            </section>

            {!isInvestment && !isManagement &&
                <section className={classes.capital}>
                    <div className={classes.capital__content}>
                        <h3 className={classes.capital__title}>{stock.title}</h3>
                        <p className={classes.capital__desc}>{stock.description}</p>
                        <div className={classes.capital__numbers}>
                            {stock.details.map((detail, index) =>
                                <div className={classes.capital__number} key={index}>
                                    <p className={classes.capital__numberTitle}>{detail.key}</p>
                                    <p className={classes.capital__numberDesc}>{detail.value}</p>
                                </div>
                            )}
                        </div>
                        <div className={classes.capital__quote}
                            dangerouslySetInnerHTML={{ __html: stock.cta }} />
                    </div>
                    <div className={classes.capital__picWrapper}>
                        <div className={classes.capital__pic}>
                            <Image
                                alt="pic"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="120px 0"
                                src="/images/capital-pic.png"
                            />
                        </div>
                    </div>
                </section>
            }

            {service.entities.length > 0 && <section className={classes.entities}>
                <h3 className={classes.entities__title}>{service.entitiesTitle}</h3>
                <div className={classes.entities__wrap}>
                    {service.entities.map(entity =>
                        <div
                            key={entity.id}
                            className={`${classes.entity} 
                            ${service.entities.length === 1 && classes.entity_once}`}>
                            <p className={classes.entity__title}>{entity.title}</p>

                            <div className={classes.entity__desc}
                                dangerouslySetInnerHTML={{ __html: entity.description }} />

                            {!!entity.buttons.length && <div className={classes.entity__btns}>
                                {entity.buttons.map(button =>
                                    <Link href={button.url} key={button.id}>
                                        <a className={`btn ${classes.entity__btn}`}>{button.title}</a>
                                    </Link>
                                )}
                            </div>}
                        </div>
                    )}
                </div>
            </section>}

            {isDep && <section className={classes.dep}>
                <div className={classes.dep__content}>
                    <h3 className={classes.dep__title}>{contribution.title}</h3>
                    <p className={classes.dep__desc}>{contribution.description}</p>
                    <div className={classes.dep__text}
                        dangerouslySetInnerHTML={{ __html: contribution.details }} />
                    <div className={classes.dep__quote}
                        dangerouslySetInnerHTML={{ __html: contribution.cta }} />
                </div>

                <div className={classes.dep__picWrap}>
                    <div className={classes.dep__pic}>
                        <Image
                            alt="pic"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            src="/images/guarantee-pic.jpg"
                        />
                    </div>
                </div>
            </section>}

            {isProfit && <section className={classes.profit}>
                <div className={classes.profit__wrap}>
                    <h3 className={classes.profit__title}>{potential.title}</h3>
                    <div className={classes.profit__desc}
                        dangerouslySetInnerHTML={{ __html: potential.description }} />
                    <div className={classes.profit__quote}
                        dangerouslySetInnerHTML={{ __html: potential.cta }} />
                </div>
            </section>}

            {service.docSection && <section className={classes.documents}>
                <div className={classes.documents__picWrap}>
                    <div className={classes.documents__pic}>
                        <Image
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left center"
                            src="/images/docs-pic.png"
                        />
                    </div>
                </div>
                <div className={classes.documents__content}>
                    <h3 className={classes.documents__title}>{service.docSection.title}</h3>
                    <p className={classes.documents__desc}>{service.docSection.description}</p>
                    <div className={classes.documents__btns}>
                        {service.docSection.buttons.map((button, index) =>
                            <Link href={button.url} key={index}>
                                <a
                                    className={`btn ${classes.documents__btn} 
                                    ${index + 1 === service.docSection.buttons.length && 'btn_secondary'}`}>
                                    {button.title}
                                </a>
                            </Link>
                        )}
                    </div>
                </div>
            </section>}

            {service.questions.length > 0 && <section className={classes.questions}>
                <h3 className={classes.questions__title}>Вопросы и ответы</h3>
                <ul className={classes.questions__wrap}>
                    {service.questions.map(question =>
                        <li className={classes.questions__question} key={question.id}>
                            <Link href={`/questions/${question.slug}`}>
                                <a>{question.title}</a>
                            </Link>
                        </li>
                    )}
                </ul>
                <Link href={`/questions`}>
                    <a className={`details-btn`}>Смотреть все вопросы и ответы</a>
                </Link>
            </section>}

            <Feedback contacts={contacts} />
        </MainLayout>
    )
}

export async function getStaticPaths() {
    const services = await fetchApi(`/services`)
    const paths = services.map(service => ({
        params: { slug: service.slug },
    }))
    return { paths, fallback: 'blocking' }
}


export async function getStaticProps({ params }) {
    const client = withApollo()

    const { data } = await client.query({
        query: gql`query { 
            services(where: {slug: "${params.slug}"}) {
                id
                cta {
                    url
                    title
                }
                slug
                text
                title
                quote
                isDep
                isProfit
                isInvestment
                isManagement
                stepsTitle
                entitiesTitle
                benefitsTitle
                processDescription

                benefits {
                    id
                    title
                    description
                }

                steps {
                    title
                    description
                }
                
                entities {
                    id 
                    title
                    description
                    buttons {
                        id
                        url
                        title
                    }
                }

                questions(limit: 6) {
                    id
                    slug
                    title
                }

                docSection {
                    title
                    description
                    buttons {
                      title
                      url
                    }
                }
            }

            stock {
                cta
                title
                description
                details {
                    key
                    value
                }
            }

            contribution {
                title
                description
                details
                cta
            }

            potential {
                title
                description
                cta
            }

            seos(where: {link: "/${decodeURI(params.slug)}"}) {
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

    if (!data.services.length) return { notFound: true }

    return {
        props: {
            stock: data.stock,
            contacts: data.contact,
            service: data.services[0],
            potential: data.potential,
            contribution: data.contribution,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}