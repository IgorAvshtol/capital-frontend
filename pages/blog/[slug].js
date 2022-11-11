import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import Moment from 'react-moment'
import { Tag } from '../../components/Tag'
import { Navbar } from '../../components/Navbar'
import { Article } from '../../components/Article'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import classes from '../../styles/scss/blog.module.scss'
import { fetchApi } from '../../lib/api'
import 'moment/locale/ru'


export default function BlogPage({ article, recommendations, seo }) {
    const crumbProps = [
        { breadcrumb: article.tag.title, href: `/blog?tag=${article.tag.title}` },
        { breadcrumb: article.title, href: `/blog/${article.slug}` },
    ]

    useEffect(async () => {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/articles/${article.slug}`
        try {
            await fetch(url, { method: 'PATCH' })
        } catch (e) { }
    })

    return (
        <SecondaryLayout seo={{ ...seo, title: seo?.title || article.title }}>
            <div className={`main__content ${classes.blogPage}`}>
                <Navbar />
                <Article article={article} crumbProps={crumbProps} />
                <section className={classes.recommend}>
                    <h3 className={classes.recommend__title}>Советуем к прочтению</h3>
                    <div className={classes.recommend__news}>
                        {recommendations.map(rec =>
                            <Link href={`/blog/${rec.slug}`} key={rec.id}>
                                <a className={classes.new}>
                                    <Tag classes={`${classes.new__tag}`} text={rec.tag.title} />
                                    <div className={classes.new__pic}>
                                        <Image
                                            alt="pic"
                                            width="330"
                                            height="238"
                                            objectFit="cover"
                                            layout="responsive"
                                            objectPosition="center"
                                            src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${rec.preview.url}`} />
                                    </div>
                                    <div className={classes.new__content}>
                                        <h5 className={classes.new__title}>
                                            {rec.title}
                                        </h5>
                                        <p className={classes.date}>
                                            <Moment locale="ru" format="D MMM">
                                                {rec.publish_at}
                                            </Moment>
                                        </p>
                                    </div>
                                </a>
                            </Link>
                        )}
                    </div>
                    <Link href='/blog'>
                        <a className={`details-btn ${classes.recommend__detailsBtn}`}>
                            Смотреть все
                        </a>
                    </Link>
                </section>
            </div>
        </SecondaryLayout>
    )
}


export async function getStaticPaths() {
    const articles = await fetchApi(`/articles`)
    const paths = articles.map(article => ({
        params: { slug: article.slug },
    }))
    return { paths, fallback: 'blocking' }
}


export async function getStaticProps({ params }) {
    const articles = await fetchApi(`/articles?slug=${params.slug}`)

    if (!articles.length) return { notFound: true }

    const recommendations = await fetchApi(`/articles?_sort=publish_at:DESC&_limit=3`)
    const seos = await fetchApi(`/seos?link=/blog/${decodeURI(params.slug)}`)

    return {
        props: {
            recommendations,
            article: articles[0],
            seo: seos[0] || null
        },
        revalidate: 60
    }
}