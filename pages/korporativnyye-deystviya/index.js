import Link from 'next/link'
import Moment from 'react-moment'
import { useState, useEffect } from 'react'
import { Navbar } from '../../components/Navbar'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { SecondaryLayout } from '../../layouts/SecondaryLayout'
import { blogPage } from '../../styles/scss/blog.module.scss'
import classes from '../../styles/scss/about.module.scss'


export default function Deystviya({ data }) {
    const [currentYear, setCurrentYear] = useState(null)

    const crumbProps = [
        {
            breadcrumb: 'Корпоративные действия',
            href: '/korporativnyye-deystviya'
        },
    ]

    useEffect(() => {
        setCurrentYear(data[0].year)
    }, [])

    return (
        <SecondaryLayout>
            <div className={`main__content ${blogPage}`}>
                <Navbar />
                <section className={classes.documents}>
                    <div className={classes.docs__breadcrambs}>
                        <Breadcrumbs crumbProps={crumbProps} />
                    </div>
                    <h4 className={classes.documents__title}>Корпоративные действия</h4>
                    {data.length &&
                        <div className={classes.docs__tabs}>
                            {data.map(item => <div key={item.year}
                                className={`${classes.docs__tab} 
                                ${item.year === currentYear && classes.docs__tab_active}`}
                                onClick={() => setCurrentYear(item.year)}>
                                {item.year}
                            </div>
                            )}
                        </div>
                    }
                    {data.map(item => item.year === currentYear &&
                        <div className={classes.documents__block} key={item.year}>
                            <nav className={classes.documents__list}>
                                {item.months.map(month =>
                                    <Link href={`/korporativnyye-deystviya/${item.year}/${month}`} key={month}>
                                        <a className={classes.documents__listItem}>
                                            <p className={`${classes.documents__listTitle} 
                                            ${classes.documents__listTitle_capitalize}`}>
                                                <Moment locale="ru" format="MMMM">{month}</Moment>
                                            </p>
                                            <p className={classes.documents__details}>{item.year} год</p>
                                        </a>
                                    </Link>
                                )}
                            </nav>
                        </div>
                    )}
                </section>
            </div>
        </SecondaryLayout>
    )
}


export async function getServerSideProps() {
    const testFolder = './public/corp-dv'
    const { resolve } = require('path')
    const fs = require('fs')

    const years = fs.readdirSync(testFolder)

    const data = years.map(year => {
        const months = fs.readdirSync(resolve(testFolder, year))
            .sort((a, b) => b - a)
        return { year, months }
    })

    data.sort((a, b) => b.year - a.year)

    return {
        props: { data }
    }
}