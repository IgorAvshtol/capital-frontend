import Link from 'next/link'
import Moment from 'react-moment'
import { useCallback } from 'react'
import { Navbar } from '../../../../components/Navbar'
import { Breadcrumbs } from '../../../../components/Breadcrumbs'
import { SecondaryLayout } from '../../../../layouts/SecondaryLayout'
import { blogPage } from '../../../../styles/scss/blog.module.scss'
import classes from '../../../../styles/scss/about.module.scss'


export default function DocumentsPage({ params, days }) {

    const crumbProps = [
        {
            breadcrumb: 'Корпоративные действия',
            href: '/korporativnyye-deystviya'
        },
    ]

    const useFormatDate = useCallback(
        string => new Date(string)
    )

    return (
        <SecondaryLayout>
            <div className={`main__content ${blogPage}`}>
                <Navbar />
                <section className={classes.documents}>
                    <div className={classes.docs__breadcrambs}>
                        <Breadcrumbs crumbProps={crumbProps} />
                    </div>
                    <div className={classes.documents__block}>
                        <h4 className={`${classes.documents__title} ${classes.documents__title_capitalize}`}>
                            <Moment locale="ru" format="MMMM, YYYY">
                                {useFormatDate(`${params.year}-${params.month}`)}
                            </Moment>
                        </h4>
                        <nav className={classes.documents__list}>
                            {days.map(item => {
                                const { day, files } = item
                                return (
                                    <Link href={`/korporativnyye-deystviya/${params.year}/${params.month}/${day}`} key={day}>
                                        <a className={classes.documents__listItem}>
                                            <p className={classes.documents__listTitle}>
                                                Корпоративные действия за <Moment locale="ru" format="DD.MM.YYYY">
                                                    {useFormatDate(`${params.year}-${params.month}-${day}`)}
                                                </Moment>
                                            </p>
                                            <p className={classes.documents__details}>
                                                <span>{files.length} файлов</span>
                                                <span>
                                                    <Moment locale="ru" format="DD.MM.YYYY">{
                                                        useFormatDate(`${params.year}-${params.month}-${day}`)
                                                            .setDate(useFormatDate(`${params.year}-${params.month}-${day}`)
                                                                .getDate() + 1)}
                                                    </Moment>
                                                </span>
                                            </p>
                                        </a>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </section>
            </div>
        </SecondaryLayout>
    )
}


export async function getServerSideProps({ params }) {
    const fs = require('fs')

    const folder = `./public/corp-dv/${params.year}/${params.month}`
    const folders = fs.readdirSync(folder)
    folders.sort((a, b) => b - a)

    const days = []

    for (let day of folders) {
        const files = fs.readdirSync(`./public/corp-dv/${params.year}/${params.month}/${day}`)
        days.push({ day, files })
    }

    return {
        props: { params, days }
    }
}