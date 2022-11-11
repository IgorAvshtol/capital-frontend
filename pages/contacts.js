import { gql } from '@apollo/client'
import { MainLayout } from '../layouts/MainLayout'
import classes from '../styles/scss/about.module.scss'
import { withApollo } from '../lib/with-qraphql'
import dynamic from 'next/dynamic'


const Feedback = dynamic(() => import('../components/Feedback')
    .then((mod) => mod.Feedback))


export default function Contacts({ contacts, requisites, seo }) {
    return (
        <MainLayout seo={{ ...seo }}>
            <section className={classes.head}>
                <h3 className={classes.head__title}>Контакты</h3>
                <p className={classes.head__desc}>Уважаемые клиенты!</p>
                <p className={classes.head__text}>
                    Обращения, жалобы и предложения в ИК «ФОНДОВЫЙ КАПИТАЛ» могут быть направлены в бумажном или электронном виде,
                    а так же используя форму для обращений.<br /><br />
                    Обращения рассматриваются Компанией в срок, не превышающий 30 (тридцати) дней со дня поступления,
                    а не требующие дополнительного изучения и проверки — не превышающий 15 (пятнадцати) дней,
                    если иной срок не установлен действующим законодательством и нормативно-правовыми актами.
                    Компания вправе запросить у Клиента предоставления дополнительных документов.<br /><br />
                    Обращения, жалобы и предложения на ИК «ФОНДОВЫЙ КАПИТАЛ» могут быть направлены в
                    саморегулируемую организацию НАУФОР на бумажном носителе или в электронном виде через раздел
                    «Пожаловаться на члена НАУФОР» на сайте саморегулируемой организации или по адресу
                    109 004, Москва, ул. Земляной Вал, д. 65, стр. 2.</p>
            </section>

            <Feedback isAbout contacts={contacts} />

            <section className={classes.requisites}>
                <h3 className={classes.requisites__title}>Реквизиты компании</h3>
                <div className={classes.requisites__wrap}>
                    {requisites.map(requisite =>
                        <div className={classes.requisites__row} key={requisite.id}>
                            <p className={classes.requisites__key}>{requisite.key}</p>
                            <p className={classes.requisites__value}>{requisite.value}</p>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    )
}


export async function getStaticProps() {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            requisite {
                requisites {
                    id
                    key
                    value
                }
            }
            seos(where: {link: "/contacts"}) {
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
            requisites: data.requisite.requisites,
            seo: data.seos[0] || null
        },
        revalidate: 60
    }
}