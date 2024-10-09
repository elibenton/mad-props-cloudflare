// app/routes/$location.$propName.tsx
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link } from '@remix-run/react'
import { stateProps } from '../data/props.json'
import { localProps } from '../data/localProps.json'
// import v from 'voca'

interface Prop {
	letter: string
	title: string
	slug: string
	location: string
	description: string
	imageUrl: string
	index: number
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { location, propName } = params

	// const detailedProp = stateProps.filter(
	// 	(prop) =>
	// 		prop.location.toLowerCase() === location.toLowerCase() &&
	// 		prop.letter.toLowerCase() === propName.slice(-1).toLowerCase()
	// )

	// return json({ detailedProp })
}

export default function PropDetail() {
	// const { detailedProp } = useLoaderData<typeof loader>()
	// console.log(detailedProp)
	// return (
	// 	<div className='container mx-auto p-4'>
	// 		{/* <nav className='mb-4'>
	// 			<Link to='/' className='text-blue-500 hover:underline'>
	// 				&larr; Back to All Props
	// 			</Link>
	// 		</nav> */}
	// 		<div className=' p-6 mb-6'>
	// 			<h2 className='text-3xl font-semibold mb-2'>
	// 				Prop {detailedProp[0].letter} {detailedProp[0].title}
	// 			</h2>
	// 			<h3 className='text-xl font-semibold mb-2'>{detailedProp[0].location}</h3>
	// 			<p className='mb-4'>{detailedProp[0].description}</p>
	// 			<p className='text-red-600'>More information coming soon!</p>
	// 			{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
	// 				<div className='bg-green-100 p-4 rounded'>
	// 					<h3 className='font-semibold text-green-800'>Yes Vote Means</h3>
	// 					<p>{propDetail.yesVote}</p>
	// 				</div>
	// 				<div className='bg-red-100 p-4 rounded'>
	// 					<h3 className='font-semibold text-red-800'>No Vote Means</h3>
	// 					<p>{propDetail.noVote}</p>
	// 				</div>
	// 			</div> */}
	// 			{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
	// 				<div>
	// 					<h3 className='font-semibold mb-2'>Proponents</h3>
	// 					<ul className='list-disc pl-5'>
	// 						{propDetail.proponents.map((proponent, index) => (
	// 							<li key={index}>{proponent}</li>
	// 						))}
	// 					</ul>
	// 				</div>
	// 				<div>
	// 					<h3 className='font-semibold mb-2'>Opponents</h3>
	// 					<ul className='list-disc pl-5'>
	// 						{propDetail.opponents.map((opponent, index) => (
	// 							<li key={index}>{opponent}</li>
	// 						))}
	// 					</ul>
	// 				</div>
	// 			</div> */}
	// 		</div>
	// 	</div>
	// )
}
