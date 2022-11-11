import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import Moment from 'react-moment'
import { gql } from '@apollo/client'
import { Tag } from '../../components/Tag'
import { Navbar } from '../../components/Navbar'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import classes from '../../styles/scss/blog.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import dynamic from 'next/dynamic'
import 'moment/locale/ru'


const Pagination = dynamic(() => import('../../components/Pagination').then((mod) => mod.Pagination))

const ITEMS_PER_PAGE = 6


export default function Blog({ tags, articlesCount, seo, articles }) {
    const router = useRouter()
    const [tag, setTag] = useState('')
    const [isTabs, setIsTabs] = useState(false)
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(null)

    useEffect(() => {
        setIsTabs(false)
        setTag(router.query?.tag || '')
        setCurrent(parseInt(router.query?.current, 10) || 1)
        setTotal(Math.ceil(articlesCount / ITEMS_PER_PAGE, 1))
    }, [router])

    const paginationHandler = e => {
        const current = e.target.getAttribute('data-page')
        Router.push({
            pathname: '/blog',
            query: { tag, current }
        }, undefined, { scroll: false })
    }

    const tabHandler = e => {
        const tag = e.target.getAttribute('data-tag') || ''
        Router.push(
            { pathname: '/blog', query: { tag } },
            undefined, { scroll: false })
    }

    const dropdownHandler = () => setIsTabs(!isTabs)

    return (
        <SecondaryLayout seo={{ ...seo }}>
            <div className={`main__content ${classes.blogPage}`}>
                <Navbar />
                <section className={classes.head}>
                    <h3 className={classes.head__title}>Блог, новости, аналитика</h3>
                    <div className={classes.dropdown}>
                        <p
                            className={classes.dropdown__title}
                            onClick={dropdownHandler}>
                            {tag || 'Все'}
                        </p>
                        <ul className={`${classes.training__tabs} ${isTabs && classes.tabs_active}`}>
                            <li
                                onClick={tabHandler}
                                className={`${classes.tab} 
                                ${tag === '' && classes.tab_active}`}>
                                Все
                            </li>
                            {tags.map(item =>
                                <li
                                    key={item.id}
                                    data-tag={item.title}
                                    onClick={tabHandler}
                                    className={`${classes.tab} 
                                    ${item.title === tag && classes.tab_active}`}>
                                    {item.title}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* <Link href={`/blog/${articles[0].slug}`}>
                        <a className={classes.cover}>
                            <div className={classes.cover__pic}>
                                <Image
                                    alt="pic"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="center"
                                    src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${articles[0].cover.url}`} />
                            </div>

                            {articles[0].tag && <Tag
                                text={articles[0].tag.title}
                                classes={`${classes.cover__tag}`}
                            />}

                            <h4 className={classes.cover__title}>
                                {articles[0].title}
                            </h4>

                            <p className={classes.date}>
                                <Moment locale="ru" format="D MMM">
                                    {articles[0].publish_at}
                                </Moment>
                            </p>
                        </a>
                    </Link> */}

                    <div className={classes.head__news}>
                        {tags.map(tag => {
                            return !tag.articles.length ? null :
                                <Link href={`/blog/${tag.articles[0].slug}`} key={tag.id}>
                                    <a className={classes.new}>
                                        <Tag classes={`${classes.new__tag}`} text={tag.title} />
                                        <div className={classes.new__pic}>
                                            <Image
                                                alt="pic"
                                                width="330"
                                                height="238"
                                                objectFit="cover"
                                                layout="responsive"
                                                objectPosition="center"
                                                src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${tag.articles[0].preview.url}`} />
                                        </div>
                                        <div className={classes.new__content}>
                                            <h5 className={classes.new__title}>
                                                {tag.articles[0].title}
                                            </h5>
                                            <div className={classes.new__dateWrap}>
                                                <p className={classes.date}>
                                                    <Moment locale="ru" format="D MMM">
                                                        {tag.articles[0].publish_at}
                                                    </Moment>
                                                </p>
                                                <p>{tag.articles[0].views} просмотров</p>
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                        })}
                    </div>
                </section>

                <section className={classes.articles}>
                    <div className={classes.articles__wrap}>
                        {articles.map(article =>
                            <Link href={`/blog/${article.slug}`} key={article.id}>
                                <a className={classes.article}>
                                    <div className={classes.article__pic}>
                                        <Image
                                            alt="pic"
                                            width="330"
                                            height="238"
                                            objectFit="cover"
                                            objectPosition="center"
                                            src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${article.preview.url}`} />
                                    </div>
                                    <div className={classes.article__content}>
                                        {article.tag && <Tag
                                            classes={`${classes.article__tag}`}
                                            text={article.tag.title}
                                        />}
                                        <p className={classes.article__title}>
                                            {article.title}
                                        </p>
                                        <div className={classes.article__dateWrap}>
                                            <p className={classes.date}>
                                                <Moment locale="ru" format="D MMM">
                                                    {article.publish_at}
                                                </Moment>
                                            </p>
                                            <p>{article.views} просмотров</p>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        )}
                    </div>
                    <Pagination
                        totalPage={total}
                        currentPage={current}
                        handleClick={paginationHandler}
                    />
                </section>
            </div>
        </SecondaryLayout>
    )
}


export async function getServerSideProps({ res, query, resolvedUrl }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query {
            articlesConnection(where: { 
                published_at_null: false,
                tag: {title_contains: "${query.tag || ""}"}
            }) { aggregate { count } }

            tags {
                id
                title
                articles(
                    limit: 1,
                    sort: "publish_at:desc",
                    where: {
                        published_at_null: false,
                        tag: {title_contains: "${query.tag || ""}"}}) {
                        slug
                        title   
                        views
                        publish_at
                        cover { url }
                        preview { url }
                    }
            }

            articles(
                sort: "publish_at:desc", 
                limit: ${ITEMS_PER_PAGE}, 
                start: ${((query.current || 1) - 1) * ITEMS_PER_PAGE}, 
                where: {tag: {title_contains: "${query.tag || ""}"}}) {
                    id
                    slug
                    title
                    views
                    publish_at
                    cover { url }
                    tag { title }
                    preview { url }
            }

            seos(where: {link: "${decodeURI(resolvedUrl)}"}) {
                title
                description
                noindex
            }
        }`
    })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            tags: data.tags,
            articles: data.articles,
            seo: data.seos[0] || null,
            articlesCount: data.articlesConnection.aggregate.count
        }
    }
}