import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

interface Props {
    handleSetType: (type?: 'login' | 'signup') => void
}

export default function Login({ handleSetType }: Props) {
    return (
        <form className="my-2 flex flex-col gap-2 w-full">
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="password" required />

            <div className="flex flex-col gap-2 w-full">
                <Button outline className="bg-uclaBlue !text-uclaGold">
                    Login
                </Button>

                <Button
                    className="bg-uclaBlue !text-uclaGold"
                    onClick={() => handleSetType('signup')}
                >
                    Sign Up
                </Button>
            </div>
        </form>
    )
}