import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useRef } from 'react'
import classes from '../styles/scss/feedback.module.scss'

import { YMaps, Map, Placemark } from 'react-yandex-maps'


const phonePattern = /^[\+|\d][\d\(\)\-\s]{10,20}$/i


const initialForm = {
    name: '',
    tel: "+7",
    terms: true,
    message: '',
    files: [],
}


export const Feedback = ({ isAbout, contacts }) => {
    const fileInput = useRef(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isForm, setIsForm] = useState(true)
    const [form, setForm] = useState(initialForm)

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const uploadToClient = (e) => {
        if (e.target.files.length) {
            const files = Array.from(e.target.files)
            setForm({ ...form, files: [...form.files, ...files] })
            e.target.value = ''
        }
    }

    const deleteFileHandler = e => {
        const key = e.target.id
        const files = [...form.files]
        files.splice(Number(key), 1)
        setForm({ ...form, files })
    }

    const submitHandler = async () => {
        setLoading(true)
        const filesIDs = []

        const phoneValid = phonePattern.test(form.tel.replace(/ /g, ''))

        if (!phoneValid || !form.terms) {
            setLoading(false)
            return alert(`${!phoneValid ? 'Некорректный номер' + '\n' : ''}\
            ${!form.terms ? 'Согласитесь с политикой конфиденциальности' : ''}`)
        }

        try {
            if (!form.files.length) return

            const formData = new FormData()
            for (let file of form.files) formData.append('files', file)

            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/upload`,
                { method: 'POST', body: formData }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            for (let file of data) filesIDs.push(file.id)

        } catch (e) { }

        finally {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/leads`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...form, files: filesIDs })
                    }
                )

                const data = await res.json()
                if (!res.ok) throw new Error(data.message)

                setForm(initialForm)
                setLoading(false)
                setSuccess(true)
            } catch (error) {
                console.log(error.message)
                setLoading(false)
            }
        }
    }

    return (
        <section className={classes.feedback}>
            <div className={classes.feedback__content}>
                {success &&
                    <div className={classes.feedback__success}>
                        <span className={classes.feedback__icon}>
                            <Image
                                src="/images/ic-success.svg"
                                alt="success"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="center"
                            />
                        </span>
                        <h3 className={classes.feedback__title}>Ваше обращение успешно отправлено</h3>
                        <p className={classes.feedback__desc}>
                            Ваше обращение успешно отправлено.
                            Ожидайте ответного письма на адрес эл. почты:&nbsp;
                            <a href="mailto:your@mail.com">your@mail.com</a>
                        </p>
                        <button
                            onClick={() => setSuccess(!success)}
                            className={classes.feedback__btn}>
                            Написать повторно
                        </button>
                    </div>
                }
                {isAbout
                    ?
                    <React.Fragment>
                        <h3 className={classes.feedback__title}>Написать нам</h3>
                        <p className={classes.feedback__desc}>Будем рады ответить на все ваши вопросы, касающиеся инвестиций.</p>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <h3 className={classes.feedback__title}>Остались вопросы?</h3>
                        <p className={classes.feedback__desc}>Свяжитесь с АО ИК «Фондовый Капитал» удобным для Вас способом.
                            Наша команда специалистов готова ответит на любые вопросы.</p>
                    </React.Fragment>
                }

                {!isAbout && <ul className={classes.feedback__tabs}>
                    <li className={`${classes.feedback__tab} 
                        ${isForm && classes.feedback__tab_active}`}
                        onClick={() => setIsForm(true)}>Заказать звонок</li>
                    <li className={`${classes.feedback__tab} 
                        ${!isForm && classes.feedback__tab_active}`}
                        onClick={() => setIsForm(false)}>Позвонить</li>
                </ul>}

                <div className={classes.feedback__form}>
                    {!isForm &&
                        <div className={classes.feedback__cover}>
                            <a className={classes.feedback__call} href={`tel:${contacts.phones[0].url}`}>
                                <p className={classes.feedback__callTitle}>{contacts.phones[0].title}</p>
                                <p>Бесплатные звонки по России</p>
                            </a>
                        </div>
                    }
                    <div className={classes.feedback__inputs}>
                        <input className={classes.feedback__input}
                            name='name'
                            type="text"
                            value={form.name}
                            onChange={changeHandler}
                            placeholder="Имя" />
                        <input className={classes.feedback__input}
                            name='tel'
                            type="text"
                            value={form.tel}
                            onChange={changeHandler} placeholder="Номер телефона" />
                        {isAbout && <textarea className={classes.feedback__input}
                            rows="3"
                            type="text"
                            name='message'
                            value={form.message}
                            onChange={changeHandler} placeholder="Сообщение" />}

                        {isAbout && <div className={classes.uploadFile}>
                            <label
                                htmlFor="file"
                                className={classes.uploadFile__label}
                            >
                                Прикрепить файл</label>
                            <input
                                multiple
                                id="file"
                                type="file"
                                name="file"
                                ref={fileInput}
                                onChange={uploadToClient}
                                className={classes.uploadFile__input}
                            />
                            <ul className={classes.uploadFile__files}>
                                {!!form.files.length && form.files.map((file, index) =>
                                    <li
                                        id={index}
                                        key={index}
                                        onClick={deleteFileHandler}
                                        className={classes.uploadFile__file}>
                                        <p className={classes.uploadFile__title}>{file.name}</p>
                                        <p>{Number((file.size / 1000000).toFixed(2))} MB</p>
                                    </li>
                                )}
                            </ul>
                        </div>}
                    </div>

                    <label className={classes.feedback__checkbox}>
                        <input
                            name="terms"
                            type="checkbox"
                            checked={form.terms}
                            value={form.terms}
                            onChange={e => setForm({ ...form, [e.target.name]: !form.terms })} />
                        <span className={classes.feedback__checkmark} />
                        <span>Я предоставляю согласие на обработку&nbsp;
                            <Link href="https://admin.ikfk.ru/uploads/personal_data_c1796a7855.pdf">
                                <a target="_blank">персональных данных</a>
                            </Link>
                        </span>
                    </label>
                    <button
                        disabled={loading}
                        onClick={submitHandler}
                        className={classes.feedback__btn}>
                        Отправить
                    </button>
                </div>
            </div>

            {isAbout ?
                <div className={classes.details}>
                    <div className={classes.details__wrap}>
                        <div className={classes.details__item}>
                            <p className={classes.details__itemTitle}>Номер телефона</p>
                            {contacts && contacts.phones.map(((phone, index) =>
                                <Link href={`tel:${phone.url}`} key={index}>
                                    <a className={classes.details__itemLink}>{phone.title}</a>
                                </Link>
                            ))}
                        </div>
                        <div className={classes.details__item}>
                            <p className={classes.details__itemTitle}>Эл. почта</p>
                            {contacts && contacts.emails.map(((email, index) =>
                                <Link href={`mailto:${email.url}`} key={index}>
                                    <a className={classes.details__itemLink}>{email.title}</a>
                                </Link>
                            ))}
                        </div>
                        <div className={classes.details__item}>
                            <p className={classes.details__itemTitle}>Главный офис</p>
                            {contacts && contacts.adresses.map(((adress, index) =>
                                <p className={classes.details__itemText} key={index}>{adress.string}</p>
                            ))}
                        </div>
                    </div>
                    <div className={classes.details__map}>
                        <YMaps
                            query={{
                                ns: 'use-load-option',
                                load: 'control.FullscreenControl',
                            }}>
                            <Map
                                className={classes.details__mapWrap}
                                defaultState={{
                                    center: [
                                        contacts.location.lat,
                                        contacts.location.lng
                                    ],
                                    zoom: 9,
                                    controls: ['fullscreenControl'],
                                }}>
                                <Placemark
                                    geometry={[
                                        contacts.location.lat,
                                        contacts.location.lng]}
                                />
                            </Map >
                        </YMaps>
                    </div>
                </div> :
                <div className={classes.feedback__picWrap}>
                    <div className={classes.feedback__pic}>
                        <Image
                            src={`/images/test-img.png`}
                            alt="pic"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="center 80px"
                        />
                    </div>
                </div>}
            <div className={`${classes.mob} ${isAbout ? classes.mob_none : ''}`}>
                <span className={classes.mob__span}>Или</span>
                <div className={classes.mob__wrap}>
                    <p className={classes.mob__title}>Позвоните нам</p>
                    <p className={classes.mob__desc}>По территории России звонки бесплатные </p>
                    <Link href={`tel:${contacts?.phones[0].url}`}>
                        <a className={`btn ${classes.mob__btn}`}>
                            {contacts?.phones[0].title}
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    )
}