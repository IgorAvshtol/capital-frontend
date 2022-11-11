import Link from 'next/link'
import classes from '../styles/scss/benefits.module.scss'


export const Benefits = ({ pageClasses, title }) => {
    return (
        <section className={`${classes.benefits} ${pageClasses}`}>
            {title && <h3 className={classes.benefits__title}>{title}</h3>}
            <div className={classes.benefits__numbers}>
                <div className={classes.benefits__number}>
                    <p>25 лет</p>
                    <p>в 1996 году был открыт первый брокерский счёт в нашей компании</p>
                </div>
                <div className={classes.benefits__number}>
                    <p>10 минут</p>
                    <p>необходимо, чтобы открыть счёт без визита в офис</p>
                </div>
                <div className={classes.benefits__number}>
                    <p>4000+ ценных бумаг</p>
                    <p>Московская Биржа + СПБ Биржа</p>
                </div>
            </div>
            <div className={classes.benefits__content}>
                <div className={`${classes.benefits__numbers} ${classes.benefits__numbers_yellow}`}>
                    <div className={classes.benefits__number}>
                        <p>0 рублей</p>
                        <p>обслуживание брокерского счёта</p>
                    </div>
                    <div className={classes.benefits__number}>
                        <p>0% комиссии</p>
                        <p>комиссию от оборота берёт только биржа</p>
                    </div>
                    <div className={classes.benefits__number}>
                        <p>0% комиссии</p>
                        <p>нет комиссии брокера за зачисление и вывод средств</p>
                    </div>
                </div>
                <div className={classes.benefits__contentCta}>
                    <p>Почему мы не берём комиссию?</p>
                    <Link href="/business"><a className="btn btn_secondary">Подробнее</a></Link>
                </div>
            </div>
        </section>
    )
}