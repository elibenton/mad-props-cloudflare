import { json, MetaFunction, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link } from '@remix-run/react'
import { useState } from 'react'

export const meta: MetaFunction = () => {
	return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

interface Prop {
	letter: string
	title: string
	location: string
	description: string
	imageUrl: string
}

interface LoaderData {
	userCity: string | null
	stateProps: Prop[]
	localProps: Prop[]
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const cf = context.cloudflare as { city?: string; region?: string } | undefined
	let userCity = null

	console.log(cf)
	// console.log(url)
	console.log(userCity)

	if (cf?.region === 'California') {
		userCity = cf.city || null
	}

	// Fetch state and local props data here
	// For demonstration, we're using static data
	const stateProps: Prop[] = [
		{
			letter: 'A',
			title: 'Education Funding',
			description: 'Increase funding for public schools',
			imageUrl: '/images/prop-a.jpg',
			location: 'California'
		}
		// ... add more props
	]

	const localProps: Prop[] = userCity
		? [
				{
					letter: '1',
					title: 'Local Park Renovation',
					description: 'Fund renovation of city parks',
					imageUrl: '/images/local-prop-1.jpg',
					location: 'berkeley'
				}
				// ... add more local props
		  ]
		: []

	return json({ userCity, stateProps, localProps })
}

export default function Index() {
	const { userCity, stateProps, localProps } = useLoaderData<typeof loader>()
	const [manualCity, setManualCity] = useState('')

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-4xl font-bold mb-8'>Mad Props 2024</h1>

			<section className='mb-12'>
				<h2 className='text-2xl font-semibold mb-4'>California State Propositions</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{stateProps.map((prop) => (
						<PropCard key={prop.letter} prop={prop} />
					))}
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-semibold mb-4'>Local Propositions</h2>
				{userCity ? (
					<>
						<p className='mb-4'>It appears you live in {userCity}.</p>
						<button className='text-blue-500 underline' onClick={() => setManualCity('')}>
							Enter manually instead?
						</button>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
							{localProps.map((prop) => (
								<PropCard key={prop.letter} prop={prop} />
							))}
						</div>
					</>
				) : (
					<div className='mb-4'>
						<label htmlFor='cityInput' className='block mb-2'>
							Where are you registered to vote? We'll show you your local props:
						</label>
						<input
							id='cityInput'
							type='text'
							value={manualCity}
							onChange={(e) => setManualCity(e.target.value)}
							className='border p-2 rounded'
						/>
					</div>
				)}
			</section>
		</div>
	)
}

function PropCard({ prop }: { prop: Prop }) {
	return (
		<div className='border rounded-lg p-4 shadow-md'>
			<h3 className='text-xl font-semibold mb-2'>
				Prop {prop.letter}: {prop.title}
			</h3>
			<p className='mb-4'>{prop.description}</p>
			<img
				src={prop.imageUrl}
				alt={`Prop ${prop.letter}`}
				className='w-full h-40 object-cover mb-4'
			/>
			<Link
				to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
				className='bg-blue-500 text-white px-4 py-2 rounded inline-block'>
				Learn More
			</Link>
		</div>
	)
}
