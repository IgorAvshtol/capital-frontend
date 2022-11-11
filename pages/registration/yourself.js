import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { gql } from '@apollo/client'
import React, { useState } from 'react'
import classes from '../../styles/scss/auth.module.scss'
import { withApollo } from '../../lib/with-qraphql'


export default function Yourself({ seo }) {
    const [form, setForm] = useState({
        surname: "",
        name: "",
        middleName: "",
        snils: "",
        mail: "",
        pass: "",
        secPass: "",
        agreement: true,
        terms: true
    })

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = e => {
        e.preventDefault()
        console.log(form)
    }

    return (
        <React.Fragment>
            <NextSeo {...seo} />
            <div className="main main_bg">
                <div className={classes.auth}>
                    <div className={classes.auth__left}>
                        <Link href="/">
                            <a className={classes.auth__logo}>
                                <Image
                                    src="/images/logo-small.svg"
                                    alt="pic"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="left center"
                                />
                            </a>
                        </Link>
                        <Link href="/registration?ways=true"><a className={classes.auth__backBtn}>Вернуться</a></Link>

                        <div className={classes.auth__leftContent}>
                            <form className={classes.form}>
                                <h3 className={`${classes.form__title} ${classes.form__title_yourself}`}>
                                    Заполните форму, чтобы открыть счёт</h3>
                                <div className={classes.form__inputs}>
                                    <input className={classes.form__input}
                                        type="text"
                                        name="surname"
                                        value={form.surname}
                                        onChange={changeHandler}
                                        placeholder="Фамилия" />
                                    <input className={classes.form__input}
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={changeHandler}
                                        placeholder="Имя" />
                                    <input className={classes.form__input}
                                        type="text"
                                        name="middleName"
                                        value={form.middleName}
                                        onChange={changeHandler}
                                        placeholder="Отчество" />
                                    <input className={classes.form__input}
                                        type="text"
                                        name="snils"
                                        value={form.snils}
                                        onChange={changeHandler}
                                        placeholder="СНИЛС" />
                                    <input className={classes.form__input}
                                        type="text"
                                        name="mail"
                                        value={form.mail}
                                        onChange={changeHandler}
                                        placeholder="Эл. почта" />
                                    <input className={classes.form__input}
                                        type="password"
                                        name="pass"
                                        value={form.pass}
                                        onChange={changeHandler}
                                        placeholder="Пароль" />
                                    <input className={classes.form__input}
                                        type="password"
                                        name="secPass"
                                        value={form.secPass}
                                        onChange={changeHandler}
                                        placeholder="Подтверждение пароля" />
                                    <label className={classes.form__checkbox}>
                                        <input
                                            type="checkbox"
                                            name="agreement"
                                            checked={form.agreement}
                                            value={form.agreement}
                                            onChange={e => setForm({ ...form, [e.target.name]: !form.agreement })} />
                                        <span className={classes.form__checkmark} />
                                        Соглашение об использовании эл. документа.
                                    </label>
                                    <label className={classes.form__checkbox}>
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={form.terms}
                                            value={form.terms}
                                            onChange={e => setForm({ ...form, [e.target.name]: !form.terms })} />
                                        <span className={classes.form__checkmark} />
                                        Обработка и передача персональных данных.
                                    </label>
                                </div>
                                <button
                                    onClick={submitHandler}
                                    className={classes.form__btn}>Отправить</button>
                            </form>
                        </div>

                    </div>
                    <div className={`${classes.auth__right} ${classes.auth__right_yourself}`}>
                        <div className={`${classes.auth__rightWrap} ${classes.auth__rightWrap_yourself}`}>
                            <div className={classes.yourself}>
                                <p>Если у вас возникли вопросы, свяжитесь с нами.</p>
                                <Link href="+tel:88002007918"><a>8 800 200 79 18</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
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
        props: { seo: data.seos[0] ? data.seos[0] : null }
    }
}