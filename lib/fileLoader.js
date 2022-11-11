export const fileLoader = ({ src }) => {
    return `${process.env.NEXT_PUBLIC_STRAPI_HOST}${src}`
}