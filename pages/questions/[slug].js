import Link from 'next/link'
import { gql } from '@apollo/client'
import { Navbar } from '../../components/Navbar'
import { Article } from '../../components/Article'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import classes from '../../styles/scss/blog.module.scss'
import serviceClasses from '../../styles/scss/service.module.scss'
import { fetchApi } from '../../lib/api'
import { withApollo } from '../../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback')
    .then((mod) => mod.Feedback))


export default function QuestionPage({ question, answer, contacts, seo }) {
    const crumbProps = [
        { breadcrumb: 'Вопросы и ответы', href: '/questions' },
        { breadcrumb: question.title, href: `/questions/${question.slug}` },
    ]

    return (
        <SecondaryLayout seo={{ ...seo }}>
            <div className={`main__content ${classes.blogPage}`}>
                <Navbar />
                <Article article={answer} crumbProps={crumbProps} />

                {answer.service?.questions?.length &&
                    <section className={serviceClasses.questions}>
                        <h3 className={serviceClasses.questions__title}>
                            Еще вопросы по этой теме
                        </h3>
                        <ul className={serviceClasses.questions__wrap}>
                            {answer.service.questions.map(question =>
                                <li
                                    key={question.id}
                                    className={serviceClasses.questions__question} >
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
            </div>
        </SecondaryLayout>
    )
}


export async function getStaticPaths() {
    const questions = await fetchApi(`/questions`)
    const paths = questions.map(question => ({
        params: { slug: question.slug },
    }))
    return { paths, fallback: 'blocking' }
}


export async function getStaticProps({ params }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            questions(where: {slug: "${params.slug}"}) {
                slug
                title
                answer
                service {
                    questions(where: {slug_nin: ["${params.slug}"]}) {
                        id
                        slug
                        title
                    }
                }
            }

            seos(where: {link: "/questions/${decodeURI(params.slug)}"}) {
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

    if (!data.questions.length) return { notFound: true }

    return {
        props: {
            contacts: data.contact,
            question: data.questions[0],
            answer: data.questions[0],
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}