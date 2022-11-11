import React, { useEffect, useState } from 'react'


const Page = ({ cls, page }) => {
    return (
        <li
            className={`pagination__page ${cls}`}
            data-page={page}>{page}
        </li>
    )
}

const PagePrevNext = ({ goTo, buttonType, display }) => {
    var cls = 'pagination__arrow_' + buttonType
    cls += display ? '' : ' pagination__arrow_hidden'
    return <li className={`pagination__arrow ${cls}`} data-page={goTo}></li>

}

export const Pagination = ({ totalPage, handleClick, currentPage }) => {
    const [pageArray, setPageArray] = useState([])

    useEffect(() => {
        const pageArray = Array.from(Array(totalPage).keys())
        setPageArray(pageArray)
    }, [totalPage])

    const handlePage = (pageIndex) => {
        const page = pageIndex + 1

        const limit = 8
        const preservedDistanceToEdge = 2
        const distanceToLastPage = Math.abs(totalPage - page)
        const distanceToCurrent = Math.abs(page - currentPage)
        const isEdgePage = page === totalPage || page === 1
        const isLastPreservedRange = (totalPage - currentPage) < preservedDistanceToEdge
            && (distanceToLastPage < preservedDistanceToEdge)
        let isFirstPreservedRange = page <= preservedDistanceToEdge + 1
            && currentPage <= preservedDistanceToEdge + 1
        const configs = {
            page,
            cls: '' + (page === currentPage ? 'pagination__page_current' : '')
        }

        if (currentPage == preservedDistanceToEdge + 1 && totalPage > limit) {
            isFirstPreservedRange = false
        }

        /* truncated */
        if (totalPage >= limit
            && currentPage !== page
            && !isEdgePage
            && !isFirstPreservedRange
            && !isLastPreservedRange
            && distanceToCurrent > 1) {
            return <li key={page} className="pagination__page pagination__page_truncated">...</li>
        }

        return <Page {...configs} key={page} />
    }

    return (
        <ul className="pagination" onClick={handleClick}>
            <PagePrevNext
                buttonType="prev"
                goTo={currentPage - 1}
                display={currentPage !== 1} />

            <ul className="pagination__nav">
                {pageArray.map((_, index) => handlePage(index))}
            </ul>

            <PagePrevNext
                buttonType="next"
                goTo={currentPage + 1}
                display={currentPage !== totalPage} />
        </ul>
    )
}
