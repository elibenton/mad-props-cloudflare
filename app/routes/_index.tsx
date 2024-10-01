import { useState, useEffect } from 'react'
import { json, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link } from '@remix-run/react'

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

	const stateProps: Prop[] = [
		{
			letter: '2',
			slug: 'school-bond',
			title: 'borrows $10 billion to build schools and colleges',
			description:
				'California doesn’t actually have permanent funding for school repairs, so it’s another bond.',
			imageUrl: '/images/3d-rooms-isometric-school-desks.png',
			location: 'California'
		},
		{
			letter: '3',
			title: 'enshrines the right to same sex marriage',
			description:
				'Of course, this is already legal in California, but Prop 8 is technically still on the books. With the Supreme Court the way it is, that has some worried.',
			slug: 'same-sex-marriage',
			imageUrl: '/images/3d-holidays-engagement-ring.png',
			location: 'California'
		},
		{
			letter: '4',
			title: 'borrows $10 billion for environmental projects',
			description:
				'Wildfires? Check. Drought? Check. Floods? Check. — Just about every climate disaster, California’s got ‘em. Should we spend on preventative measures?',
			slug: 'climate-bond',
			imageUrl: '/images/3d-fluency-wildfire.png',
			location: 'California'
		},
		{
			letter: '5',
			title: 'makes it easier for local governments to borrow money',
			description:
				'Usually it requires a 66% majority. Vote yes to lower that threshold to 55%.',
			slug: 'voting-threshold',
			imageUrl: '/images/3d-fluency-ballot.png',
			location: 'California'
		},
		{
			letter: '6',
			title: 'make forced labor in California prisons illegal',
			description:
				'If this sounds like slavery, well, many argue it is. A similar measure tanked in 2022 because it was estimated it would cost $1.5 billion to pay the states prisoners for their labor',
			slug: 'same-sex-marriage',
			imageUrl: 'images/3d-fluency-handcuffs.png',
			location: 'California'
		},
		{
			letter: '32',
			title: 'raises the minimum wage to $18 an hour',
			description:
				'California was the first in the nation to raise the minimum wage to $15 in 2022. Will we keep the title this year? Will we do it again this year?',
			slug: 'minimum-wage',
			imageUrl: '/images/casual-life-3d-cash-and-coins.png',
			location: 'California'
		},
		{
			letter: '33',
			title: 'allows cities to impose rent control',
			description:
				'That’s right. This prop would only affect one organization. And the main reason — it wants it to stop spending money on other props. It’s complicated, and amazingly petty.',
			slug: 'local-rent-control',
			imageUrl: '/images/3d-fluency-room.png',
			location: 'California'
		},
		{
			letter: '34',
			title: 'forces a massive healthcare provider to use its money on patients',
			description:
				'California was the first in the nation to raise the minimum wage to $15 in 2022. Will we keep the title this year? Will we do it again this year?',
			slug: 'patient-spending',
			imageUrl: '/images/business-3d-opened-yellow-bottle-of-pills.png',
			location: 'California'
		},
		{
			letter: '35',
			title: 'makes permanent a healthcare tax that goes to Medi-Cal',
			description:
				'A third of the state uses the low-income program. The entire healthcare industry supports this. Newsome said he would do it, but is now back-tracking. This would hold him to his word.',
			slug: 'health-care-tax',
			imageUrl: '/images/business-3d-syringe-with-blue-liquid.png',
			location: 'California'
		},
		{
			letter: '36',
			title: 'increases some petty theft and drug crimes to felonies',
			description:
				'Ten years ago, these were felonies and voters approved a prop that would make them misdemeanors. Now, post covid, post doom loop, many want to change it back.',
			slug: 'criminal-penalties',
			imageUrl: '/images/3d-fluency-police-badge.png',
			location: 'California'
		}
		// ... add more props
	]

	const localProps: Prop[] = [
		{
			letter: 'A',
			slug: 'parking-reform',
			title: 'Parking Reform Initiative',
			description:
				'Reduce minimum parking requirements for new developments to promote affordable housing and sustainable transportation.',
			imageUrl: '/images/parking.png',
			location: 'Los Angeles'
		},
		{
			letter: 'B',
			slug: 'rent-control-expansion',
			title: 'Expand Rent Control',
			description:
				'Extend rent control protections to buildings constructed between 1978 and 1995.',
			imageUrl: '/images/apartment.png',
			location: 'Santa Monica'
		},
		{
			letter: 'C',
			slug: 'beach-access',
			title: 'Improve Beach Access',
			description:
				'Fund new public transportation routes and parking facilities to increase accessibility to beaches.',
			imageUrl: '/images/beach.png',
			location: 'Malibu'
		},
		{
			letter: 'D',
			slug: 'urban-farming',
			title: 'Urban Farming Initiative',
			description:
				'Allow and promote urban farming in residential areas to increase local food production and sustainability.',
			imageUrl: '/images/farm.png',
			location: 'Pasadena'
		},
		{
			letter: 'E',
			slug: 'homeless-services',
			title: 'Homeless Services Funding',
			description:
				'Increase funding for homeless services and affordable housing through a new business tax.',
			imageUrl: '/images/shelter.png',
			location: 'Long Beach'
		},
		{
			letter: 'F',
			slug: 'clean-energy',
			title: 'Clean Energy Transition',
			description:
				'Require all new buildings to include solar panels and transition city operations to 100% renewable energy by 2030.',
			imageUrl: '/images/solar-panel.png',
			location: 'Berkeley'
		}
	]

	return json({ userCity, stateProps, localProps })
}

export default function Index() {
	const { userCity, stateProps, localProps } = useLoaderData<typeof loader>()

	const filteredLocalProps = localProps.filter(
		(prop) => prop.location.toLocaleLowerCase() === userCity?.toLowerCase()
	)

	const [votes, setVotes] = useState<Vote>({})

	useEffect(() => {
		const savedVotes = localStorage.getItem('propVotes')
		if (savedVotes) {
			setVotes(JSON.parse(savedVotes))
		}
	}, [])

	const handleVote = (propId: string) => {
		const currentVote = votes[propId] || 'undecided'
		const newVote: VoteState =
			currentVote === 'undecided' ? 'yes' : currentVote === 'yes' ? 'no' : 'undecided'
		const newVotes = { ...votes, [propId]: newVote }
		setVotes(newVotes)
		localStorage.setItem('propVotes', JSON.stringify(newVotes))
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-4xl font-bold mb-4 bg-white '>MAD PROPS '24</h1>

			<p className='text-3xl font-serif italic mb-6'>
				A non-partisan, not-too-serious voter guide to the California ballot measures.
			</p>
			<p className='text-sm mb-12'>Learn more about this website here or dive in below!</p>

			<section className='mb-36'>
				<h2 className='text-2xl font-extrabold sticky top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-2 z-10 f'>
					California Propositions
				</h2>
				<div>
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
				<h2 className='text-2xl font-extrabold sticky top-0 sm:relative bg-white border-b-2 border-black -mx-4 px-4 py-2 z-10'>
					{userCity} Propositions
				</h2>
				<div>
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
			className={`text-left border-b-2 border-black -mx-4 sm:mx-0 py-6 px-4 overflow-hidden group ${getVoteClass(
				vote
			)} relative`}
			onClick={onVote}>
			<div className='max-w-3xl mx-auto flex flex-row relative'>
				<div className='flex-grow space-y-4 -mr-16 sm:mr-0'>
					<h3 className='text-xl font-semibold mb-2'>
						<b>Prop {prop.letter}</b> {prop.title}
					</h3>
					<p>{prop.description}</p>
					<Link
						to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
						className='border-2 border-black font-medium px-4 py-2 rounded inline-block bg-white text-black'>
						Learn More
					</Link>
				</div>
				<img
					src={prop.imageUrl}
					alt={`Prop ${prop.letter}`}
					className='relative flex-none -right-16 sm:right-0 w-52 h-52 sm:w-72 sm:h-72 object-contain object-center p-1'
				/>
			</div>
		</button>
	)
}
