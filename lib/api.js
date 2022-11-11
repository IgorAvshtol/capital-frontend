export function getStrapiUrl(path = '', host = null) {
    return `${host ? host : process.env.NEXT_PUBLIC_STRAPI_HOST}${path}`
}

export async function fetchApi(path, host = null) {
    const requestUrl = getStrapiUrl(path, host)
    const response = await fetch(requestUrl)
    const data = await response.json()
    return data
}