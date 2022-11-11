import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { gql } from '@apollo/client'
import React, { useState } from 'react'
import classes from '../styles/scss/auth.module.scss'
import { withApollo } from '../lib/with-qraphql'


export default function Login({ seo }) {
    const [form, setForm] = useState({
        tel: "+7",
        pass: "",
    })

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
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
                                <h3 className={classes.form__title}>Личный кабинет</h3>
                                <p className={classes.form__desc}>Еще нет аккаунта?&nbsp;
                                    <Link href='/registration'><a>Создать</a></Link></p>
                                <div className={classes.form__inputs}>
                                    <input className={classes.form__input}
                                        name='tel'
                                        type="text"
                                        value={form.tel}
                                        onChange={changeHandler}
                                        placeholder="Номер телефона" />
                                    <input className={classes.form__input}
                                        name='pass'
                                        type="password"
                                        value={form.pass}
                                        onChange={changeHandler}
                                        placeholder="Пароль" />
                                </div>
                                <button className={classes.form__btn}>Войти</button>
                                <p className={classes.form__restore}>Забыли пароль?&nbsp;
                                    <Link href="/"><a>Восстановить</a></Link>
                                </p>
                            </form>
                        </div>
                    </div>

                    <div className={classes.auth__right}>
                        <div className={classes.auth__rightWrap}>
                            <p className={classes.auth__sliderTitle}>
                                Откройте счёт бесплатно за 5 минут
                            </p>
                            <div className={classes.auth__rightPic}>
                                <Image
                                    src="/images/auth-pic.png"
                                    alt="pic"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center bottom"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps({ resolvedUrl }) {
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
        props: { seo: data.seos[0] || null },
    }
}