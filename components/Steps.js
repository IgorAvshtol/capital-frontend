import classes from '../styles/scss/steps.module.scss'


export const Steps = ({ pageClasses }) => {
    return (
        <section className={`section ${classes.stepsPage} ${pageClasses}`}>
            <h3 className="section__title section__title_mar">Как начать</h3>
            <div className={classes.steps}>
                <div className={classes.step}>
                    <span className={classes.step__number}>01</span>
                    <div>
                        <p className={classes.step__title}>Откройте брокерский счёт</p>
                        <p className={classes.step__desc}>Бесплатно откройте брокерский счёт всего за несколько минут.
                        Понадобится паспорт, ИНН и СНИЛС.</p>
                    </div>
                </div>
                <div className={classes.step}>
                    <span className={classes.step__number}>02</span>
                    <div>
                        <p className={classes.step__title}>Пополните счёт</p>
                        <p className={classes.step__desc}>Пополните баланс своего счёта из любого
                        российского банка. Без комиссии за зачисление.</p>
                    </div>
                </div>
                <div className={classes.step}>
                    <span className={classes.step__number}>03</span>
                    <div>
                        <p className={classes.step__title}>Начните инвестировать</p>
                        <p className={classes.step__desc}>Поможем выбрать инструменты для инвестирования.
                        Торгуйте с помощью стационарного терминала или мобильного приложения.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}