import Link from 'next/link'
import Image from 'next/image'
import { gql } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Navbar } from '../../components/Navbar'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import { blogPage } from '../../styles/scss/blog.module.scss'
import classes from '../../styles/scss/about.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import { fetchApi } from '../../lib/api'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback').then((mod) => mod.Feedback))


export default function DocumentsPage({ theme, seo, contacts, arhivedCount }) {
    const [years, setYears] = useState([])
    const [docIndex, setDocIndex] = useState(null)
    const [currentYear, setCurrentYear] = useState(null)

    const crumbProps = [
        { breadcrumb: 'Раскрытие информации', href: '/raskrytie-informatsii' },
        { breadcrumb: theme.title, href: `/raskrytie-informatsii/${theme.slug}` },
    ]

    useEffect(() => {
        if (theme.isFilterable) {
            const list = []
            for (let i = 0; i < theme.documents.length; i++) {
                if (!theme.documents[i].isArchive) {
                    const year = theme.documents[i].filterDate &&
                        theme.documents[i].filterDate.substr(theme.documents[i].filterDate.length - 4)
                    list.indexOf(year) === -1 && year !== null && list.push(year)
                }
            }
            list.sort((a, b) => Number(b) - Number(a))
            setYears(list)
            setCurrentYear(list[0])
        }
    }, [])

    const tabHandler = e => setCurrentYear(e.currentTarget.id)

    const overHandler = e => setDocIndex(e.currentTarget.id)

    return (
        <SecondaryLayout seo={{ ...seo }}>
            <div className={`main__content ${blogPage}`}>
                <Navbar />
                <section className={classes.docs}>
                    <div className={classes.docs__breadcrambs}>
                        <Breadcrumbs crumbProps={crumbProps} />
                    </div>
                    <h3 className={classes.docs__title}>{theme.title}</h3>
                    {theme.isFilterable && years.length &&
                        <div className={classes.docs__tabs}>
                            {years.map(year =>
                                <div
                                    id={year}
                                    key={year}
                                    onClick={tabHandler}
                                    className={`${classes.docs__tab}
                                    ${year === currentYear && classes.docs__tab_active}`}>
                                    {year}
                                </div>
                            )}
                        </div>
                    }
                    <div className={classes.docs__wrap}>
                        {theme.documents.map((doc, index) => {
                            if (!doc.isArchive && (doc.filterDate
                                && doc.filterDate.includes(currentYear) || !theme.isFilterable)) {
                                return (
                                    <div
                                        id={doc.id}
                                        key={index}
                                        onMouseOver={overHandler}
                                        className={`${classes.doc} 
                                        ${docIndex === doc.id && classes.doc_active}`}>
                                        <div className={classes.doc__wrap}>
                                            <div className={classes.doc__content}>
                                                <div className={classes.doc__pic}>
                                                    <Image
                                                        alt="pic"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        objectPosition="center"
                                                        src={doc.link ? '/images/ic-link.svg'
                                                            : `/images/ic-${doc.file.ext.substr(1).toLowerCase()}.svg`} />
                                                </div>
                                                <div className={classes.doc__text}>
                                                    <Link href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                        <a className={classes.doc__title} target="_blank">{doc.title}</a>
                                                    </Link>
                                                    <p className={classes.doc__details}>
                                                        {doc.file && <span>{doc.file.size} KB</span>}
                                                        {doc.revealed_at && <span>Дата раскрытия: {doc.revealed_at}</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <nav className={classes.doc__actions}>
                                                <Link href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                    <a className={`${classes.doc__action} ${classes.doc__action_look}`} target="_blank" />
                                                </Link>
                                            </nav>
                                        </div>
                                        {!!doc.archives.length && <div className={classes.doc__archives}>
                                            <p className={classes.doc__archivesTitle}>Архивные версии</p>
                                            <div className={classes.doc__archivesWrap}>
                                                {doc.archives.map(({ document }, index) =>
                                                    <div className={classes.doc__archive} key={index}>
                                                        <div className={classes.doc__archiveContent}>
                                                            <div className={classes.doc__archivePic}>
                                                                <Image
                                                                    src={document.link ? '/images/ic-link-archive.svg'
                                                                        : `/images/ic-${document.file.ext.substr(1).toLowerCase()}-archive.svg`}
                                                                    alt="pic"
                                                                    layout="fill"
                                                                    objectFit="cover"
                                                                    objectPosition="center" />
                                                            </div>
                                                            <div className={classes.doc__archiveText}>
                                                                <p className={classes.doc__archiveTitle}>{document.title}</p>
                                                                <p className={classes.doc__archiveDetails}>
                                                                    {document.file && <span>{document.file.size} KB</span>}
                                                                    {document.revealed_at && <span>Дата раскрытия: {document.revealed_at}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <nav className={classes.doc__archiveActions}>
                                                            <Link href={document.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${document.file.url}`}>
                                                                <a className={`${classes.doc__action} ${classes.doc__action_look}`} target="_blank" />
                                                            </Link>
                                                        </nav>
                                                    </div>
                                                )}
                                            </div>
                                        </div>}
                                    </div>)
                            }
                        })}
                    </div>
                </section>
                {theme.withArchive && arhivedCount && <section className={classes.archiveDocs}>
                    <div className={classes.archiveDocs__wrap}>
                        <h3 className={classes.archiveDocs__title}>Архив</h3>
                        <div className={classes.docs__wrap}>
                            {theme.documents.map((doc, index) => {
                                if (doc.isArchive) {
                                    return (
                                        <div
                                            id={doc.id}
                                            key={index}
                                            onMouseOver={overHandler}
                                            className={`${classes.doc} 
                                            ${docIndex === doc.id && classes.doc_active}`}>
                                            <div className={classes.doc__wrap} >
                                                <div className={classes.doc__content}>
                                                    <div className={classes.doc__pic}>
                                                        <Image
                                                            src={doc.link
                                                                ? '/images/ic-link.svg'
                                                                : `/images/ic-${doc.file.ext.substr(1).toLowerCase()}-archive.svg`}
                                                            alt="pic"
                                                            layout="fill"
                                                            objectFit="cover"
                                                            objectPosition="center" />
                                                    </div>
                                                    <div className={classes.doc__text}>
                                                        <Link href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                            <a className={classes.doc__title} target="_blank">{doc.title}</a>
                                                        </Link>
                                                        <p className={classes.doc__details}>
                                                            {doc.file && <span>{doc.file.size} KB</span>}
                                                            {doc.revealed_at && <span>Дата раскрытия: {doc.revealed_at}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <nav className={classes.doc__actions}>
                                                    <Link href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                        <a className={`${classes.doc__action} ${classes.doc__action_look}`} target="_blank" />
                                                    </Link>
                                                </nav>
                                            </div>
                                        </div>)
                                }
                            })}
                        </div>
                    </div>
                </section>}
                <Feedback contacts={contacts} />
            </div>
        </SecondaryLayout>
    )
}

export async function getStaticPaths() {
    const docThemes = await fetchApi(`/doc-themes`)
    const paths = docThemes.map(docTheme => ({
        params: { slug: docTheme.slug },
    }))
    return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            docThemes(where: {slug: "${params.slug}"}) {
                slug
                title
                withArchive
                isFilterable
                documents(sort: "position:asc,createdAt:asc") {
                    id
                    link
                    title
                    isArchive
                    createdAt
                    filterDate
                    revealed_at
                    file {
                        url
                        ext
                        size
                    }
                    archives {
                        document {
                            link
                            title
                            createdAt
                            isArchive
                            revealed_at
                            file {
                                url
                                ext
                                size
                            }
                        }
                    }
                }
            }

            documentsConnection(where: {isArchive:true, doc_theme: {slug: "${params.slug}"}}) {
                aggregate {
                    count
                }
            }

            seos(where: {link: "/raskrytie-informatsii/${decodeURI(params.slug)}"}) {
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

    if (!data.docThemes.length) return { notFound: true }

    return {
        props: {
            contacts: data.contact,
            theme: data.docThemes[0],
            seo: data.seos[0] || null,
            arhivedCount: data.documentsConnection.aggregate.count,
        },
        revalidate: 60
    }
}