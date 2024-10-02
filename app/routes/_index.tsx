import { useState, useEffect } from 'react'
import { json, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link } from '@remix-run/react'
import { stateProps } from '../data/props.json'
import { localProps } from '../data/localProps.json'
import CityPicker from '../components/CityPicker'

interface Prop {
	letter: string
	title: string
	slug: string
	location: string
	description: string
	imageUrl: string
}

interface Vote {
	[key: string]: 'yes' | 'no' | 'undecided'
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { cf } = context.cloudflare
	const userCity = cf?.city

	return json({ userCity, stateProps, localProps })
}

export default function Index() {
	const { userCity: initialUserCity, stateProps, localProps } = useLoaderData<typeof loader>()

	const [userCity, setUserCity] = useState(initialUserCity)
	const [isOpen, setIsOpen] = useState(false)
	const [votes, setVotes] = useState<Vote>({})
	const [filteredLocalProps, setFilteredLocalProps] = useState<Prop[]>([])

	useEffect(() => {
		const savedVotes = localStorage.getItem('propVotes')
		if (savedVotes) {
			setVotes(JSON.parse(savedVotes))
		}
	}, [])

	useEffect(() => {
		setFilteredLocalProps(
			localProps.filter((prop) => prop.location.toLowerCase() === userCity?.toLowerCase())
		)
	}, [userCity, localProps])

	const handleCityChange = (newCity) => {
		setUserCity(newCity.name)
		setIsOpen(false)
	}

	// Handler for voting
	const handleVote = (propId: string, newVote: VoteState) => {
		const newVotes = { ...votes, [propId]: newVote }
		setVotes(newVotes)
		localStorage.setItem('propVotes', JSON.stringify(newVotes))
	}

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<div className='max-w-3xl'>
				<h1 className='text-4xl font-bold mb-4 bg-white '>MAD PROPS '24</h1>
				<p className='text-3xl font-serif italic mb-6'>
					A non-partisan, not-too-serious voter guide to the California ballot measures.
				</p>
				<p className='text-sm mb-12'>Learn more about this website here or dive in below!</p>
			</div>

			<section className='mb-36'>
				<h2 className='text-2xl font-extrabold sticky top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-3 z-10'>
					California Propositions
				</h2>
				<div className='flex flex-col'>
					{stateProps.map((prop) => (
						<PropCard
							key={prop.location + prop.letter}
							prop={prop}
							vote={votes[`${prop.location}-${prop.letter}`]}
							onVote={(newVote) => handleVote(`${prop.location}-${prop.letter}`, newVote)}
						/>
					))}
				</div>
			</section>

			<section className='mb-36'>
				{!isOpen ? (
					<div className='sticky top-0 sm:relative bg-white z-10 -mx-4 pt-3 px-4'>
						<button onClick={() => setIsOpen(true)} className='w-full text-left'>
							<h2 className='text-2xl font-extrabold'>{userCity} Propositions</h2>
							<p className='text-sm border-b-2 border-black -mx-4 px-4 pb-3 italic'>
								Registered somewhere else? Click here.
							</p>
						</button>
					</div>
				) : (
					<CityPicker onCityChange={handleCityChange} />
				)}
				<div className='flex flex-col'>
					{filteredLocalProps.map((prop) => (
						<PropCard
							key={prop.location + prop.letter}
							prop={prop}
							vote={votes[`${prop.location}-${prop.letter}`]}
							onVote={(newVote) => handleVote(`${prop.location}-${prop.letter}`, newVote)}
						/>
					))}
				</div>
			</section>
		</div>
	)
}

function PropCard({
	prop,
	vote = 'undecided',
	onVote
}: {
	prop: Prop
	vote?: VoteState
	onVote: (newVote: VoteState) => void
}) {
	return (
		// <Link
		// 	to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
		// 	prefetch='intent'>
		<div className='border-b-2 border-black -mx-4 py-5 px-4 overflow-hidden group relative flex flex-row justify-between'>
			<div className={`space-y-4 ${prop.imageUrl ? '-mr-16' : 'mr-0'} sm:mr-0`}>
				{/* Proposition title and description */}
				<h3 className='text-xl font-semibold mb-2'>
					<b>Prop {prop.letter}</b> {prop.title}
				</h3>
				<p>{prop.description}</p>
				<div className='space-x-2'>
					<button
						onClick={() => onVote('yes')}
						className={`z-10 border-2 border-green-500 font-sm px-2.5 py-1 rounded inline-block 
                ${vote === 'yes' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-500'}`}>
						Yes
					</button>
					<button
						onClick={() => onVote('no')}
						className={`z-10 border-2 border-red-500 font-sm px-2.5 py-1 rounded inline-block 
                ${vote === 'no' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
						No
					</button>
				</div>
			</div>
			{prop.imageUrl && (
				<img
					src={prop.imageUrl}
					alt={`Prop ${prop.letter}`}
					className='relative flex-none -right-16 sm:right-0 w-52 h-52 sm:w-72 sm:h-72 object-contain object-center p-1'
				/>
			)}
		</div>
		// </Link>
	)
}
