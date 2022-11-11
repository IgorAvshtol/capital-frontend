import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { gql } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import classes from '../../styles/scss/auth.module.scss'
import { withApollo } from '../../lib/with-qraphql'
import cookieCutter from 'cookie-cutter'


const phonePattern = /^[\+|\d][\d\(\)\-\s]{10,20}$/i


export default function Registration({ seo, ways }) {
    const [isWays, setIsWays] = useState(false)
    const [form, setForm] = useState({ name: "", phone: "", terms: true })

    useEffect(() => {
        setIsWays(!!ways)
        setForm({ name: "", phone: "+7", terms: true })
    }, [])

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = async e => {
        e.preventDefault()
        const { name, phone, terms } = form
        const phoneValid = phonePattern.test(phone.replace(/ /g, ''))

        if (!name || !phoneValid || !terms) {
            alert(`${!name ? 'Введите имя' + '\n' : ''
                }${!phoneValid ? 'Некорректный номер' + '\n' : ''
                }${!terms ? 'Согласитесь с нашей политикой конфиденциальности' : ''}
            `)
        } else {
            const roistatVisit = cookieCutter.get('roistat_visit')

            const params = {
                roistat: roistatVisit || 'nocookie',
                key: process.env.NEXT_PUBLIC_ROISTAT_API_KEY,
                name: form.name,
                phone: form.phone,
            }

            const queryString = Object.keys(params).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
            }).join('&')

            await fetch(`${process.env.NEXT_PUBLIC_ROISTAT_HOST}/api/proxy/1.0/leads/add?${queryString}`,
                { mode: 'no-cors' })

            setIsWays(true)
        }
    }

    if (isWays) return <Ways backHandler={() => setIsWays(false)} />

    return (
        <React.Fragment>
            <NextSeo {...seo} />
            <div className={`main main_bg`}>
                <div className={classes.auth}>
                    <div className={classes.auth__left}>
                        <Link href="/">
                            <a className={classes.auth__logo}>
                                <Image
                                    src="/images/logo.svg"
                                    alt="pic"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="left center"
                                />
                            </a>
                        </Link>
                        <Link href="/"><a className={classes.auth__backBtn}>Вернуться</a></Link>
                        <div className={classes.auth__leftContent}>
                            <form className={classes.form}>
                                <h3 className={classes.form__title}>Откройте брокерский счёт</h3>
                                <p className={classes.form__desc}>Уже есть аккаунт?&nbsp;
                                    <Link href='/registration'><a>Войти</a></Link></p>
                                <div className={classes.form__inputs}>
                                    <input className={classes.form__input}
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={changeHandler}
                                        placeholder="Ваше имя" />
                                    <input className={classes.form__input}
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={changeHandler}
                                        placeholder="Номер телефона" />
                                    <label className={classes.form__checkbox}>
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={form.terms}
                                            value={form.terms}
                                            onChange={e => setForm({ ...form, [e.target.name]: !form.terms })} />
                                        <span className={classes.form__checkmark} />
                                        <span>Переходя к регистрации, Вы соглашаетесь на&nbsp;
                                            <Link href="https://admin.ikfk.ru/uploads/personal_data_c1796a7855.pdf">
                                                <a target="_blank">передачу и обработку своих персональных данных.</a>
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                                <button
                                    onClick={submitHandler}
                                    className={classes.form__btn}>Отправить</button>
                            </form>
                        </div>
                    </div>

                    <div className={`${classes.auth__right} ${classes.auth__right_reg}`}>
                        <div className={`${classes.auth__rightWrap} ${classes.auth__rightWrap_reg}`}>
                            <p className={classes.auth__rightTitle}>Брокерский счёт можно открыть двумя способами</p>
                            <div className={classes.auth__ways}>
                                <div className={classes.auth__way}>
                                    <div className={classes.auth__wayPic}>
                                        <Image
                                            src="/images/ic-gos.svg"
                                            alt="pic"
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="center"
                                        />
                                    </div>
                                    <div className={classes.auth__wayContent}>
                                        <p className={classes.auth__wayTitle}>Через Госуслуги</p>
                                        <p className={classes.auth__wayDesc}>Паспорт, ИНН и СНИЛС. 3 минуты для открытия</p>
                                    </div>
                                </div>
                                <div className={classes.auth__way}>
                                    <div className={classes.auth__wayPic}>
                                        <Image
                                            src="/images/ic-user.svg"
                                            alt="pic"
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="center"
                                        />
                                    </div>
                                    <div className={classes.auth__wayContent}>
                                        <p className={classes.auth__wayTitle}>Самостоятельно</p>
                                        <p className={classes.auth__wayDesc}>Паспорт, ИНН и СНИЛС. 5 минут для открытия</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.auth__rightFooter}>
                                <p>Если остались вопросы, звоните!</p>
                                <Link href="tel:+88002007918">8 800 200 79 18</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}


const Ways = ({ backHandler }) => {
    const [wayId, setWayId] = useState(1)
    const [listId, setListId] = useState(1)

    const overHandler = e => {
        const id = Number(e.currentTarget.id)
        if (wayId !== id) {
            setWayId(id)
            setListId(1)
        }
    }

    return (
        <div className={`main main_bg`}>
            <div className={classes.auth}>
                <div className={classes.auth__left}>
                    <Link href="/">
                        <a className={classes.auth__logo}>
                            <Image
                                src="/images/logo.svg"
                                alt="pic"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="left center"
                            />
                        </a>
                    </Link>
                    <p onClick={backHandler} className={classes.auth__backBtn}>Вернуться</p>
                    <div className={classes.auth__leftContent}>
                        <h3 className={classes.form__title}>Открытие счёта</h3>
                        <p className={classes.form__desc}>Выберете удобный способ открытия счёта.</p>
                        <div className={classes.auth__ways}>
                            <Link href="https://lk.ikfk.ru/users/auth/esia_oauth">
                                <a id="1" onMouseOver={overHandler}
                                    className={`${classes.auth__way} ${classes.auth__way_link} 
                                    ${wayId === 1 && classes.auth__way_active}`}>
                                    <div className={classes.auth__wayPic}>
                                        <Image
                                            src="/images/ic-gos.svg"
                                            alt="pic"
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="center"
                                        />
                                    </div>
                                    <div className={classes.auth__wayContent}>
                                        <p className={classes.auth__wayTitle}>Через Госуслуги</p>
                                        <p className={classes.auth__wayDesc}>Паспорт, ИНН и СНИЛС. 3 минуты для открытия</p>
                                    </div>
                                </a>
                            </Link>

                            <Link href="https://lk.ikfk.ru/users/sign_up">
                                <a id="2" onMouseOver={overHandler}
                                    className={`${classes.auth__way} ${classes.auth__way_link} 
                                    ${wayId === 2 && classes.auth__way_active}`}>
                                    <div className={classes.auth__wayPic}>
                                        <Image
                                            src="/images/ic-user.svg"
                                            alt="pic"
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="center"
                                        />
                                    </div>
                                    <div className={classes.auth__wayContent}>
                                        <p className={classes.auth__wayTitle}>Самостоятельно</p>
                                        <p className={classes.auth__wayDesc}>Понадобится не больше 5 минут, чтобы заполнить форму</p>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={`${classes.auth__right} ${classes.auth__right_reg}`}>
                    <div className={`${classes.auth__rightWrap} ${classes.auth__rightWrap_reg}`}>
                        <h3 className={classes.auth__rightTitle}>Вам понадобится</h3>
                        <ol className={classes.auth__rightList}>
                            <li onClick={() => setListId(1)}
                                className={`${classes.listItem} ${listId === 1 ? classes.listItem__active : null}`}>
                                <p className={classes.listItem__title} data-num="01">Паспорт</p>
                                <div className={classes.listItem__content}>
                                    <p className={classes.listItem__text}>
                                        Присваивается налоговой записи как юридических,
                                        так и физических лиц в Федеральной налоговой службе (сокращённо — ФНС России).</p>
                                </div>
                            </li>
                            <li onClick={() => setListId(2)}
                                className={`${classes.listItem} ${listId === 2 ? classes.listItem__active : null}`}>
                                <p className={classes.listItem__title} data-num="02">ИНН</p>
                                <div className={classes.listItem__content}>
                                    <p className={classes.listItem__text}>
                                        Присваивается налоговой записи как юридических,
                                        так и физических лиц в Федеральной налоговой службе (сокращённо — ФНС России).</p>
                                </div>
                            </li>
                            <li onClick={() => setListId(3)}
                                className={`${classes.listItem} ${listId === 3 ? classes.listItem__active : null}`}>
                                <p className={classes.listItem__title} data-num="03">СНИЛС</p>
                                <div className={classes.listItem__content}>
                                    <p className={classes.listItem__text}>
                                        Уникальный номер индивидуального лицевого счёта застрахованного лица
                                        в системе обязательного пенсионного страхования.</p>
                                    <div className={classes.listItem__pic}>
                                        <Image
                                            src="/images/reg-pic.png"
                                            alt="pic"
                                            width="215"
                                            height="144" />
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => setListId(4)}
                                className={`${classes.listItem} ${listId === 4 ? classes.listItem__active : null}`}>
                                <p className={classes.listItem__title} data-num="04">3 минуты вашего времени</p>
                                <div className={classes.listItem__content}>
                                    <p className={classes.listItem__text}>
                                        Уникальный номер индивидуального лицевого счёта застрахованного лица
                                        в системе обязательного пенсионного страхования.</p>
                                </div>
                            </li>
                        </ol>

                        <div className={`${classes.auth__rightFooter} ${classes.auth__rightFooter_list}`}>
                            <p>Если остались вопросы, звоните!</p>
                            <Link href="tel:+88002007918">8 800 200 79 18</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps({ resolvedUrl, query }) {
    const client = withApollo()
    const { data } = await client.query({
        query: gql`query { 
            seos(where: {link: "${decodeURI(resolvedUrl)}"}) {
                title
                description
                noindex
            }
        }`
    })

    return {
        props: {
            ways: query.ways || false,
            seo: data.seos[0] || null
        }
    }
}