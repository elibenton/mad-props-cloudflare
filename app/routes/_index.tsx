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

	const handleVote = (propId: string) => {
		const currentVote = votes[propId] || 'undecided'
		const newVote =
			currentVote === 'undecided' ? 'yes' : currentVote === 'yes' ? 'no' : 'undecided'
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
				<h2 className='text-2xl font-extrabold sticky top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-2 z-10 f'>
					California Propositions
				</h2>
				<div className='flex flex-col'>
					{stateProps.map((prop) => (
						<PropCard
							key={prop.location + prop.letter}
							prop={prop}
							vote={votes[`${prop.location}-${prop.letter}`]}
							onVote={(vote) => handleVote(`${prop.location}-${prop.letter}`)}
						/>
					))}
				</div>
			</section>

			<section className='mb-36'>
				{!isOpen ? (
					<div className='sticky top-0 sm:relative bg-white z-10 *:-mx-4 *:px-4'>
						<button onClick={() => setIsOpen(true)} className='w-full text-left'>
							<h2 className='text-2xl font-extrabold'>{userCity} Propositions</h2>
							<p className='text-sm border-b-2 border-black pb-2 italic'>
								If you are registered somewhere else, click here.
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
							onVote={(vote) => handleVote(`${prop.location}-${prop.letter}`, vote)}
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
	onVote: () => void
}) {
	const getVoteClass = (voteState: VoteState) => {
		switch (voteState) {
			case 'yes':
				return 'bg-green-100'
			case 'no':
				return 'bg-red-100'
			default:
				return 'bg-white'
		}
	}

	const getVoteText = (voteState: VoteState) => {
		switch (voteState) {
			case 'yes':
				return 'Yes'
			case 'no':
				return 'No'
			default:
				return ''
		}
	}

	return (
		<button
			className={`text-left border-b-2 border-black -mx-4 py-5 px-4 overflow-hidden group ${getVoteClass(
				vote
			)} relative`}
			onClick={onVote}>
			<div className='sm:max-w-4xl mx-auto flex flex-row relative justify-between'>
				<div className='space-y-4 -mr-16 sm:mr-0 max-w-2xl flex flex-col justify-between'>
					<div className='overflow-wrap'>
						<h3 className='text-xl font-semibold mb-2 '>
							<b>Prop {prop.letter}</b> {prop.title}
						</h3>
						<p>{prop.description}</p>
					</div>
					<div className='self-start space-x-2'>
						<Link
							to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
							prefetch='intent'
							className='border-2 border-black font-medium px-4 py-2 rounded inline-block bg-white text-black'>
							Learn More
						</Link>
						<button className='border-2 border-green-500 bg-green-100 font-sm px-2.5 py-1 rounded inline-block text-green-500 active:bg-green-500 active:text-green-900'>
							Yes
						</button>
						<button className='border-2 border-red-500 bg-red-100 font-sm px-2.5 py-1 rounded inline-block text-red-500 active:bg-red-500 active:text-red-900'>
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
		</button>
	)
}
