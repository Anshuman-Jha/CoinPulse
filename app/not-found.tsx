import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-7xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-4">
                <Link href="/">
                    <Button>Go Back Home</Button>
                </Link>
            </div>
        </div>
    );
}
