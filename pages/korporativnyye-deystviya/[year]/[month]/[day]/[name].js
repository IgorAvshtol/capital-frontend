import React from 'react'
import pdfHelper from '../../../../../lib/pdfHelper'


class NamePage extends React.Component {
    render() {
        return <div />
    }
}

export async function getServerSideProps({ res, params }) {

    const { readFileSync } = require('fs')
    const html = readFileSync(`./public/corp-dv/${params.year}/${params.month}/${params.day}/${params.name}`, "utf8")

    const buffer = await pdfHelper.componentToPDFBuffer(html)
    res.setHeader('Content-disposition', 'attachment; filename="article.pdf')
    res.setHeader('Content-Type', 'application/pdf')
    res.end(buffer)

    return { props: {} }

}

export default NamePage