import React from 'react'


export const MobMenu = ({ handler, services }) => {
    return (
        <div className="menu">
            <div className="menu__head">
                <a href="tel:+88002007918" className="menu__tel">8 800 200 79 18</a>
                <button onClick={handler} className="menu__closeBtn" />
            </div>
            <div className="menu__auth">
                <a href="https://lk.ikfk.ru/users/sign_in" className="menu__btn">Войти</a>
                <a href="/registration" className="menu__btn menu__btn_secondary">Открыть счёт</a>
            </div>
            <div className="menu__links">
                <ul className="menu__list">
                    <li className="menu__title">Услуги</li>
                    {services.map(service =>
                        <li className="menu__link" key={service.slug}>
                            <a href={`/${service.slug}`}>{service.title}</a>
                        </li>)}
                </ul>
                <ul className="menu__list">
                    <li className="menu__title">О нас</li>
                    <li className="menu__link">
                        <a href="/about">О компании</a>
                    </li>
                    <li className="menu__link">
                        <a href="/business">Бизнес-модель</a>
                    </li>
                    <li className="menu__link">
                        <a href="/media">Мы в СМИ</a>
                    </li>
                    <li className="menu__link">
                        <a href="/licenses">Лицензии</a>
                    </li>
                    <li className="menu__link">
                        <a href="/raskrytie-informatsii">Раскрытие информации</a>
                    </li>
                    <li className="menu__link">
                        <a href="/contacts">Контакты</a>
                    </li>
                </ul>
                <ul className="menu__list">
                    <li className="menu__title">Информация</li>
                    <li className="menu__link">
                        <a href="/tariffs">Тарифы</a>
                    </li>
                    <li className="menu__link">
                        <a href="/ideas">Инвестидеи</a>
                    </li>
                    <li className="menu__link">
                        <a href="/training">Обучение</a>
                    </li>
                    <li className="menu__link">
                        <a href="/questions">Вопросы и ответы</a>
                    </li>
                    <li className="menu__link">
                        <a href="/blog">Блог, новости и аналитика</a>
                    </li>
                    <li className="menu__link">
                        <a href="/korporativnyye-deystviya">Корпоративные действия</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}