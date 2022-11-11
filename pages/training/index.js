import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gql } from '@apollo/client'
import Router, { useRouter } from 'next/router'
import { Tag } from '../../components/Tag'
import { Navbar } from '../../components/Navbar'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import classes from '../../styles/scss/blog.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../../components/Feedback').then((mod) => mod.Feedback))
const Pagination = dynamic(() => import('../../components/Pagination').then((mod) => mod.Pagination))


const ITEMS_PER_PAGE = 15


export default function Training({ seo, contacts, exercises, exercisesCount }) {
    const router = useRouter()
    const [total, setTotal] = useState(null)
    const [current, setCurrent] = useState(1)
    const [isTabs, setIsTabs] = useState(false)
    const [isVideo, setIsVideo] = useState(null)
    const [tabTitle, setTabTitle] = useState('Все')

    useEffect(() => {
        setIsTabs(false)
        setIsVideo(router.query?.isVideo || '')
        setCurrent(Number(router.query?.current) || 1)
        setTotal(Math.ceil(exercisesCount / ITEMS_PER_PAGE, 1))
        switch (router.query.isVideo) {
            case '':
                return setTabTitle('Все')
            case 'false':
                return setTabTitle('Тарифы')
            case 'true':
                return setTabTitle('Видео')
            default:
                return setTabTitle('Все')
        }
    }, [router])

    const tabHandler = e => {
        const isVideo = e.target.getAttribute('data-video') || ''
        Router.push(
            { pathname: '/training', query: { isVideo } },
            undefined, { scroll: false })
    }

    const paginationHandler = e => {
        const current = e.target.getAttribute('data-page')
        Router.push({
            pathname: '/training',
            query: { isVideo, current }
        }, undefined, { scroll: false })
    }

    return (
        <SecondaryLayout seo={{ ...seo }}>
            <div className={`main__content ${classes.blogPage}`}>
                <Navbar />
                <section className={classes.training}>
                    <h3 className={classes.training__title}>Обучение</h3>
                    <div className={classes.dropdown}>
                        <p
                            className={classes.dropdown__title}
                            onClick={() => setIsTabs(true)}>
                            {tabTitle}
                        </p>
                        <ul className={`${classes.training__tabs} 
                        ${isTabs && classes.training__tabs_active}`}>
                            <li
                                onClick={tabHandler}
                                className={`${classes.training__tab} 
                                ${isVideo === '' && classes.training__tab_active}`}>
                                Все
                            </li>
                            <li
                                data-video="false"
                                onClick={tabHandler}
                                className={`${classes.training__tab} 
                                ${isVideo === 'false' && classes.training__tab_active}`}>
                                Теория
                            </li>
                            <li
                                data-video="true"
                                onClick={tabHandler}
                                className={`${classes.training__tab} 
                                ${isVideo === 'true' && classes.training__tab_active}`}>
                                Видео
                            </li>
                        </ul>
                    </div>

                    <div className={classes.training__exercises}>
                        {exercises.map(exercise =>
                            <Link href={`/training/${exercise.slug}`} key={exercise.id}>
                                <a className={classes.new}>
                                    <Tag classes={`${classes.new__tag}`}
                                        text={exercise.videoId ? 'Видео' : 'Теория'} />
                                    <div className={classes.new__pic}>
                                        <Image
                                            alt="pic"
                                            width="330"
                                            height="238"
                                            objectFit="cover"
                                            layout="responsive"
                                            objectPosition="center"
                                            src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${exercise.preview.url}`} />
                                    </div>
                                    <div className={classes.new__content}>
                                        <h5 className={classes.new__title}>{exercise.title}</h5>
                                        <p className={classes.date}>{exercise.timeToRead} минут на прочтение</p>
                                    </div>
                                </a>
                            </Link>
                        )}
                    </div>
                    {total && <Pagination
                        totalPage={total}
                        currentPage={current}
                        handleClick={paginationHandler} />}
                </section>

                <Feedback contacts={contacts} />
            </div>
        </SecondaryLayout>
    )
}

export async function getServerSideProps({ res, query }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            exercises(
                limit: ${ITEMS_PER_PAGE}, 
                start: ${((query.current || 1) - 1) * ITEMS_PER_PAGE}, 
                ${query.isVideo ? `where: {videoId_null: ${query.isVideo === 'true' ? 'false' : 'true'}}` : ''}
                sort: "published_at:desc"
                ) {
              id
              slug
              title
              videoId
              timeToRead
              publish_at
              preview { url }
            }

            exercisesConnection(where: {
                published_at_null: false,
                ${query.isVideo ? `videoId_null: ${query.isVideo === 'true' ? 'false' : 'true'}` : ''}
            })
            { aggregate { count } }

            seos(where: {link: "/training"}) {
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
                adresses { string }
                location {
                    lat
                    lng
                }
            }
        }`
    })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            contacts: data.contact,
            exercises: data.exercises,
            seo: data.seos[0] || null,
            isVideo: query.isVideo || null,
            exercisesCount: data.exercisesConnection.aggregate.count
        }
    }
}