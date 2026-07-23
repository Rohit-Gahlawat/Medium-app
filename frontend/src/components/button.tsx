import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
type Content = {
    text: string
    onClick: () => void | Promise<void>
    loading?: boolean
    loadingText?: string
}
export default function Buttons({ text, onClick, loading, loadingText }: Content) {
    return (
        <Stack spacing={2} className='w-full'>

            <Button onClick={onClick} disabled={loading} className='!bg-black !w-full !rounded-xl disabled:!bg-gray-400 disabled:!text-white' variant="contained">
                {loading
                    ? <span className='flex items-center gap-2'>
                        <span className='h-4 w-4 rounded-full border-2 border-gray-200 border-t-white animate-spin inline-block' />
                        {loadingText || "Please wait..."}
                    </span>
                    : text}
            </Button>

        </Stack>
    );
}
