import Image from 'next/image'
import Moment from 'react-moment'
import { useState, useEffect, useRef } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import classes from '../styles/scss/article.module.scss'
import { getStrapiUrl } from '../lib/api'


export const Article = ({ article, isExercise, crumbProps }) => {
    const articleBody = useRef(null)
    const [html, setHtml] = useState(null)

    useEffect(() => {
        const fragment = document.createElement('div')
        fragment.innerHTML = article.body || article.answer
        const iframes = fragment.querySelectorAll('iframe')
        const images = fragment.querySelectorAll('img')

        iframes.forEach(iframe => {
            const wrapper = document.createElement('div')
            wrapper.classList.add('article-video')

            // console.log(articleBody.current?.offsetWidth)

            var videoRatio = (iframe.height / (iframe.width || 870)) * 100;
            wrapper.style.paddingTop = videoRatio + '%';

            iframe.parentNode.insertBefore(wrapper, iframe)
            wrapper.appendChild(iframe)
        })

        images.forEach(image => image.src = getStrapiUrl(image.getAttribute('src')))
        setHtml(fragment.innerHTML)
    }, [article])

    return (
        <section className={`${classes.article} ${article.answer || isExercise ? classes.article_low : null}`}>
            <div className={classes.article__breadcrambs}>
                <Breadcrumbs crumbProps={crumbProps} />
            </div>
            <div className={classes.article__head}>
                <h1 className={`${classes.article__title} 
                ${isExercise && classes.article__title_mar}`}>{article.title}</h1>
                {article.timeToRead && <ul className={classes.article__details}>
                    {article.publish_at && <li className={`${classes.article__detail} ${classes.article__detail_date}`}>
                        <Moment locale="ru" format="D MMM, YYYY">
                            {article.publish_at}
                        </Moment>
                    </li>}
                    {article.timeToRead && <li className={`${classes.article__detail} ${classes.article__detail_time}`}>
                        {article.timeToRead} минут на прочтение
                    </li>}
                    {article.views && <li className={`${classes.article__detail} ${classes.article__detail_views}`}>
                        {article.views}
                    </li>}
                    {article.author && <li className={`${classes.article__detail} ${classes.article__detail_author}`}>
                        Автор: {article.author.username}
                    </li>}
                </ul>}
            </div>
            {article.cover && <div className={classes.article__cover}>
                <Image
                    priority
                    alt="pic"
                    width="1440"
                    height="540"
                    quality="85"
                    objectFit="cover"
                    objectPosition="center"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/eHHfwAJdQPUb2QWrQAAAABJRU5ErkJggg=="
                    src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${article.cover.url}`}
                />
            </div>}
            {article.videoId && <div className={classes.article__video}>
                <iframe
                    allowFullScreen
                    frameBorder="0"
                    title="Embedded youtube"
                    src={`https://www.youtube.com/embed/${article.videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>}
            {html && <div
                ref={articleBody}
                className={classes.article__body}
                dangerouslySetInnerHTML={{ __html: html }}
            />}
        </section>
    )
}