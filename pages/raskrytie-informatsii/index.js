import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'
import { useState } from 'react'
import { gql } from '@apollo/client'
import { withApollo } from '../../lib/with-qraphql'
import { MainLayout } from '../../layouts/MainLayout'
import classes from '../../styles/scss/about.module.scss'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback').then((mod) => mod.Feedback))


export default function Documents({ searchResult, seo, contacts, types }) {
    const [term, setTerm] = useState('')
    const [docIndex, setDocIndex] = useState(0)

    const onKeyUp = e => {
        if (e.charCode === 13) {
            Router.push({
                pathname: '/raskrytie-informatsii',
                query: term ? { search: term } : null
            })
        }
    }

    const changeHandler = e => setTerm(e.target.value)

    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>
                    Раскрытие информации и документы
                </h3>
            </section>

            <section className={classes.documents}>
                <div className={classes.search}>
                    <input
                        type="text"
                        value={term}
                        placeholder="Поиск"
                        onKeyPress={onKeyUp}
                        onChange={changeHandler}
                        className={classes.search__input} />
                </div>

                {searchResult ?
                    <div className={classes.searchResult}>
                        <h4 className={classes.searchResult__title}>Результат поиска</h4>
                        <p className={classes.searchResult__desc}>
                            Файлов: {searchResult.aggregate.count}
                        </p>
                        <div className={classes.searchResult__wrap}>
                            {searchResult.groupBy.doc_theme.map((block, index) => {
                                const title = block.connection.values[0].doc_theme.title
                                const values = block.connection.values
                                return (
                                    <div className={classes.searchResult__block} key={index}>
                                        <p className={classes.searchResult__blockTitle}>{title}</p>
                                        <div className={classes.searchResult__docs}>
                                            {values.map((doc, index) =>
                                                <div
                                                    id={index}
                                                    key={index}
                                                    className={`${classes.doc} 
                                                    ${docIndex === index && classes.doc_active}`}>
                                                    <div className={classes.doc__wrap}>
                                                        <div className={classes.doc__content}>
                                                            <div className={classes.doc__pic}>
                                                                <Image
                                                                    alt="pic"
                                                                    layout="fill"
                                                                    objectFit="cover"
                                                                    objectPosition="center"
                                                                    src={doc.link ? '/images/ic-link.svg'
                                                                        : `/images/ic-${doc.file.ext.substr(1)}.svg`} />
                                                            </div>
                                                            <div className={classes.doc__text}>
                                                                <Link
                                                                    href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                                    <a target="_blank" className={classes.doc__title}>
                                                                        {doc.title}
                                                                    </a>
                                                                </Link>

                                                                <p className={classes.doc__details}>
                                                                    {doc.file && <span>{doc.file.size} KB</span>}
                                                                    {doc.revealed_at && <span>Дата раскрытия: {doc.revealed_at}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <nav className={classes.doc__actions}>
                                                            <Link href={doc.link || `${process.env.NEXT_PUBLIC_STRAPI_HOST}${doc.file.url}`}>
                                                                <a
                                                                    target="_blank"
                                                                    className={`${classes.doc__action} 
                                                                    ${classes.doc__action_look}`} />
                                                            </Link>
                                                        </nav>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    : <div className={classes.documents__wrap}>
                        {types.map((type, index) =>
                            <div className={classes.documents__block} key={index}>
                                <h4 className={classes.documents__title}>{type.title}</h4>

                                {type.description && <div className={classes.documents__desc}
                                    dangerouslySetInnerHTML={{ __html: type.description }} />}

                                <nav className={classes.documents__list}>
                                    {type.doc_themes.map(theme =>
                                        <Link href={`/raskrytie-informatsii/${theme.slug}`} key={theme.slug}>
                                            <a className={classes.documents__listItem}>
                                                <p className={classes.documents__listTitle}>{theme.title}</p>
                                                <p className={classes.documents__details}>Файлов: {theme.documents.length}</p>
                                            </a>
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        )}
                    </div>}
            </section>
            <Feedback contacts={contacts} />
        </MainLayout>
    )
}


export async function getServerSideProps({ query }) {
    const client = withApollo()
    const { data } = query && query.search ? await client.query({
        query: gql`query {
            documentsConnection(
                where: {title_contains: "${query.search}"}, 
                sort: "position:asc,createdAt:asc") {
                aggregate { count }
                groupBy {
                    doc_theme {
                        connection {
                            values {
                                link
                                title
                                createdAt
                                revealed_at
                                
                                file {
                                    url
                                    ext
                                    size
                                }
                                doc_theme { title }
                            }
                        }
                    }
                }
            }
            seos(where: {link: "/raskrytie-informatsii"}) {
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
    }) : await client.query({
        query: gql`query {
            docTypes {
                title
                description
                doc_themes(sort: "position:asc,published_at:asc") {
                    slug
                    title
                    doc_type { title }
                    documents { id }
                }
            }
            seos(where: {link: "/raskrytie-informatsii"}) {
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
            types: data.docTypes || null,
            searchResult: data.documentsConnection || null,
            seo: data.seos[0] || null
        }
    }
}