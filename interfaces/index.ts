interface Shoe{
    brand:string
    createdAt:{
        seconds:number
    }
    shoeId:string
    manufacturer:string
    name:string
    color:string
    description:string
    for:string
    thumbnail:string
    rating:number
    reviews:number
    sellingPrice:number
    sizes:number[]
    stocks:number[]
    images:string[]
}

interface Accessory{
    accessoryId:string
    name:string
    thumbnail:string
    rating:number
    reviews:number
    sellingPrice:number
    sizes:number[]
    stocks:number[]
    images:string[]
}

interface Review{
    review:{
        rating:number
        description:string
    }
    username:string
    createdAt:{
        seconds:number
    }
}