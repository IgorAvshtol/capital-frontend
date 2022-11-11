import Link from 'next/link'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/error.module.scss'


export default function Custom404() {
    return (
        <MainLayout>
            <section className={classes.error}>
                <div className={classes.error__code}>
                    <>404</>
                </div>
                <p className={classes.error__desc}>
                    К сожалению страница не найдена
                </p>
                <Link href="/">
                    <a className="btn">Вернуться на сайт</a>
                </Link>
            </section>
        </MainLayout>
    )
}