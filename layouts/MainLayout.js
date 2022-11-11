import React from 'react'
import Script from 'next/script'
import { NextSeo } from 'next-seo'
import { Navbar } from '../components/Navbar'
import dynamic from 'next/dynamic'


const Footer = dynamic(() => import('../components/Footer')
    .then((mod) => mod.Footer), { ssr: false, })


export const MainLayout = ({ children, seo = {} }) => {
    return (
        <React.Fragment>
            <NextSeo {...seo} />
            <Script id="googletagmanager">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-MC2DQLT');`}
            </Script>
            <Script id="yandexmetrika">
                {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    ym(55537267, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true});`}
            </Script>
            <Script id="roistat">
                {`(function(w, d, s, h, id) {
                    w.roistatProjectId = id; w.roistatHost = h;
                    var p = d.location.protocol == "https:" ? "https://" : "http://";
                    var u = /^.*roistat_visit=[^;]+(.*)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/"+id+"/init?referrer="+encodeURIComponent(d.location.href);
                    var js = d.createElement(s); js.charset="UTF-8"; js.async = 1; js.src = p+h+u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
                    })(window, document, 'script', 'cloud.roistat.com', 'ac1664e0d96380edbea124c86f779f55');`}
            </Script>
            <div className={`main main_bg`}>
                <Navbar />
                <main className="main__content">
                    {children}
                </main>
                <Footer />
            </div>
        </React.Fragment>
    )
}