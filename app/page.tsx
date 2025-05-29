import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			{/* Background Image Layer */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/bg.jpg"
					alt="Background"
					fill
					style={{ objectFit: 'cover', opacity: 0.2 }}
					priority
				/>
			</div>

			{/* Foreground Content */}
			<main className="z-10 flex flex-col gap-6 row-start-2 items-center text-center sm:items-start sm:text-left">
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<Image
						className="dark:invert"
						src="/letter-v.png"
						alt="VeoWeb logo"
						width={160}
						height={40}
						priority
					/>
					<div className='flex flex-col gap-4'>
						<h1 className="text-2xl sm:text-3xl font-bold">
							Welcome to VeoWeb 👋
						</h1>
						<p className="max-w-lg text-sm sm:text-base text-gray-600 dark:text-gray-400">
							VeoWeb is a web-based GUI for managing customizable tables and
							menus. Create schemas, add data, and visualize everything in one
							place — no code required.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<Link
								href="https://github.com/shovian/common-webgui"
								className="flex-row gap-4 font-semibold rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6"
							>
								<div>{'🚀'}</div>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</main>

			<footer className="z-10 row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500 dark:text-gray-400">
				<span>© {new Date().getFullYear()} ShoVeo</span>
				<a
					className="hover:underline"
					href="https://nextjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Built with Next.js
				</a>
			</footer>
		</div>
	);
}
