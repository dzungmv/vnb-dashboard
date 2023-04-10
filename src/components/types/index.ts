export interface UserTypes {
    user: {
        _id: string,
        username: string,
        email: string,
        role: string,
        verified: boolean
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
    quantity: number,
    stores: string[],
    description: string,
    createdAt: string,
    updatedAt: string
}


export type CartType = {
    _id: string,
    productId: string,
    product_name: string,
    product_image: string,
    product_price: number,
    product_quantity: number,
}

export type OrderType = {
    _id: string,
    products: CartType[],
    total: number,
    status: string,
    fullname: string,
    address: string,
    phone: string,
    payment: string,
    createdAt: string,
    updatedAt: string
}