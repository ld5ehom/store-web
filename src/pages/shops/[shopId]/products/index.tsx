import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ShopLayout from '../../_components/ShopLayout'
import ProductList from './_components/ProductList'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopFollowingCount } from '@/repository/shops/getShopFollowingCount'
import { getShopLikeCount } from '@/repository/likes/getShopLikeCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { Product, Shop } from '@/types'

export const getServerSideProps: GetServerSideProps<{
    isMyShop: boolean
    shop: Shop
    productCount: number
    reviewCount: number
    likeCount: number
    followingCount: number
    followerCount: number
    products: Product[]
}> = async (context) => {
    const shopId = context.query.shopId as string

    const [
        {
            data: { shopId: myShopId },
        },
        { data: shop },
        { data: productCount },
        { data: reviewCount },
        { data: likeCount },
        { data: followingCount },
        { data: followerCount },
        { data: products },
    ] = await Promise.all([
        getMe(),
        getShop(shopId),
        getShopProductCount(shopId),
        getShopReviewCount(shopId),
        getShopLikeCount(shopId),
        getShopFollowingCount(shopId),
        getShopFollowerCount(shopId),
        getShopProducts({ shopId, fromPage: 0, toPage: 1 }),
    ])

    return {
        props: {
            isMyShop: myShopId === shopId,
            shop,
            productCount,
            reviewCount,
            likeCount,
            followingCount,
            followerCount,
            products,
        },
    }
}

export default function ShopProducts({
    isMyShop,
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ShopLayout
            isMyShop={isMyShop}
            shop={shop}
            productCount={productCount}
            reviewCount={reviewCount}
            likeCount={likeCount}
            followingCount={followingCount}
            followerCount={followerCount}
            currentTab="products"
        >
            <div className="mt-9 mb-5 text-center">
                <Text size="lg"> Products : </Text>
                <Text size="2xl" color="uclaBlue">
                    {productCount.toLocaleString()}
                </Text>
            </div>

            {/* Seller Shop Product List */}
            <ProductList
                initialProducts={products}
                count={productCount}
                shopId={shop.id}
            />
        </ShopLayout>
    )
}
