import Link from 'next/link'
import { useEffect, useState } from 'react'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getChatMessages } from '@/repository/chatMessages/getChatMessages'
import { getShop } from '@/repository/shops/getShop'
import { ChatMessage, Shop } from '@/types'
import { checkIsImage } from '@/utils/image'

type Props = {
    chatRoomId: string // Unique identifier for the chat room
    shopId: string // Identifier for the shop associated with the chat
}

export default function ChatPreview({ chatRoomId, shopId }: Props) {
    const [shop, setShop] = useState<Shop>() // State to store shop details
    const [lastMessage, setLastMessage] = useState<ChatMessage>() // State to store the last chat message

    // Fetches shop information and the last chat message
    useEffect(() => {
        ;(async () => {
            const [
                { data: shop }, // Fetch shop details
                {
                    data: [lastMessage], // Fetch the most recent chat message
                },
            ] = await Promise.all([
                getShop(shopId),
                getChatMessages({
                    chatRoomId,
                    fromIndex: 0,
                    toIndex: 1,
                }),
            ])
            setShop(shop) // Updates the shop state
            setLastMessage(lastMessage) // Updates the last message state
        })()
    }, [chatRoomId, shopId])

    // If data is not yet loaded, render nothing
    if (!shop || !lastMessage) {
        return (
            <div className="flex justify-center items-center h-20 shrink-0">
                <Spinner />
            </div>
        )
    }

    return (
        <Link href={`/messages/${chatRoomId}`} prefetch={false} shallow>
            <div className="flex py-3 hover:bg-lightestBlue  h-20 shrink-0">
                {/* Displays the shop's profile image */}
                <div className="mx-3">
                    <ShopProfileImage imageUrl={shop.imageUrl || undefined} />
                </div>

                {/* Displays the shop's name and the last chat message */}
                <div className="flex flex-col mx-3 flex-1 w-0">
                    <Text size="lg" weight="bold">
                        {shop.name}
                    </Text>
                    <div className="truncate">
                        <Text size="sm" color="grey">
                            {checkIsImage(lastMessage.message)
                                ? '[Image]'
                                : lastMessage.message}
                        </Text>
                    </div>
                </div>
            </div>
        </Link>
    )
}