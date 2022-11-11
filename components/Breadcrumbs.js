import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classes from '../styles/scss/article.module.scss'


const convertBreadcrumb = string => {
    return string
        .replace(/-/g, ' ')
    // .replace(/oe/g, 'ö')
    // .replace(/ae/g, 'ä')
    // .replace(/ue/g, 'ü')
}


export const Breadcrumbs = ({ crumbProps }) => {
    const router = useRouter()
    const [breadcrumbs, setBreadcrumbs] = useState(null)

    useEffect(() => {
        if (router && !crumbProps) {
            const linkPath = router.asPath.split('/')
            linkPath.shift()

            const pathArray = linkPath.map((path, i) => {
                return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') }
            })
            return setBreadcrumbs(pathArray)
        }
        return setBreadcrumbs(crumbProps)
    }, [router])

    if (!breadcrumbs) {
        return null
    }

    return (
        <nav className={classes.breadcrumbs} aria-label="breadcrumbs">
            <ol className={classes.breadcrumbs__wrap}>
                <li className={classes.breadcrumbs__item}>
                    <Link href={'/'}><a>Главная</a></Link>
                </li>
                {breadcrumbs.map((breadcrumb, index) => {
                    return (
                        <li key={index} className={classes.breadcrumbs__item}>
                            <Link href={breadcrumb.href}>
                                <a>{convertBreadcrumb(breadcrumb.breadcrumb)}</a>
                            </Link>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}