export interface UserTypes {
    user: {
        id: string,
        username: string,
        email: string
    },
    tokens: {
        accessToken: string,
        refreshToken: string
    }
}



export type ProductTypes = {
    _id: string,
    name: string,
    slug: string,
    image: string,
    type: string,
    price: number,
    price_market: number,
    brand: string,
    endows: string[],
    sizes: {
        size_name: string,
        quantity: number
    }[],
    stores: string[],
    description: string,

}