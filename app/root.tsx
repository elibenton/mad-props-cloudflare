import type { LinksFunction, MetaFunction } from '@remix-run/cloudflare'
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

import './tailwind.css'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous'
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
	}
]

export const meta: MetaFunction = ({ location }) => {
	if (location.pathname === '/') {
		return [
			{ title: `MAD PROPS '24` },
			{
				property: 'og:title',
				content: "MAD PROPS '24"
			},
			{
				name: 'description',
				content:
					'A non-partisan, not-too-serious voter guide to the California ballot measures.'
			}
		]
	} else {
		return [
			{ title: location.pathname },
			{
				property: 'og:title',
				content: location.pathname
			},
			{
				name: 'description',
				content: 'Description for ' + location.pathname
			}
		]
	}
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body className='flex flex-col min-h-screen'>
				<section className='top-0 sticky w-full text-xs text-white bg-gray-800 text-center p-2 z-50'>
					This site is under construction. Information is not verified!
				</section>
				<section className='flex-grow'>{children}</section>
				<section className='mt-auto w-full border-t-2 border-black flex flex-col sm:flex-row justify-between p-4'>
					<div className='mt-2 mb-6'>
						<Link prefetch='viewport' to='/'>
							<h1 className='text-lg font-bold'>MAD PROPS 2024</h1>
						</Link>
						<a href='https://registertovote.ca.gov/'>Register to vote in California</a>
					</div>
					<div className='flex flex-row space-x-4'>
						<ul>
							<li>
								<Link prefetch='viewport' to='/about'>
									About
								</Link>
							</li>
							<li>
								<Link prefetch='viewport' to='/terms'>
									Terms
								</Link>
							</li>
						</ul>
						<ul>
							<li>
								<a href='https://www.kalw.org/'>KALW</a>
							</li>
							<li>
								<a href='https://www.pacificreview.org/'>The Pacific Review</a>
							</li>
						</ul>
					</div>
				</section>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}
