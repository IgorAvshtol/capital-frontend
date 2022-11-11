import { gql } from '@apollo/client'
import { Navbar } from '../../components/Navbar'
import { Article } from '../../components/Article'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import classes from '../../styles/scss/blog.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import { fetchApi } from '../../lib/api'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback')
    .then((mod) => mod.Feedback))


export default function TrainingPage({ article, seo, contacts }) {
    const crumbProps = [
        { breadcrumb: 'Обучение', href: '/training' },
        { breadcrumb: article.title, href: `/training/${article.slug}` },
    ]

    return (
        <SecondaryLayout seo={{ ...seo }}>
            <div className={`main__content ${classes.blogPage}`}>
                <Navbar />
                <Article
                    isExercise
                    article={article}
                    crumbProps={crumbProps} />
                <Feedback contacts={contacts} />
            </div>
        </SecondaryLayout>
    )
}

export async function getStaticPaths() {
    const exercises = await fetchApi(`/exercises`)
    const paths = exercises.map(exercise => ({
        params: { slug: exercise.slug },
    }))
    return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            exercises(where: {slug: "${params.slug}"}) {
                id
                slug
                title
                body
                videoId
            }

            seos(where: {link: "/training/${decodeURI(params.slug)}"}) {
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

    if (!data.exercises.length) return { notFound: true }

    return {
        props: {
            contacts: data.contact,
            article: data.exercises[0],
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}