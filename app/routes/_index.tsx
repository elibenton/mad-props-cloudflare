import { useState, useEffect } from 'react'
import { json, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { stateProps } from '../data/props.json'
import { localProps } from '../data/localProps.json'
import CityPicker from '../components/CityPicker'
import PropCard from '../components/PropCard'

interface Prop {
	letter: string
	title: string
	slug: string
	location: string
	description: string
	imageUrl: string
	index: number
	type: string
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
				<h2 className='text-2xl font-extrabold sticky top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-3 z-20'>
					California Propositions
				</h2>
				<div className='flex flex-col'>
					{stateProps.map((prop, index) => (
						<PropCard
							key={prop.location + prop.letter}
							prop={prop}
							vote={votes[`${prop.location}-${prop.letter}`]}
							onVote={(newVote) => handleVote(`${prop.location}-${prop.letter}`, newVote)}
							index={index}
						/>
					))}
				</div>
			</section>

			<section className='mb-36 min-h-72'>
				{!isOpen ? (
					<div className='sticky top-0 sm:relative bg-white z-10 -mx-4 pt-3 px-4 z-20'>
						<button onClick={() => setIsOpen(true)} className='w-full text-left'>
							<h2 className='text-2xl font-extrabold z-20'>{userCity} Propositions</h2>
							<p className='text-sm border-b-2 border-black -mx-4 px-4 pb-3 italic'>
								Registered somewhere else? Click here.
							</p>
						</button>
					</div>
				) : (
					<CityPicker onCityChange={handleCityChange} />
				)}
				<div className='flex flex-col'>
					{filteredLocalProps.length === 0 ? (
						<div className='py-3'>
							<p>There appear to be no local propositions in {userCity}.</p>
							<p>
								{' '}
								Have we made a mistake? Please email us at{' '}
								<a className='underline' href='mailto:mail@madprops2024.org'>
									mail@madprops2024.org
								</a>
								.
							</p>
						</div>
					) : (
						filteredLocalProps.map((prop, index) => (
							<PropCard
								key={prop.location + prop.letter}
								prop={prop}
								vote={votes[`${prop.location}-${prop.letter}`]}
								onVote={(newVote) => handleVote(`${prop.location}-${prop.letter}`, newVote)}
								index={index}
							/>
						))
					)}
				</div>
			</section>
		</div>
	)
}
