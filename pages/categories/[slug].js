import { gql } from '@apollo/client'
import { Services } from '../../components/Services'
import { MainLayout } from '../../layouts/MainLayout'
import { withApollo } from '../../lib/with-qraphql'
import dynamic from 'next/dynamic'
import { fetchApi } from '../../lib/api'
import stepClasses from '../../styles/scss/steps.module.scss'
import benefitsClasses from '../../styles/scss/benefits.module.scss'


const Steps = dynamic(() => import('../../components/Steps').then((mod) => mod.Steps))
const Guarantee = dynamic(() => import('../../components/Guarantee').then((mod) => mod.Guarantee))
const Benefits = dynamic(() => import('../../components/Benefits').then((mod) => mod.Benefits))
const Training = dynamic(() => import('../../components/Training').then((mod) => mod.Training))
const Feedback = dynamic(() => import('../../components/Feedback').then((mod) => mod.Feedback))


export default function Category({ category, seo, contacts }) {
    return (
        <MainLayout seo={{ ...seo }}>
            <section className="section">
                <h3 className="section__title">Брокерские услуги</h3>
                <Services services={category.services} isPage />
            </section>
            <Steps pageClasses={stepClasses.stepsPage_category} />
            <Guarantee />
            <Benefits pageClasses={benefitsClasses.benefits_category} />
            <Training />
            <Feedback contacts={contacts} />
        </MainLayout>
    )
}


export async function getStaticPaths() {
    const categories = await fetchApi(`/categories`)
    const paths = categories.map(category => ({
        params: { slug: category.slug },
    }))
    return { paths, fallback: 'blocking' }
}


export async function getStaticProps({ params }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            categories(where: {slug: "${params.slug}"}) {
                services {
                    id
                    slug
                    title
                    bannerTitle
                    description
                }
            }

            seos(where: {link: "/categories/${decodeURI(params.slug)}"}) {
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

    if (!data.categories.length) return { notFound: true }

    return {
        props: {
            contacts: data.contact,
            seo: data.seos[0] || null,
            category: data.categories[0]
        },
        revalidate: 60
    }
}