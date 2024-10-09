import { useState, useEffect } from 'react'
import { json, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare'
import { Link, useLoaderData, useFetcher } from '@remix-run/react'
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

// Add this type for the environment
interface Env {
	MAD_PROPS_DATA: KVNamespace
}

// Generate a unique user ID
function generateUserId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const { cf, env } = context.cloudflare as { cf: any; env: Env }
	const userCity = cf?.city

	// Get or set user ID from cookie
	const cookieHeader = request.headers.get('Cookie') || ''
	const userId = cookieHeader.includes('userId=')
		? cookieHeader.split('userId=')[1].split(';')[0]
		: generateUserId()

	// Fetch votes from KV store
	const votesJson = await env.MAD_PROPS_DATA.get(userId)
	const votes = votesJson ? JSON.parse(votesJson) : {}

	return json(
		{ userCity, stateProps, localProps, votes },
		{
			headers: {
				'Set-Cookie': `userId=${userId}; Path=/; HttpOnly; Secure; SameSite=Strict`
			}
		}
	)
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { env } = context.cloudflare as { env: Env }
	const formData = await request.formData()
	const propId = formData.get('propId') as string
	const vote = formData.get('vote') as 'yes' | 'no' | 'undecided'

	const cookieHeader = request.headers.get('Cookie') || ''
	const userId = cookieHeader.includes('userId=')
		? cookieHeader.split('userId=')[1].split(';')[0]
		: generateUserId()

	// Fetch current votes
	const votesJson = await env.MAD_PROPS_DATA.get(userId)
	const votes = votesJson ? JSON.parse(votesJson) : {}

	// Update votes
	votes[propId] = vote

	// Store updated votes
	await env.MAD_PROPS_DATA.put(userId, JSON.stringify(votes))

	return json({ success: true })
}

export default function Index() {
	const {
		userCity: initialUserCity,
		stateProps,
		localProps,
		votes: initialVotes
	} = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	const [userCity, setUserCity] = useState(initialUserCity)
	const [isOpen, setIsOpen] = useState(false)
	const [votes, setVotes] = useState<Vote>(initialVotes)
	const [filteredLocalProps, setFilteredLocalProps] = useState<Prop[]>([])

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
	const handleVote = (propId: string, newVote: 'yes' | 'no' | 'undecided') => {
		fetcher.submit({ propId, vote: newVote }, { method: 'post' })
		setVotes((prev) => ({ ...prev, [propId]: newVote }))
	}

	return (
		<div className='max-w-4xl mx-auto px-4 py-8 sm:py-20'>
			<div className='max-w-3xl space-y-4 mb-24'>
				<h1 className='text-4xl sm:text-5xl font-bold mb-8'>MAD PROPS '24</h1>
				<p className='text-2xl font-serif italic w-full sm:w-3/4'>
					A non-partisan, not-too-serious voter guide to the California ballot measures.
				</p>
				<p className='w-full sm:w-3/4'>
					Election Day is November 5th! In California, ballots are already in the mail. There's
					still plenty for new voters to register. Learn more about this project{' '}
					<Link to='/about'>
						<span className='underline'>here</span>
					</Link>
					, or go ahead and jump in!
				</p>
			</div>

			<section className='mb-36'>
				<h2 className='text-2xl font-extrabold sticky top-8 sm:top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-3 z-20'>
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
					<div className='sticky top-8 sm:top-0 sm:relative bg-white -mx-4 pt-3 px-4 z-20'>
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
