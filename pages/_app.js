import React from 'react'
import { DefaultSeo } from 'next-seo'
import WithGraphQL from '../lib/with-qraphql'
import NextNprogress from 'nextjs-progressbar'
import { AppWrapper } from '../lib/context'
import seo from '../next-seo.config'
import '../styles/scss/main.scss'



export default function MyApp({ Component, pageProps }) {
    return (
        <WithGraphQL>
            <AppWrapper>
                <DefaultSeo {...seo} />
                <NextNprogress
                    showSpinner // defautl
                    color="#ffc75a"
                    stopDelayMs={200}
                    startPosition={0.2}
                    options={{
                        easing: 'ease', // defautl
                        speed: 500
                    }}
                />
                <Component {...pageProps} />
            </AppWrapper>
        </WithGraphQL>
    )
}