import Link from 'next/link'
import Image from 'next/image'
import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/about.module.scss'
import servClasses from '../styles/scss/service.module.scss'
import { withApollo } from '../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../components/Feedback')
    .then((mod) => mod.Feedback))


export default function Business({ seo, contacts }) {
    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>Бизнес-модель АО ИК «Фондовый Капитал»</h3>
                <p className={classes.head__desc}>
                    Стратегия развития АО ИК «Фондовый Капитал» отражает последние тенденции на фондовом рынке – нет брокерской комиссии от оборота,
                    фиксированной брокерской комиссии и платы за депозитарий. Компания зарабатывает на дополнительных услугах,
                    которыми пользуется значительная часть опытных клиентов.
                </p>
                <div className={classes.head__benefits}>
                    <div className={classes.head__benefit}>
                        <p>0 рублей</p>
                        <p>обслуживание брокерского счёта</p>
                    </div>
                    <div className={classes.head__benefit}>
                        <p>0% комиссии</p>
                        <p>комиссию от сделок берет только биржа</p>
                    </div>
                    <div className={classes.head__benefit}>
                        <p>0% комиссии</p>
                        <p>нет комиссии за зачисление и вывод средств</p>
                    </div>
                </div>
            </section>

            <section className={classes.commission}>
                <div className={classes.commission__wrap}>
                    <div className={classes.commission__content}>
                        <h3 className={classes.commission__title}>Почему мы не берём комиссию за сделки?</h3>
                        <div className={classes.commission__text}>
                            <p>Комиссия за сделку — это отголосок прошлого, когда все сделки совершались по телефону через своего брокера,
                                а тот, в свою очередь, связывался с сотрудником на бирже, который и выставлял заявку. Сейчас достаточно одного клика.</p>
                            <br /><br />
                            <p>АО ИК «Фондовый капитал» не несет никаких расходов, если клиент совершает сделки в Quik,
                                потому что в этих операциях не задействован ни один из сотрудников.
                                Наша бизнес-модель широко распространена среди иностранных брокеров и хорошо себя зарекомендовала.</p>
                        </div>
                    </div>
                    <div className={classes.commission__right}>
                        <h4 className={classes.commission__rightTitle}>На чем мы зарабатываем?</h4>
                        <div className={classes.commission__text}>
                            <p>Примерно каждый второй клиент компании пользуется дополнительными услугами, которые и приносят прибыль.
                                Это может быть доверительное управление, структурные продукты, маржинальное кредитование.</p>
                            <br /><br />
                            <p>Операционные расходы, связанные с сопровождением сделок, одинаковы и не зависят от количества клиентов.
                                Такой подход к построению бизнес-модели позволяет нам не брать с клиентов комиссию от оборота и оставаться при этом прибыльной компанией.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={servClasses.documents}>
                <div className={servClasses.documents__picWrap}>
                    <div className={servClasses.documents__pic}>
                        <Image
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left center"
                            src="/images/docs-pic.png"
                        />
                    </div>
                </div>
                <div className={servClasses.documents__content}>
                    <h3 className={servClasses.documents__title}>Тарифы, документы и лицензии</h3>
                    <p className={servClasses.documents__desc}>
                        У нас есть все необходимые документы и лицензии чтобы оказать вам услуги качественно и законно.
                        Тут вы сможете познакомиться с нами ближе и убедиться в нашей компетенции.</p>
                    <div className={servClasses.documents__btns}>
                        <Link href='/raskrytie-informatsii'>
                            <a className={`btn ${servClasses.documents__btn}`}>Документы</a>
                        </Link>
                        <Link href='/licenses'>
                            <a className={`btn btn_secondary ${servClasses.documents__btn}`}>Лицензии</a>
                        </Link>
                    </div>
                </div>
            </section>
            <Feedback contacts={contacts} />
            <section className={classes.cta}>
                <h3 className={classes.cta__title}>Начните инвестировать, используя нашу бизнес-модель</h3>
                <Link href='/registration'>
                    <a className={`btn ${servClasses.cta__btn}`}>открыть брокерский счёт</a>
                </Link>
            </section>
        </MainLayout>
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            seos(where: {link: "/business"}) {
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
                adresses {
                    string
                }
                location {
                    lat
                    lng
                }
            }
        }`
    })

    return {
        props: {
            contacts: data.contact,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}