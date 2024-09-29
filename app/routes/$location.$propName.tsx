// app/routes/$location.$propName.tsx
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link } from '@remix-run/react'

interface PropDetail {
	letter: string
	title: string
	location: string
	yesVote: string
	noVote: string
	proponents: string[]
	opponents: string[]
	description: string
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { location, propName } = params

	// In a real application, you would fetch this data from an API or database
	// based on the location and propName parameters
	const propDetail: PropDetail = {
		letter: propName?.toUpperCase() ?? '',
		title: `Proposition ${propName?.toUpperCase()}`,
		location: location === 'state' ? 'California' : location ?? '',
		yesVote: 'Support the proposition',
		noVote: 'Oppose the proposition',
		proponents: ['Proponent Organization 1', 'Proponent Individual 1'],
		opponents: ['Opponent Organization 1', 'Opponent Individual 1'],
		description: 'Detailed description of the proposition...'
	}

	return json({ propDetail })
}

export default function PropDetail() {
	const { propDetail } = useLoaderData<typeof loader>()

	return (
		<div className='container mx-auto p-4'>
			<nav className='mb-4'>
				<Link to='/' className='text-blue-500 hover:underline'>
					&larr; Back to All Props
				</Link>
			</nav>

			<h1 className='text-3xl font-bold mb-4'>
				{propDetail.location} Proposition {propDetail.letter}: {propDetail.title}
			</h1>

			<div className='bg-white shadow-md rounded-lg p-6 mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Summary</h2>
				<p className='mb-4'>{propDetail.description}</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
					<div className='bg-green-100 p-4 rounded'>
						<h3 className='font-semibold text-green-800'>Yes Vote Means</h3>
						<p>{propDetail.yesVote}</p>
					</div>
					<div className='bg-red-100 p-4 rounded'>
						<h3 className='font-semibold text-red-800'>No Vote Means</h3>
						<p>{propDetail.noVote}</p>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<h3 className='font-semibold mb-2'>Proponents</h3>
						<ul className='list-disc pl-5'>
							{propDetail.proponents.map((proponent, index) => (
								<li key={index}>{proponent}</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className='font-semibold mb-2'>Opponents</h3>
						<ul className='list-disc pl-5'>
							{propDetail.opponents.map((opponent, index) => (
								<li key={index}>{opponent}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
