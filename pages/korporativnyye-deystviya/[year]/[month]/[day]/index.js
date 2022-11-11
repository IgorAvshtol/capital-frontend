import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { useState, useCallback, useEffect } from 'react'
import { Navbar } from '../../../../../components/Navbar'
import { Breadcrumbs } from '../../../../../components/Breadcrumbs'
import { SecondaryLayout } from '../../../../../layouts/SecondaryLayout'
import { blogPage } from '../../../../../styles/scss/blog.module.scss'
import classes from '../../../../../styles/scss/about.module.scss'


export default function DocumentsPage({ params, data }) {
    const [docIndex, setDocIndex] = useState(null)
    const [files, setFiles] = useState([])

    const crumbProps = [
        { breadcrumb: 'Корпоративные действия', href: '/korporativnyye-deystviya' },
        {
            breadcrumb: `${params.month}.${params.year}`,
            href: `/korporativnyye-deystviya/${params.year}/${params.month}`
        },
    ]

    useEffect(() => {
        const files = []
        for (let file of data) {
            const el = document.createElement('html')
            el.innerHTML = file.doc
            const centered = el.querySelectorAll('.centered')
            const secondBlock = el.querySelector('body div:nth-child(2n)')
            const thirdBlock = el.querySelector('body div:nth-child(3n)')
            const title = centered.length
                ? `${centered[0].innerText + centered[1].innerText}`.replace(/\s+/g, ' ').trim()
                : `${secondBlock.innerText + ', ' + thirdBlock.querySelector('p').innerText}`.replace(/\s+/g, ' ').trim()
            files.push({ ...file, title })
        }
        setFiles(files)
    }, [])

    const setFormatFile = useCallback(
        path => {
            const paramsList = path.split('/').reverse()
            const params = {
                day: paramsList[1],
                year: paramsList[3],
                name: paramsList[0],
                month: paramsList[2],
            }
            return params
        })

    const setFormatDate = useCallback(
        string => {
            const date = new Date(string)
            return date
        })

    return (
        <SecondaryLayout>
            <div className={`main__content ${blogPage}`}>
                <Navbar />
                <section className={classes.documents}>
                    <div className={classes.docs__breadcrambs}>
                        <Breadcrumbs crumbProps={crumbProps} />
                    </div>
                    <div className={classes.documents__block}>
                        <h4 className={classes.documents__title}>
                            Корпоративные действия за {params.day}.{params.month}.{params.year}
                        </h4>
                        <p className={classes.documents__subtitle}>
                            <span>{data.length} файлов</span>
                            <span>
                                <Moment locale="ru" format="DD.MM.YYYY">{
                                    setFormatDate(`${params.year}-${params.month}-${params.day}`)
                                        .setDate(setFormatDate(`${params.year}-${params.month}-${params.day}`)
                                            .getDate() + 1)}
                                </Moment>
                            </span>
                        </p>
                        <div className={classes.docs__wrap}>
                            {files.map((file, index) => {
                                const { name, day, month, year } = setFormatFile(file.path)
                                return (
                                    <div onMouseOver={() => setDocIndex(index)} key={index}
                                        className={`${classes.doc} ${docIndex === index && classes.doc_active}`}>
                                        <div className={classes.doc__wrap}>
                                            <div className={classes.doc__content}>
                                                <div className={classes.doc__pic}>
                                                    <Image
                                                        src={`/images/ic-pdf.svg`}
                                                        alt="pic"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        objectPosition="center" />
                                                </div>
                                                <div className={classes.doc__text}>
                                                    <p className={classes.doc__title}>{file.title}</p>
                                                    <p className={classes.doc__details}>
                                                        <span>
                                                            <Moment locale="ru" format="DD.MM.YYYY">{
                                                                setFormatDate(`${year}-${month}-${day}`)
                                                                    .setDate(setFormatDate(`${year}-${month}-${day}`)
                                                                        .getDate() + 1)}
                                                            </Moment>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <nav className={classes.doc__actions}>
                                                <Link href={`/korporativnyye-deystviya/${year}/${month}/${day}/${name}`}>
                                                    <a className={`${classes.doc__action} ${classes.doc__action_download}`} target="_blank" />
                                                </Link>
                                                <Link href={`/corp-dv/${year}/${month}/${day}/${name}`}>
                                                    <a className={`${classes.doc__action} ${classes.doc__action_look}`} target="_blank" />
                                                </Link>
                                            </nav>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </SecondaryLayout>
    )
}


export async function getServerSideProps({ params }) {
    const folder = `./public/corp-dv/${params.year}/${params.month}/${params.day}`

    const { resolve } = require('path')
    const { readFileSync } = require('fs')
    const { readdir } = require('fs').promises

    async function getFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true })
        const files = await Promise.all(dirents.map((dirent) => {
            const path = resolve(dir, dirent.name)
            const doc = readFileSync(path, "utf8")
            return { path, doc }
        }))
        return Array.prototype.concat(...files)
    }

    const data = await getFiles(folder)

    return {
        props: { params, data }
    }
}