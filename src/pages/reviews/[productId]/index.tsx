import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import MarkdownEditorSkeleton from '@/components/shared/MarkdownEditor/Skeleton'
import { getMe } from '@/repository/me/getMe'
import { getProduct } from '@/repository/products/getProduct'
import { getReviewByProductId } from '@/repository/reviews/getReviewByProductId'
import { Product, Review } from '@/types'
import { AuthError } from '@/utils/error'

// Fetches product and review data during server-side rendering (서버사이드 렌더링 중 상품 및 리뷰 데이터를 가져옴)
export const getServerSideProps: GetServerSideProps<{
    product: Product
    review: Review | null
}> = async (context) => {
    try {
        const {
            data: { shopId },
        } = await getMe()

        if (!shopId) {
            throw new AuthError()
        }

        const productId = context.query.productId as string
        const [{ data: product }, { data: review }] = await Promise.all([
            getProduct(productId),
            getReviewByProductId(productId),
        ])
        return {
            props: { product, review },
        }
    } catch (e) {
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
                    permanent: false,
                },
            }
        }
        throw e
    }
}

const MarkdownEditor = dynamic(
    () => import('@/components/shared/MarkdownEditor'),
    {
        ssr: false,
        loading: () => <MarkdownEditorSkeleton />,
    },
)

export default function ReviewPage({
    product,
    review,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [value, setValue] = useState<string>(review?.contents || '') // Initializes textarea with existing review contents (리뷰 내용으로 텍스트 영역 초기화)

    // Handles review submission (리뷰 제출을 처리하는 함수)
    const handleSubmit = () => {
        alert(value) // Displays the review contents in an alert (리뷰 내용을 알림으로 표시)
    }

    return (
        <Wrapper>
            <Container>
                {/* Page Header (페이지 헤더) */}
                <div className="my-5">
                    <Text size="xl" color="uclaBlue">
                        {product.title}
                    </Text>
                    {/* 이 제품에 대한 후기를 작성해주세요. */}
                    <Text size="xl" weight="light">
                        {' '}
                        : Please write a review for this product.{' '}
                    </Text>
                </div>

                {/* Review Textarea and Submit Button (리뷰 입력 및 제출 버튼) */}
                <div>
                    <MarkdownEditor
                        initialValue={value}
                        disabled={!!review}
                        handleOnChage={(value) => setValue(value)}
                    />
                    {/* Submit */}
                    <div className="flex justify-end mt-2">
                        <Button
                            color="uclaBlue"
                            onClick={handleSubmit}
                            disabled={!!review}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Container>
        </Wrapper>
    )
}
