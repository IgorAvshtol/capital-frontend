import Link from 'next/link'
import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/about.module.scss'
import { withApollo } from '../lib/with-qraphql'
import { fileLoader } from '../lib/fileLoader'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../components/Feedback')
    .then((mod) => mod.Feedback))


export default function Licenses({ licenses, seo, contacts }) {
    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>Лицензии</h3>
                <p className={classes.head__desc}>
                    В активе АО ИК «Фондовый Капитал» четыре основные лицензии: на брокерскую, депозитарную,
                    дилерскую деятельность и управление ценными бумагами.</p>
            </section>
            <section className={classes.licenses}>
                <div className={classes.licenses__wrap}>
                    {licenses.map(license =>
                        <div className={classes.license} key={license.id}>
                            <p className={classes.license__title}>{license.title}</p>
                            <p className={classes.license__desc}>{license.description}</p>
                            <div className={classes.license__items}>
                                {license.details.map(item =>
                                    <div className={classes.license__item} key={item.id}>
                                        <p className={classes.license__itemKey}>{item.key}</p>
                                        <p className={classes.license__itemValue}>{item.value}</p>
                                    </div>
                                )}
                            </div>
                            <nav className={classes.license__nav}>
                                <Link href={fileLoader({ src: license.file.url })}>
                                    <a
                                        download
                                        className={`${classes.license__navItem} 
                                        ${classes.license__navItem_download}`}
                                    />
                                </Link>
                                <Link href={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${license.file.url}`}>
                                    <a className={`${classes.license__navItem} ${classes.license__navItem_look}`} target='_blank' />
                                </Link>
                            </nav>
                        </div>
                    )}
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
            licenses { 
                id
                title
                description
                file { url }
                details {
                    id
                    key
                    value
                }
            }

            seos(where: {link: "/licenses"}) {
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
            licenses: data.licenses,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}